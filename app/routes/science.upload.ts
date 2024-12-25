import type {Route} from "../../.react-router/types/app/routes/+types/science.upload";
import {FileUpload} from "@mjackson/form-data-parser";
import {csrf} from "~/server/csrf";
import {fileStorage, getStorageKey} from "~/server/uploads";
import {parseMultipartRequest} from "@mjackson/multipart-parser";
import {CSRFError} from "remix-utils/csrf/server";
import {commitSession, destroySession, getSession, NULL_SVR, validateSessionObject} from "~/server/session";
import {nanoid} from "nanoid";
import {sql} from "~/server/data-sources";
import {getIndex} from "~/server/search";
import {resolveCategoryName, resolveDocTypeName} from "~/util/doc-details";

export interface APIResponse {
  success: boolean,
  message: "success" | "authentication" | "csrf" | "internal" | "missing-info" | "document-already-exists"
}

/**
 * Uploads a file. The expected `FormData` arguments are as follows:
 * - `name` is the document name.
 * - `code` is the document code, fulfilling the regex `[a-zA-Z-]+`.
 * - `year` is the year the document targets (which can be different from the current date, perhaps for future syllabi)
 * - `desc` is the description, limited to 500 characters.
 * - `category` is the document's category.
 * - `doctype` is the document's type.
 * - `subject` is the document subject.
 *
 * The `csrf` argument is also present to protect against CSRF attacks.
 *
 * **This route requires authentication**. A session ID is expected
 * as a cookie (yummy!)
 * @param request - The action arguments.
 */
export async function action({ request }: Route.ActionArgs) {
  const sessionData = await getSession(request.headers.get("Cookie"));
  // unauthenticated users may not upload content; it requires an account
  const vso = await validateSessionObject(sessionData);
  if(NULL_SVR == vso) return Response.json({
    success: false,
    message: "authentication"
  } as APIResponse, {
    status: 401, // Unauthorized
    headers: [
      ["Set-Cookie", await destroySession(sessionData)]
    ]
  });
  try {
    const formData = new FormData();
    let fileUpload: FileUpload | null = null; // leave null first, expect it to be defined later
    // --- 1000 B * 1000 ( that's 1000 KB = 1 MB) * 200 = 200 MB --- VV
    for await (const part of parseMultipartRequest(request, {maxFileSize: 1000 * 1000 * 200})) {
      if (!part.name) continue;
      if (part.isFile) {
        fileUpload = new FileUpload(part);
      } else {
        formData.append(part.name, await part.text());
      }
    }
    try {
      await csrf.validate(formData, request.headers);
    } catch (error) {
      if(error instanceof CSRFError) {
        console.error(error);
        return Response.json({
          success: false,
          message: "csrf"
        } as APIResponse, {
          status: 400, // Bad Req.
          headers: [
            ["Set-Cookie", await commitSession(sessionData)]
          ]
        });
      } else {
        return Response.json({
          success: false,
          message: "internal"
        } as APIResponse, {
          status: 500, // ISE
          headers: [
            ["Set-Cookie", await commitSession(sessionData)]
          ]
        });
      }
    }
    const paramParsed = {
      code: formData.get("code") as string | null,
      name: formData.get("name") as string | null,
      year: formData.get("year") as string | null,
      desc: formData.get("desc") as string | null,
      subject: formData.get("subject") as string | null,
      doctype: formData.get("doctype") as string | null,
      category: formData.get("category") as string | null,
    }
    for(const v in Object.values(paramParsed)) {
      if(v == null) return Response.json({
        success: false,
        message: "missing-info"
      } as APIResponse, {
        status: 401,
        headers: [
          ["Set-Cookie", await commitSession(sessionData)]
        ]
      });
    }
    if(fileUpload == null) return Response.json({
      success: false,
      message: "missing-info"
    } as APIResponse, {
      status: 401,
      headers: [
        ["Set-Cookie", await commitSession(sessionData)]
      ]
    });
    const index = (await getIndex())!;
    // now safe to work with file upload, user has been checked
    // (1) register file in postgres
    // (2) actually upload file
    const pointer = nanoid();
    await sql`INSERT INTO lg_shadows (doc_code, name, year, subject, pointer, doc_type, category, last_updated, "desc")
        VALUES (
                ${paramParsed.code!},
                ${paramParsed.name!},
                ${+paramParsed.year!},
                ${paramParsed.subject!},
                ${pointer.trim()},
                ${resolveDocTypeName(paramParsed.doctype!, index)},
                ${resolveCategoryName(paramParsed.category!, index)},
                ${new Date(Date.now())},
                ${paramParsed.desc!}
               )`;
    if(fileUpload.fieldName == "file" && fileUpload.type == "application/pdf") {
      await fileStorage.set(getStorageKey(pointer), fileUpload);
    }
    console.log(`User ${vso.user?.uid!} successfully created file ${paramParsed.name!}`);
    return Response.json({
      success: true,
      message: "success"
    } as APIResponse, {
      status: 201,
      headers: [
        ["Set-Cookie", await commitSession(sessionData)]
      ]
    });
  } catch(e) {
    console.error(e);
    return Response.json({
      success: false,
      message: "internal"
    } as APIResponse, {
      status: 500,
      headers: [
        ["Set-Cookie", await commitSession(sessionData)]
      ]
    });
  }
}
import {GetObjectCommand} from "@aws-sdk/client-s3";
import {
  type LGDUnification,
  type LibGSNIndex,
  type LibGSNShadow,
  resolveCategoryName,
  resolveDocTypeName,
} from "~/util/doc-details";
import {lgS3Client, sql} from "~/server/data-sources";

export async function getIndex() {
  try {
    const output = await lgS3Client.send(new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: "index/libgsn.json"
    }));
    return JSON.parse(await output.Body!.transformToString("utf-8")) as LibGSNIndex;
  } catch (err) {
    console.error("Error retrieving central index file", err);
  }
}

const index = (await getIndex())!;

export async function getShadows(
  query: LGDUnification = {search: undefined, level: undefined, docType: undefined, subject: undefined}
) {
  try {
    const output= await sql`
      SELECT * FROM lg_shadows WHERE
        name LIKE ${"%" + (query.search ?? "") + "%"}
        ${query.level != undefined ? sql`AND category = ${resolveCategoryName(query.level, index)}` : sql``} 
        ${query.subject != undefined ? sql`AND subject = ${query.subject}` : sql``}
        ${query.docType != undefined ? sql`AND doc_type = ${resolveDocTypeName(query.docType, index)}` : sql``}
        ORDER BY last_updated DESC`
    return output.map((x) => x as LibGSNShadow)
  } catch (err) {
    console.error("Error", err);
  }
}
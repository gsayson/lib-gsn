import {getShadows} from "~/server/search";
import type {Route} from "../../.react-router/types/app/routes/+types/science.shadows";

/**
 * Returns the shadows, with a given query. The following query parameters
 * are supported:
 *
 * - `search` is the document name or code.
 * - `level` is the category *code*.
 * - `doctype` is the type of the document, as displayed.
 * - `subject` is the subject *name*, as displayed.
 *
 * @param request - The request.
 */
export async function loader({ request }: Route.LoaderArgs) {
  await new Promise((res) => setTimeout(res, 300));
  let url = new URL(request.url);
  return await getShadows({
    search: url.searchParams.get("search") ?? undefined,
    level: url.searchParams.get("level") ?? undefined,
    docType: url.searchParams.get("docType") ?? undefined,
    subject: url.searchParams.get("subject") ?? undefined
  });
}
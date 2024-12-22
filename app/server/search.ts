import {GetObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {
  type LGDUnification,
  type LibGSNIndex,
  type LibGSNShadow,
  resolveCategoryName,
  resolveDocTypeName,
} from "~/util/doc-details";
import postgres from "postgres";

const s3 = new S3Client({
  endpoint: process.env.S3_HOST!,
  forcePathStyle: false,
  region: process.env.S3_REGION!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET!
  }
})

const sql = postgres(process.env.DATABASE_URL!, { ssl: 'require' });

export async function getIndex() {
  try {
    const output = await s3.send(new GetObjectCommand({
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
        ${query.docType != undefined ? sql`AND docType = ${resolveDocTypeName(query.docType, index)}` : sql``}
        ORDER BY last_updated DESC`
    return output.map((x) => x as LibGSNShadow)
  } catch (err) {
    console.error("Error", err);
  }
}
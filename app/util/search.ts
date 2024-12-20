import {S3Client, GetObjectCommand, paginateListObjectsV2} from "@aws-sdk/client-s3";
import type {LGDUnification} from "~/util/doc-details";

const client = new S3Client({
  endpoint: process.env.S3_HOST!,
  forcePathStyle: false,
  region: process.env.S3_REGION!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET!
  }
})

export type LibGSNIndex = {
  categories: {
    name: string,
    key: string,
    subjects: {
      name: string,
      code: string[]
    }[]
  }[],
  doctype: string[],
}

export type LibGSNShadow = {
  name: string,
  year: number,
  subject: string,
  desc: string,
  doctype: string,
  file: string,
}

export async function getIndex() {
  try {
    const output = await client.send(new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: "index/libgsn.json"
    }));
    return JSON.parse(await output.Body!.transformToString("utf-8")) as LibGSNIndex;
  } catch (err) {
    console.error("Error retrieving central index file", err);
  }
}

export async function getShadows(query: LGDUnification = {level: undefined, docType: undefined, subject: undefined}) {
  try {
    const output = paginateListObjectsV2(
      {
        client: client,
        pageSize: 10
      },
      {
        Bucket: process.env.S3_BUCKET_NAME!,
        Prefix: "index/",
      }
    )
    return (await output.next()).value
  } catch (err) {
    console.error("Error", err);
  }
}
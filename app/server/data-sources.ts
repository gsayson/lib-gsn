import {S3Client} from "@aws-sdk/client-s3";
import postgres from "postgres";

export const lgS3Client = new S3Client({
  endpoint: process.env.S3_HOST!,
  forcePathStyle: false,
  region: process.env.S3_REGION!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET!,
  },
})

export const sql = postgres(process.env.DATABASE_URL!, {ssl: 'require'});
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

if (!process.env.S3_ENDPOINT) throw new Error("S3_ENDPOINT is missing");
if (!process.env.S3_REGION) throw new Error("S3_REGION is missing");
if (!process.env.S3_ACCESS_KEY_ID) throw new Error("S3_ACCESS_KEY_ID is missing");
if (!process.env.S3_SECRET_ACCESS_KEY) throw new Error("S3_SECRET_ACCESS_KEY is missing");
if (!process.env.S3_BUCKET) throw new Error("S3_BUCKET is missing");

const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
  // For R2/S3-compatible services
  forcePathStyle: true,
});

export const s3 = {
  client: s3Client,
  bucket: process.env.S3_BUCKET,

  async getPresignedUploadUrl(key: string, contentType: string, expiresIn = 3600) {
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      ContentType: contentType,
    });
    
    return await getSignedUrl(s3Client, command, { expiresIn });
  },

  async getPresignedDownloadUrl(key: string, expiresIn = 3600) {
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
    });
    
    return await getSignedUrl(s3Client, command, { expiresIn });
  },

  async deleteObject(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
    });
    
    return await s3Client.send(command);
  },
};
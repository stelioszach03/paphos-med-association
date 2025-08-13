import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

let s3Client: S3Client | null = null;
if (
  process.env.S3_ENDPOINT &&
  process.env.S3_REGION &&
  process.env.S3_ACCESS_KEY_ID &&
  process.env.S3_SECRET_ACCESS_KEY
) {
  s3Client = new S3Client({
    endpoint: process.env.S3_ENDPOINT,
    region: process.env.S3_REGION,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
    // For R2/S3-compatible services
    forcePathStyle: true,
  });
}

export const s3 = {
  client: s3Client as any,
  bucket: process.env.S3_BUCKET,

  async getPresignedUploadUrl(key: string, contentType: string, expiresIn = 3600) {
    if (!s3Client) throw new Error("S3 not configured");
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      ContentType: contentType,
    });

    return await getSignedUrl(s3Client, command, { expiresIn });
  },

  async getPresignedDownloadUrl(key: string, expiresIn = 3600) {
    if (!s3Client) throw new Error("S3 not configured");
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
    });

    return await getSignedUrl(s3Client, command, { expiresIn });
  },

  async deleteObject(key: string) {
    if (!s3Client) throw new Error("S3 not configured");
    const command = new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
    });

    return await s3Client.send(command);
  },
};
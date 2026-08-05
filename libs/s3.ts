import {
  S3Client,
  DeleteObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
export const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const uploadFileToS3 = async (
  key: string,
  body: Buffer,
  contentType?: string,
) => {
  await s3Client.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );

  return getS3FileUrl(key);
};

export const getS3FileUrl = (key: string) => {
  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};

/**
 * Converts an S3 file URL into an S3 object key.
 *
 * Example:
 * https://bucket.s3.ap-south-1.amazonaws.com/videos/demo.mp4
 *
 * becomes
 *
 * videos/demo.mp4
 */
export const getS3KeyFromUrl = (url: string): string => {
  const bucketUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`;

  return url.replace(bucketUrl, "");
};

/**
 * Deletes a file from S3 using its URL.
 */
export const deleteFileFromS3 = async (url: string) => {
  const key = getS3KeyFromUrl(url);

  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    }),
  );
};

export const getPresignedUploadUrl = async (
  key: string,
  contentType: string,
) => {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 60, // URL valid for 60 seconds
  });

  return {
    uploadUrl,
    fileUrl: getS3FileUrl(key),
  };
};

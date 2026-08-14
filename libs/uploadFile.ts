export const uploadFile = async (
  file: File,
  type: "video" | "thumbnail" | "banner" | "image-series-cover" | "image",
  seriesId?: string,
) => {
  const response = await fetch("/api/upload-url", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fileName: file.name,
      contentType: file.type,
      type,
      seriesId,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to get upload URL");
  }

  const { uploadUrl, fileUrl } = await response.json();

  console.log("Upload URL:", uploadUrl);
  console.log("File URL:", fileUrl);

  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  console.log("S3 Status:", uploadResponse.status);

  if (!uploadResponse.ok) {
    console.log(await uploadResponse.text());
    throw new Error("Failed to upload file");
  }

  return {
    url: fileUrl,
  };
};

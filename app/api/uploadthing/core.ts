import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 10 } })
    .onUploadComplete(async ({ file }) => {
      console.log("Image uploaded:", file.url);
      return { url: file.url };
    }),

  videoUploader: f({ video: { maxFileSize: "32MB", maxFileCount: 5 } })
    .onUploadComplete(async ({ file }) => {
      console.log("Video uploaded:", file.url);
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

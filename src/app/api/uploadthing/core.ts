import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const f = createUploadthing();

export const ourFileRouter = {
  // Image uploader (for images only)
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 5,
    },
  })
    .middleware(async () => {
      try {
        const session = await auth();
        console.log("Session in UploadThing middleware:", JSON.stringify(session, null, 2));
        
        if (!session?.user) throw new Error("Unauthorized");
        
        return { userId: session.user.id };
      } catch (error) {
        console.error("Auth error in UploadThing middleware:", error);
        throw new UploadThingError("Unauthorized");
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      return { uploadedBy: metadata.userId, fileUrl: file.url };
    }),

  // Markdown uploader (for .md files only)
  markdownUploader: f({
    "text/markdown": { maxFileSize: "2MB", maxFileCount: 1 },
    "text/plain": { maxFileSize: "2MB", maxFileCount: 1 }, // Allow plain text
  })
    .middleware(async () => {
      try {
        const session = await auth();
        console.log("Session in UploadThing middleware:", JSON.stringify(session, null, 2));
        
        if (!session?.user?.email) {
          console.log("Unauthorized: No user email in session");
          throw new UploadThingError("Unauthorized");
        }
        
        // Find the user by email
        const user = await prisma.user.findUnique({
          where: { email: session.user.email }
        });
        
        if (!user) {
          console.log("Unauthorized: User not found in database");
          throw new UploadThingError("Unauthorized");
        }
        
        return { userId: user.id };
      } catch (error) {
        console.error("Auth error in UploadThing middleware:", error);
        throw new UploadThingError("Unauthorized");
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Markdown uploaded by userId:", metadata.userId);
      console.log("File URL:", file.url);
      return { uploadedBy: metadata.userId, fileUrl: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

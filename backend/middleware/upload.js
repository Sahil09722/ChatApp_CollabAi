import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  // Use a function for params so we can set resource_type depending on the mimetype
  params: (req, file) => {
    // default folder
    const params = { folder: "collabAI_uploads" };

    // If the file is an image, let Cloudinary treat it as an image, otherwise as raw
    if (/^image\//i.test(file.mimetype)) {
      params.resource_type = "image";
    } else {
      params.resource_type = "raw"; // handle zip, pdf, docs, etc.
    }

    return params;
  },
});

export const upload = multer({ storage });

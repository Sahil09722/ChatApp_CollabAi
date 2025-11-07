import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: node scripts/test_cloudinary.js <local-file-path>');
  process.exit(1);
}

(async () => {
  try {
    console.log('Uploading', filePath, 'to Cloudinary...');
    const res = await cloudinary.uploader.upload(filePath, { folder: 'collabAI_test' });
    console.log('Upload result:', res);
  } catch (err) {
    console.error('Upload failed:', err);
    process.exit(1);
  }
})();

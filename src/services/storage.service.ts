import ImageKit, { toFile } from "@imagekit/nodejs";
import { config } from "../config/config";

const imagekit = new ImageKit({
  privateKey: config.imagekitPrivateKey,
});

const uploadImage = async (file: Express.Multer.File, fileName: string) => {
  const uploadableFile = await toFile(file.buffer, fileName);
  const result = await imagekit.files.upload({
    file: uploadableFile,
    fileName: fileName,
    folder: "posts",
  });
  return result;
};

export { uploadImage };

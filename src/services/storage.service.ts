import ImageKit from "@imagekit/nodejs";
import { config } from "../config/config";

const imagekit = new ImageKit({
  privateKey: config.imagekitPrivateKey,
});

export default imagekit;

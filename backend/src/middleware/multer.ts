import multer from "multer";

export const singleUpload=multer().single("photo");
export const multipleUpload=multer().array("photos",5);
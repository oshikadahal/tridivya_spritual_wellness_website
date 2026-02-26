import multer from "multer";
import { randomUUID } from "crypto";
import path from "path";
import fs from "fs";

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, '..', '..', 'uploads');
console.log('Upload directory:', uploadDir);
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('Created uploads directory:', uploadDir);
} 

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = randomUUID();
        const extension = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
    }
});
const imageFileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Accept images only
    if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Only image files are allowed!'));
    }
    cb(null, true);
};
const videoFileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (!file.mimetype.startsWith('video/')) {
        return cb(new Error('Only video files are allowed!'));
    }
    cb(null, true);
};

const upload = multer({ 
    storage: storage, 
    fileFilter: imageFileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5 MB file size limit
});

const videoUpload = multer({
    storage: storage,
    fileFilter: videoFileFilter,
    limits: { fileSize: 200 * 1024 * 1024 } // 200 MB video size limit
});

export const uploads = {
    single: (fieldName: string) => upload.single(fieldName),
    array: (fieldName: string, maxCount: number) => upload.array(fieldName, maxCount),
    fields: (fieldsArray: { name: string; maxCount?: number }[]) => upload.fields(fieldsArray)
};

export const videoUploads = {
    single: (fieldName: string) => videoUpload.single(fieldName),
};
import multer from "multer";
import { randomUUID } from "crypto";
import path from "path";
import fs from "fs";

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, '..', '..', 'uploads');
const imageUploadDir = path.join(uploadDir, 'images');
const profileImageUploadDir = path.join(uploadDir, 'profile-images');
const videoUploadDir = path.join(uploadDir, 'video');
const audioUploadDir = path.join(uploadDir, 'audio');

const ensureDir = (dir: string) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

ensureDir(uploadDir);
ensureDir(imageUploadDir);
ensureDir(profileImageUploadDir);
ensureDir(videoUploadDir);
ensureDir(audioUploadDir);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
            return cb(null, imageUploadDir);
        }
        if (file.mimetype.startsWith('video/')) {
            return cb(null, videoUploadDir);
        }
        if (file.mimetype.startsWith('audio/')) {
            return cb(null, audioUploadDir);
        }
        return cb(new Error('Unsupported file type'), uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = randomUUID();
        const extension = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
    }
});

const profileImageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed!'), profileImageUploadDir);
        }
        return cb(null, profileImageUploadDir);
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

const audioFileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (!file.mimetype.startsWith('audio/')) {
        return cb(new Error('Only audio files are allowed!'));
    }
    cb(null, true);
};

const upload = multer({ 
    storage: storage, 
    fileFilter: imageFileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5 MB file size limit
});

const profileImageUpload = multer({
    storage: profileImageStorage,
    fileFilter: imageFileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5 MB profile image size limit
});

const videoUpload = multer({
    storage: storage,
    fileFilter: videoFileFilter,
    limits: { fileSize: 200 * 1024 * 1024 } // 200 MB video size limit
});

const audioUpload = multer({
    storage: storage,
    fileFilter: audioFileFilter,
    limits: { fileSize: 50 * 1024 * 1024 } // 50 MB audio size limit
});

export const uploads = {
    single: (fieldName: string) => upload.single(fieldName),
    array: (fieldName: string, maxCount: number) => upload.array(fieldName, maxCount),
    fields: (fieldsArray: { name: string; maxCount?: number }[]) => upload.fields(fieldsArray)
};

export const profileImageUploads = {
    single: (fieldName: string) => profileImageUpload.single(fieldName),
};

export const videoUploads = {
    single: (fieldName: string) => videoUpload.single(fieldName),
};

export const audioUploads = {
    single: (fieldName: string) => audioUpload.single(fieldName),
};
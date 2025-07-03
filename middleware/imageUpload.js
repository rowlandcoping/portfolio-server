import multer from 'multer';
import path from 'path';
import fs from 'fs';


console.log('multer reached');
const uploadDir = path.join(process.cwd(), 'images');

// Make sure uploads folder exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    }

    const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, ext);
        let filename = file.originalname;
        let counter = 0;
        
        // Simple conflict resolver
        while (fs.existsSync(path.join(uploadDir, filename))) {
        counter++;
        filename = `${baseName}-${counter}${ext}`;
        }
        cb(null, filename);
  }
});

const upload = multer({ storage });

export default upload;
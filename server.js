const express = require('express');
const multer = require('multer');
const path = require('path');
const os = require('os');
const cors = require('cors')
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors())

const upload = multer({
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB limit
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      const storageFolder = './storage';
      // Check if the storage folder exists, create it if it doesn't
      if (!fs.existsSync(storageFolder)) {
        fs.mkdirSync(storageFolder);
      }
      callback(null, storageFolder); // Save files to the 'storage' folder
    },
    filename: (req, file, callback) => {
        const extension = path.extname(file.originalname);
        const uniqueName = `${uuidv4()}${extension}`; // Use UUIDs for the filename
        callback(null, uniqueName);
    }
  })
});

app.use('/storage', express.static(path.join(__dirname, 'storage')));

app.post('/upload', upload.single('file'), (req, res) => {
  res.send({ file: req.file, secure_url:`${"http://localhost:5000"}/storage/${req.file.filename}` });
});

app.listen(5000, () => {
    console.log('Server is running!')
})
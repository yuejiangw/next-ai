import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import chat from "./chat.js";
import fs from 'fs';
import path from 'path';

// Load values from .env file
dotenv.config();

// Use Express framework
const app = express();

// Enable cross-origin
app.use(cors());


// configure multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    fileName: function (req, file, cb) {
        cb(null, file.originalname);
    },
});


const upload = multer({
    storage,
});


const PORT = process.env.PORT || 8080;


let filePath;


// Healthcheck, should return 'healthy'
app.get("/", (req, res) => {
    res.send("healthy");
});


// Upload a PDF file, and store it as '/upload/file.pdf'
app.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    // Get the temporary file path and the new file path
    const tempPath = req.file.path;
    console.log(tempPath);
    const targetPath = path.join('uploads', 'file.pdf');

    try {
        // Rename the uploaded file to 'file.pdf'
        fs.renameSync(tempPath, targetPath);

        // Respond to the client
        res.send('File uploaded and renamed to file.pdf');
    } catch (error) {
        console.error('Error renaming file:', error);
        res.status(500).send('Error renaming the file.');
    }
});


app.get("/chat", async (req, res) => {
    const resp = await chat(req.query.question, filePath);
    res.send(resp.text);
});


app.listen(PORT, () => {
    console.log(`🚀🚀🚀 Server is running on port ${PORT}`);
});



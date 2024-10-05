import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import chat from "./chat.js";
import fs from 'fs';
import path from 'path';

dotenv.config();


const app = express();


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


// RESTful - what does the API do? You should be able to describe it in one sentence.
// GET/POST/DELETE/PATCH/UDPATE
// ststua code 200, 401, 404, 500
// input paylod? param?
// output


app.get("/", (req, res) => {
    res.send("healthy");
});


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



import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import chat from "./chat.js";

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
    filePath = req.file.path;
    res.send(filePath + "upload successfully.");
});


app.get("/chat", async (req, res) => {
    const resp = await chat(req.query.question, filePath);
    res.send(resp.text);
});


app.listen(PORT, () => {
    console.log(`🚀🚀🚀 Server is running on port ${PORT}`);
});



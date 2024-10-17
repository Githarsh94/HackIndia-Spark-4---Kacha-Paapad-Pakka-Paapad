import express from 'express';
import { create } from 'ipfs-http-client';
import multer from 'multer';
import cors from 'cors';
import fetch from 'node-fetch';
import FormData from 'form-data';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();


const app = express();
app.use(cors());

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

var store = {};

async function run(prompt) {
    if (store[prompt]) return store[prompt];
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    store[prompt] = text;
    return text;
}

// Initialize IPFS client using IPv4 explicitly
const ipfs = create({ host: '127.0.0.1', port: 5001, protocol: 'http' });




app.use(express.json());

// Setup multer for file upload handling (in-memory storage)
const upload = multer({ storage: multer.memoryStorage() });

// In-memory storage for uploaded files

// File upload route to IPFS only
app.post('/upload-ipfs', upload.single('file'), async (req, res) => {
    const ipfsUploads = [];
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).send('No file uploaded.');
        }

        const fileHash = await ipfs.add(file.buffer);
        ipfsUploads.push({ fileName: file.originalname, fileHash: fileHash.cid.toString() });
        res.json(ipfsUploads);
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).send('Error uploading file.');
    }
});

const repositories = [];

// Create repository route
app.post('/create-repo', async (req, res) => {
    try {
        const { repoName, description, visibility, readme, gitignore, license, files } = req.body;
        const repoData = { repoName, description, visibility, readme, gitignore, license, files };

        const repoHash = await ipfs.add(JSON.stringify(repoData));
        repositories.push(repoHash.cid.toString());

        res.json({ repoHash: repoHash.cid.toString() });
    } catch (error) {
        console.error('Error creating repository:', error);
        res.status(500).send('Error creating repository.');
    }
});

app.get('/generate-readme', async (req, res) => {
    const inputText = req.query.inputText;

    if (!inputText) {
        return res.status(400).json({ error: 'Input text is required' });
    }

    // Simulate README generation (you can replace this with actual logic)
    const geminiResponse = await run("generate a readme.md for github from the following text, give me the readme contents only, nothing else. Even if there is not enough info or some other error such that you cannot generate the readme, send a response as readme" + inputText);

    // const generatedReadme = data.choices[0].text.trim();

    // Send the generated README as a response
    return res.status(200).json({ readme: geminiResponse });
});

// Route to access all repositories
app.get('/uploads', (req, res) => {
    res.json(repositories);
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

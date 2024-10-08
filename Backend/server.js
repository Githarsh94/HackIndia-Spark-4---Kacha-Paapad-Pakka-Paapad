import express from 'express';
import { create } from 'ipfs-http-client';
import multer from 'multer';
import cors from 'cors';

// Initialize IPFS client using IPv4 explicitly
const ipfs = create({ host: '127.0.0.1', port: 5002, protocol: 'http' });

const app = express();

app.use(cors());
app.use(express.json());

// Setup multer for file upload handling (in-memory storage)
const upload = multer({ storage: multer.memoryStorage() });

// In-memory storage for uploaded files
const ipfsUploads = [];

// File upload route to IPFS only
app.post('/upload-ipfs', upload.single('file'), async (req, res) => {
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

// Route to access all repositories
app.get('/uploads', (req, res) => {
    res.json(repositories);
});


app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

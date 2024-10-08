const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient('http://localhost:5001');

async function addToIpfs(file) {
    const result = await ipfs.add(file);
    return result.path; // Returns the CID (Content Identifier)
}

module.exports = { addToIpfs };

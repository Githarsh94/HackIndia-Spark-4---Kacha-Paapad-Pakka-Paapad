import React, { useState } from 'react';

const FileUploader = () => {
    const [file, setFile] = useState(null);

    const uploadFile = async () => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:3000/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('File uploaded to IPFS:', data.fileHash);
            console.log('Stored on Filecoin:', data.filecoinResult);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    return (
        <div>
            <input type="file" onChange={e => setFile(e.target.files[0])} />
            <button onClick={uploadFile}>Upload</button>
        </div>
    );
};

export default FileUploader;

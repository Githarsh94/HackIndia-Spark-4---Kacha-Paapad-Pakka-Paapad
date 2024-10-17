import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { useNavigate } from 'react-router-dom';

const CreateRepo = ({ user }) => {
    const [repoName, setRepoName] = useState('');
    const [description, setDescription] = useState('');
    const [visibility, setVisibility] = useState('public');
    const [readme, setReadme] = useState(false);
    const [gitignore, setGitignore] = useState('none');
    const [license, setLicense] = useState('none');
    const [owner, setOwner] = useState('');
    const [files, setFiles] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.username) {
            setOwner(user.username);
        } else {
            setOwner('Loading...');
        }
    }, [user]);

    const handleFileUpload = async (selectedFiles) => {
        const formData = new FormData();
        for (let file of selectedFiles) {
            formData.append('file', file);
        }

        try {
            const response = await fetch('http://localhost:3000/upload-ipfs', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const newFiles = data.map(file => ({ fileName: file.fileName, fileHash: file.fileHash }));
            setFiles(prevFiles => [...prevFiles, ...newFiles]);
        } catch (error) {
            console.error('Error uploading files:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/create-repo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    repoName,
                    description,
                    visibility,
                    readme,
                    gitignore,
                    license,
                    files,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log(data);
            setShowPopup(true);
            setTimeout(() => {
                setShowPopup(false);
                navigate('/');
            }, 3000);
        } catch (error) {
            console.error('Error creating repository:', error);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-900 text-white">
            <header className="bg-gray-800 p-4 flex items-center justify-between">
                <div className="flex items-center">
                    <button
                        onClick={() => navigate('/')}
                        className="text-white mr-4 bg-gray-700 px-3 py-1 rounded hover:bg-gray-600 transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        Back
                    </button>
                    <FontAwesomeIcon icon={faGithub} className="text-2xl" />
                    <span className="ml-2 text-xl">New repository</span>
                </div>
                <div className="flex items-center space-x-4">
                    <input
                        type="text"
                        placeholder="Type / to search"
                        className="bg-gray-700 text-white px-2 py-1 rounded"
                    />
                    <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
                </div>
            </header>
            <main className="flex-grow p-8">
                <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-lg">
                    <h1 className="text-2xl font-semibold mb-2">Create a new repository</h1>
                    <p className="text-gray-400 mb-4">
                        A repository contains all project files, including the revision history. Already have a project repository elsewhere?{' '}
                        <a href="#" className="text-blue-500">Import a repository</a>.
                    </p>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-400 mb-1">Owner *</label>
                            <div className="flex items-center bg-gray-700 p-2 rounded">
                                <div className="w-8 h-8 bg-gray-600 rounded-full mr-2"></div>
                                <span>{owner}</span>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-400 mb-1">Repository name *</label>
                            <input
                                type="text"
                                value={repoName}
                                onChange={(e) => setRepoName(e.target.value)}
                                className="w-full bg-gray-700 text-white p-2 rounded"
                                placeholder=""
                                required
                            />
                        </div>
                        <p className="text-gray-400 mb-4">
                            Great repository names are short and memorable. Need inspiration? How about <a href="#" className="text-green-500">silver-journey</a>?
                        </p>
                        <div className="mb-4">
                            <label className="block text-gray-400 mb-1">Description (optional)</label>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full bg-gray-700 text-white p-2 rounded"
                                placeholder="Description of the repository"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-400 mb-1">Visibility</label>
                            <div className="flex items-center mb-2">
                                <input
                                    type="radio"
                                    id="public"
                                    name="visibility"
                                    className="mr-2"
                                    checked={visibility === 'public'}
                                    onChange={() => setVisibility('public')}
                                />
                                <label htmlFor="public" className="text-gray-400">Public</label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="private"
                                    name="visibility"
                                    className="mr-2"
                                    checked={visibility === 'private'}
                                    onChange={() => setVisibility('private')}
                                />
                                <label htmlFor="private" className="text-gray-400">Private</label>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-400 mb-1">Initialize this repository with:</label>
                            <div className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    id="readme"
                                    className="mr-2"
                                    checked={readme}
                                    onChange={(e) => setReadme(e.target.checked)}
                                />
                                <label htmlFor="readme" className="text-gray-400">Add a README file</label>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-400 mb-1">Add .gitignore</label>
                            <select
                                value={gitignore}
                                onChange={(e) => setGitignore(e.target.value)}
                                className="w-full bg-gray-700 text-white p-2 rounded"
                            >
                                <option value="none">None</option>
                                <option value="node">Node</option>
                                <option value="python">Python</option>
                                <option value="java">Java</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-400 mb-1">Choose a license</label>
                            <select
                                value={license}
                                onChange={(e) => setLicense(e.target.value)}
                                className="w-full bg-gray-700 text-white p-2 rounded"
                            >
                                <option value="none">None</option>
                                <option value="mit">MIT License</option>
                                <option value="apache">Apache License 2.0</option>
                                <option value="gpl">GNU GPL v3</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-400 mb-1">Upload files</label>
                            <input
                                type="file"
                                multiple
                                onChange={(e) => handleFileUpload(e.target.files)}
                                className="w-full bg-gray-700 text-white p-2 rounded"
                            />
                            {files.length > 0 && (
                                <div className="mt-2">
                                    <p className="text-gray-400 mb-2">Files uploaded:</p>
                                    <ul className="list-disc list-inside">
                                        {files.map((file, index) => (
                                            <li key={index} className="text-gray-400">{file.fileName}: {file.fileHash}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                        <p className="text-gray-400 mb-4">
                            You are creating a {visibility} repository in your personal account.
                        </p>
                        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105">
                            Create repository
                        </button>
                    </form>
                </div>
            </main>
            {showPopup && (
                <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded">
                    Repository created successfully!
                </div>
            )}
        </div>
    );
};

export default CreateRepo;

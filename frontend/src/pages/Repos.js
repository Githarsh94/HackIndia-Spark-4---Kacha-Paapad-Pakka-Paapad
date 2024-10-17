import React from 'react';
import { useNavigate } from 'react-router-dom';

const Repos = () => {
    const [repos, setRepos] = React.useState([]);
    const navigate = useNavigate();

    React.useEffect(() => {
        fetch('http://localhost:3000/uploads')
            .then(response => response.json())
            .then(data => setRepos(data))
            .catch(error => console.error('Error fetching repos:', error));
    }, []);

    React.useEffect(() => {
        const fetchRepoData = async (cid) => {
            try {
                const response = await fetch(`https://ipfs.io/ipfs/${cid}`);
                return await response.json();
            } catch (error) {
                console.error(`Error fetching repo data for CID ${cid}:`, error);
                return null;
            }
        };

        const fetchAllRepos = async () => {
            try {
                const response = await fetch('http://localhost:3000/uploads');
                const cids = await response.json();
                const repoDataPromises = cids.map(cid => fetchRepoData(cid));
                const repoDataArray = await Promise.all(repoDataPromises);
                setRepos(repoDataArray.filter(data => data !== null));
                console.log(repoDataArray);
            } catch (error) {
                console.error('Error fetching repos:', error);
            }
        };

        fetchAllRepos();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Repositories</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {repos.filter(repo => repo !== null).map((repo, index) => (
                    <div key={index} className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
                        <h2 className="text-2xl font-semibold mb-2">{repo.Name}</h2>
                        <p className="text-gray-700 mb-2">{repo.description}</p>
                        <p className="text-gray-500 mb-1">Visibility: {repo.visibility}</p>
                        <p className="text-gray-500 mb-1">Readme: {repo.readme ? 'Yes' : 'No'}</p>
                        <p className="text-gray-500 mb-1">Gitignore: {repo.gitignore}</p>
                        <p className="text-gray-500 mb-1">License: {repo.license}</p>
                        <div className="mt-4">
                            <h3 className="text-lg font-medium mb-2">File Hashes:</h3>
                            <ul className="list-disc list-inside">
                                {repo.files && repo.files.map((file, idx) => (
                                    <li key={idx}>
                                        <a href={`https://ipfs.io/ipfs/${file.fileHash}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                            {file.fileName}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
            <button
                onClick={() => navigate('/create-repo')}
                className="fixed bottom-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-300"
            >
                Create Repo
            </button>
        </div>
    );
}

export default Repos;

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
            <h1 className="text-2xl font-bold mb-4">Repositories</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {repos.filter(repo => repo !== null).map((repo, index) => (

                    <div key={index} className="bg-white shadow-md rounded-lg p-4">
                        <h2 className="text-xl font-semibold">{repo.Name}</h2>
                        <p className="text-gray-700">{repo.description}</p>
                        <p className="text-gray-500">Visibility: {repo.visibility}</p>
                        <p className="text-gray-500">Readme: {repo.readme ? 'Yes' : 'No'}</p>
                        <p className="text-gray-500">Gitignore: {repo.gitignore}</p>
                        <p className="text-gray-500">License: {repo.license}</p>
                        <div className="mt-2">
                            <h3 className="text-lg font-medium">File Hashes:</h3>
                            <ul className="list-disc list-inside">
                                {repo.files && repo.files.map((file, idx) => (
                                    <li key={idx}>
                                        <a href={`https://ipfs.io/ipfs/${file.fileHash}`} target="_blank" rel="noopener noreferrer" className="text-blue-500">
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
                className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg"
            >
                Create Repo
            </button>
        </div>
    );
}

export default Repos;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateRepo from './pages/CreateRepo';
import Repos from './pages/Repos';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Repos />} />  {/* Default home route */}
          <Route path="/create-repo" element={<CreateRepo />} />
          {/* <Route path="/about" element={<About />} />*/}
          {/* Add more routes if needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

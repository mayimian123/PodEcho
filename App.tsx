import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { PodcastDetail } from './pages/PodcastDetail';
import { ReadReflect } from './pages/ReadReflect';
import { BrowsePodcasts } from './pages/BrowsePodcasts';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/browse" element={<BrowsePodcasts />} />
        <Route path="/podcast/:id" element={<PodcastDetail />} />
        <Route path="/podcast/:id/reflect" element={<ReadReflect />} />
      </Routes>
    </Router>
  );
}

export default App;
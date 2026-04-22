import React, { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';
import MusicGenerator from './components/MusicGenerator';
import SongTable from './components/SongTable';
import SongGallery from './components/SongGallery';
import ControlBar from './components/ControlBar';

const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000').trim();

function App() {
  const [songs, setSongs] = useState([]);
  const [seed, setSeed] = useState(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
  const [region, setRegion] = useState('en-US');
  const [likesPerSong, setLikesPerSong] = useState(0);
  const [viewMode, setViewMode] = useState('table');
  const [currentPage, setCurrentPage] = useState(0);
  const [galleryPage, setGalleryPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);
  const [error, setError] = useState(null);
  const observerTarget = useRef(null);
  const galleryPageRef = useRef(0);

  // Fetch songs
  const fetchSongs = useCallback((page = 0) => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      seed,
      page,
      region,
      likes: likesPerSong,
    });

    fetch(`${API_URL}/api/songs?${params}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!data.songs || !Array.isArray(data.songs)) {
          throw new Error('Invalid response from server');
        }
        setSongs((prev) =>
          page === 0 || prev.length === 0 ? data.songs : [...prev, ...data.songs]
        );
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching songs:', err);
        setError(
          `Server connect হচ্ছে না। নিশ্চিত করো server চালু আছে (cd server && npm start).\nDetails: ${err.message}`
        );
        setLoading(false);
      });
  }, [seed, region, likesPerSong]);

  // Reset and reload on param changes
  useEffect(() => {
    setCurrentPage(0);
    setGalleryPage(0);
    galleryPageRef.current = 0;
    setExpandedRow(null);
    setSongs([]);
    fetchSongs(0);
  }, [seed, region, likesPerSong, viewMode, fetchSongs]);

  // Infinite scroll for gallery
  useEffect(() => {
    if (viewMode !== 'gallery') return;
    if (!observerTarget.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          const nextPage = galleryPageRef.current + 1;
          galleryPageRef.current = nextPage;
          setGalleryPage(nextPage);
          fetchSongs(nextPage);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [viewMode, loading, fetchSongs]);

  const handleGenerateRandomSeed = () => {
    setSeed(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSongs([]);          // ← আগের page-এর data clear করো
    fetchSongs(page);
    setExpandedRow(null);
    window.scrollTo(0, 0);
  };

  const handleLikesChange = (newLikes) => {
    setLikesPerSong(newLikes);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    setCurrentPage(0);
    setGalleryPage(0);
    galleryPageRef.current = 0;
    setExpandedRow(null);
    setSongs([]);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎵 Music Store Showcase</h1>
        <p>Discover randomly generated music with reproducible seeds</p>
      </header>

      <ControlBar
        seed={seed}
        setSeed={setSeed}
        region={region}
        setRegion={setRegion}
        likesPerSong={likesPerSong}
        handleLikesChange={handleLikesChange}
        handleGenerateRandomSeed={handleGenerateRandomSeed}
        viewMode={viewMode}
        handleViewModeChange={handleViewModeChange}
      />

      <main className="app-main">
        {error && (
          <div style={{
            background: '#fee2e2', border: '1px solid #f87171',
            borderRadius: '8px', padding: '1rem 1.5rem', margin: '1rem 0',
            color: '#b91c1c', whiteSpace: 'pre-wrap', fontSize: '0.9rem',
          }}>
            ❌ {error}
            <div style={{ marginTop: '0.75rem' }}>
              <button onClick={() => fetchSongs(currentPage)}
                style={{ background: '#b91c1c', color: 'white', border: 'none',
                  borderRadius: '6px', padding: '0.4rem 1rem', cursor: 'pointer' }}>
                🔄 Retry
              </button>
            </div>
          </div>
        )}

        {viewMode === 'table' ? (
          <SongTable
            songs={songs}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            expandedRow={expandedRow}
            setExpandedRow={setExpandedRow}
            loading={loading}
          />
        ) : (
          <SongGallery
            songs={songs}
            expandedRow={expandedRow}
            setExpandedRow={setExpandedRow}
            loading={loading}
            observerTarget={observerTarget}
          />
        )}
      </main>

      <MusicGenerator />
    </div>
  );
}

export default App;

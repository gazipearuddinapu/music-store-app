import React, { useState } from 'react';

const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000').trim();

// Strong seeded RNG (djb2 hash + xorshift)
function seededRng(seed) {
  let s = typeof seed === 'string'
    ? seed.split('').reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) | 0, 5381)
    : seed;
  s = Math.abs(s) || 1;
  return function () {
    s = (s ^ (s << 13)) >>> 0;
    s = (s ^ (s >> 7)) >>> 0;
    s = (s ^ (s << 17)) >>> 0;
    return (s >>> 0) / 0xFFFFFFFF;
  };
}

// Play music using Web Audio API only
function playMusic(audioSeed) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const rng = seededRng(audioSeed);

    // Pick a different scale per song
    const allScales = [
      [261.63, 293.66, 329.63, 392.00, 440.00, 523.25], // C major pentatonic
      [220.00, 246.94, 261.63, 293.66, 329.63, 369.99], // A minor pentatonic
      [196.00, 220.00, 246.94, 277.18, 293.66, 329.63], // G major pentatonic
      [174.61, 196.00, 220.00, 246.94, 261.63, 293.66], // F major pentatonic
    ];
    const scale = allScales[Math.floor(rng() * allScales.length)];

    // Different tempo per song
    const tempo = 0.15 + rng() * 0.18;
    const numNotes = 16;

    // Different oscillator type per song
    const oscTypes = ['sine', 'triangle', 'sine', 'triangle'];
    const oscType = oscTypes[Math.floor(rng() * oscTypes.length)];

    for (let i = 0; i < numNotes; i++) {
      const startTime = ctx.currentTime + i * tempo;
      const octaveMult = rng() > 0.6 ? 2 : 1;
      const freq = scale[Math.floor(rng() * scale.length)] * octaveMult;

      const osc = ctx.createOscillator();
      osc.type = oscType;
      osc.frequency.setValueAtTime(freq, startTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.35, startTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + tempo * 0.85);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + tempo);
    }
  } catch (err) {
    console.error('Audio error:', err);
  }
}

function SongGallery({ songs, expandedRow, setExpandedRow, loading, observerTarget }) {
  const [playingIndex, setPlayingIndex] = useState(null);

  const handlePlay = (song, index) => {
    setPlayingIndex(index);
    playMusic(song.audioSeed);
    // Reset playing indicator after music ends (16 notes × 0.22s)
    setTimeout(() => setPlayingIndex(null), 16 * 220 + 300);
  };

  return (
    <>
      <div className="song-gallery">
        {songs.map((song, index) => (
          <div
            key={`${song.index}-${song.seed}`}
            className="song-card"
            onClick={() =>
              setExpandedRow(expandedRow === song.index ? null : song.index)
            }
          >
            <img
              src={`${API_URL}/api/cover/${song.index}?title=${encodeURIComponent(song.title)}&artist=${encodeURIComponent(song.artist)}`}
              alt={song.title}
              className="song-card-image"
            />
            <div className="song-card-info">
              <div className="song-card-title">{song.title}</div>
              <div className="song-card-artist">{song.artist}</div>
              <div className="song-card-genre">{song.genre}</div>
              <div className="song-card-likes">❤️ {song.likes} likes</div>

              {expandedRow === song.index && (
                <div
                  style={{
                    marginTop: '1rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid var(--border)',
                  }}
                >
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    Album: <strong>{song.album}</strong>
                  </p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', fontStyle: 'italic' }}>
                    "{song.review}"
                  </p>
                  <button
                    className="btn-play"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlay(song, index);
                    }}
                  >
                    {playingIndex === index ? '🎵 Playing...' : '▶️ Play'}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Infinite scroll trigger */}
      <div ref={observerTarget} style={{ padding: '2rem', textAlign: 'center' }}>
        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            Loading more songs...
          </div>
        )}
      </div>
    </>
  );
}

export default SongGallery;

import React from 'react';

const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000').trim();

// Strong seeded RNG (xorshift)
function seededRng(seed) {
  let s = typeof seed === 'string'
    ? seed.split('').reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) | 0, 5381)
    : seed;
  s = Math.abs(s) || 1;
  return function () {
    s = (s ^ (s << 13)) >>> 0;
    s = (s ^ (s >> 7))  >>> 0;
    s = (s ^ (s << 17)) >>> 0;
    return (s >>> 0) / 0xFFFFFFFF;
  };
}

// Play a short music preview via Web Audio API
function playMusic(audioSeed) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) { alert('Your browser does not support audio.'); return; }

    const ctx = new AudioContext();
    const rng = seededRng(audioSeed);

    const allScales = [
      [1, 1.122, 1.260, 1.498, 1.682, 2],
      [1, 1.122, 1.189, 1.335, 1.498, 1.587, 1.782, 2],
      [1, 1.122, 1.260, 1.335, 1.498, 1.682, 1.888, 2],
      [1, 1.122, 1.189, 1.414, 1.498, 1.587, 1.888, 2],
    ];
    const scale    = allScales[Math.floor(rng() * allScales.length)];
    const baseFreqs = [130.81, 146.83, 164.81, 174.61, 196.00, 220.00, 246.94, 261.63];
    const baseFreq = baseFreqs[Math.floor(rng() * baseFreqs.length)];
    const tempo    = 0.15 + rng() * 0.2;
    const oscTypes = ['sine', 'triangle', 'square', 'sawtooth'];
    const oscA     = oscTypes[Math.floor(rng() * 2)];
    const oscB     = oscTypes[Math.floor(rng() * 2) + 2];

    // Create reverb via delay node
    const delay     = ctx.createDelay(0.5);
    const feedback  = ctx.createGain();
    const wetGain   = ctx.createGain();
    delay.delayTime.value = 0.25;
    feedback.gain.value   = 0.3;
    wetGain.gain.value    = 0.2;
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(wetGain);
    wetGain.connect(ctx.destination);

    for (let i = 0; i < 16; i++) {
      const startTime = ctx.currentTime + i * tempo;
      const octave    = Math.floor(rng() * 3);
      const freq      = baseFreq * scale[Math.floor(rng() * scale.length)] * (octave + 1);

      const osc  = ctx.createOscillator();
      osc.type   = i % 4 === 0 ? oscB : oscA;
      osc.frequency.setValueAtTime(freq, startTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.35, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + tempo * 0.9);

      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.connect(delay);
      osc.start(startTime);
      osc.stop(startTime + tempo);
    }
  } catch (err) {
    console.error('Audio error:', err);
  }
}

function SongTable({ songs, currentPage, onPageChange, expandedRow, setExpandedRow, loading }) {
  const totalPages = 50;

  return (
    <div className="song-table">
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th style={{ width: '5%'  }}>#</th>
              <th style={{ width: '28%' }}>Title</th>
              <th style={{ width: '22%' }}>Artist</th>
              <th style={{ width: '20%' }}>Album</th>
              <th style={{ width: '13%' }}>Genre</th>
              <th style={{ width: '8%'  }}>Likes</th>
              <th style={{ width: '4%'  }}></th>
            </tr>
          </thead>
          <tbody>
            {/* Loading skeleton */}
            {loading && songs.length === 0 && (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={`skeleton-${i}`} style={{ opacity: 0.4 }}>
                  <td>{currentPage * 12 + i + 1}</td>
                  <td><span style={{ background: '#ddd', display: 'inline-block', width: '80%', height: '1em', borderRadius: 4 }}></span></td>
                  <td><span style={{ background: '#ddd', display: 'inline-block', width: '70%', height: '1em', borderRadius: 4 }}></span></td>
                  <td><span style={{ background: '#ddd', display: 'inline-block', width: '60%', height: '1em', borderRadius: 4 }}></span></td>
                  <td><span style={{ background: '#ddd', display: 'inline-block', width: '50%', height: '1em', borderRadius: 4 }}></span></td>
                  <td>—</td>
                  <td></td>
                </tr>
              ))
            )}

            {/* Actual song rows */}
            {songs.map((song) => (
              <React.Fragment key={`${song.index}-${song.seed}`}>
                <tr
                  className={expandedRow === song.index ? 'expanded' : ''}
                  onClick={() => setExpandedRow(expandedRow === song.index ? null : song.index)}
                  style={{ cursor: 'pointer' }}
                >
                  <td className="song-index">{song.index}</td>
                  <td className="song-title">{song.title}</td>
                  <td className="song-artist">{song.artist}</td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary, #888)' }}>{song.album}</td>
                  <td>{song.genre}</td>
                  <td className="song-likes">❤️ {song.likes}</td>
                  <td>
                    <button
                      className="expand-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedRow(expandedRow === song.index ? null : song.index);
                      }}
                    >
                      {expandedRow === song.index ? '▼' : '▶'}
                    </button>
                  </td>
                </tr>

                {expandedRow === song.index && (
                  <tr>
                    <td colSpan="7">
                      <div className="expanded-row">
                        <div>
                          <img
                            src={`${API_URL}/api/cover/${song.index}?title=${encodeURIComponent(song.title)}&artist=${encodeURIComponent(song.artist)}`}
                            alt={song.title}
                            className="album-cover"
                          />
                        </div>
                        <div className="song-details">
                          <div className="detail-section">
                            <h4>Album</h4>
                            <p>{song.album}</p>
                          </div>
                          <div className="detail-section">
                            <h4>Genre</h4>
                            <p>{song.genre}</p>
                          </div>
                          <div className="detail-section">
                            <h4>Review</h4>
                            <p style={{ fontStyle: 'italic' }}>"{song.review}"</p>
                          </div>
                          <div className="audio-controls">
                            <button
                              className="btn-play"
                              onClick={(e) => {
                                e.stopPropagation();
                                playMusic(song.audioSeed);
                              }}
                            >
                              ▶️ Play Preview
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}

            {/* No songs message */}
            {!loading && songs.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
                  No songs found. Check that the server is running.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button onClick={() => onPageChange(0)} disabled={currentPage === 0}>⬅️ First</button>
        <button onClick={() => onPageChange(Math.max(0, currentPage - 1))} disabled={currentPage === 0}>◀ Prev</button>

        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum = currentPage - 2 + i;
          if (pageNum < 0) pageNum = i;
          if (pageNum >= totalPages) return null;
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={currentPage === pageNum ? 'active' : ''}
            >
              {pageNum + 1}
            </button>
          );
        })}

        <button onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))} disabled={currentPage >= totalPages - 1}>Next ▶</button>
        <button onClick={() => onPageChange(totalPages - 1)} disabled={currentPage >= totalPages - 1}>Last ➡️</button>
      </div>
    </div>
  );
}

export default SongTable;

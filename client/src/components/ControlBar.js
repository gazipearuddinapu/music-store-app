import React from 'react';

function ControlBar({
  seed,
  setSeed,
  region,
  setRegion,
  likesPerSong,
  handleLikesChange,
  handleGenerateRandomSeed,
  viewMode,
  handleViewModeChange
}) {
  return (
    <div className="control-bar">
      {/* Language Selection */}
      <div className="control-group">
        <label htmlFor="region-select">Language</label>
        <select
          id="region-select"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        >
          <option value="en-US">English (USA)</option>
          <option value="de-DE">Deutsch (Germany)</option>
          <option value="uk-UA">Українська (Ukraine)</option>
        </select>
      </div>

      {/* Seed Configuration */}
      <div className="control-group">
        <label htmlFor="seed-input">Seed Value</label>
        <input
          id="seed-input"
          type="text"
          value={seed}
          onChange={(e) => setSeed(e.target.value)}
          placeholder="Enter seed value"
        />
      </div>

      {/* Random Seed Button */}
      <div className="button-group">
        <button className="btn btn-secondary" onClick={handleGenerateRandomSeed}>
          🎲 Random Seed
        </button>
      </div>

      {/* Likes Per Song */}
      <div className="control-group">
        <label htmlFor="likes-input">
          Avg Likes per Song: {likesPerSong}
        </label>
        <input
          id="likes-input"
          type="range"
          min="0"
          max="10"
          step="0.5"
          value={likesPerSong}
          onChange={(e) => handleLikesChange(parseFloat(e.target.value))}
        />
      </div>

      {/* View Mode Toggle */}
      <div className="button-group">
        <button
          className={`btn btn-toggle ${viewMode === 'table' ? 'active' : ''}`}
          onClick={() => handleViewModeChange('table')}
        >
          📋 Table
        </button>
        <button
          className={`btn btn-toggle ${viewMode === 'gallery' ? 'active' : ''}`}
          onClick={() => handleViewModeChange('gallery')}
        >
          🖼️ Gallery
        </button>
      </div>
    </div>
  );
}

export default ControlBar;

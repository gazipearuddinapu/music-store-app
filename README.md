# 🎵 Music Store Showcase

A single-page web application that generates fake song information with reproducible seeds, multi-language support, and realistic data generation.

## Features

✅ **Seeded Random Generation** - Use 64-bit seeds for reproducible data
✅ **Multi-Language Support** - English (USA), German (Germany), Ukrainian (Ukraine)
✅ **Two View Modes** - Table view with pagination & Gallery view with infinite scroll
✅ **Dynamic Updates** - All parameters update in real-time without page reload
✅ **Album Cover Generation** - Dynamically generated SVG covers
✅ **Synthesized Music** - Real playable audio generated from seed
✅ **Expandable Details** - View full song details with reviews and covers
✅ **Responsive Design** - Works on desktop, tablet, and mobile

## Tech Stack

### Backend
- **Node.js** with Express.js
- **Faker.js** for realistic name/text generation
- **seedrandom** for reproducible random number generation
- **CORS** enabled for cross-origin requests

### Frontend
- **React 18** with modern hooks
- **Responsive CSS** with CSS variables
- **Web Audio API** for music synthesis
- **Infinite Scroll** for gallery view

## Project Structure

```
music-store-app/
├── server/
│   ├── server.js          # Express server
│   └── package.json       # Dependencies
├── client/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js         # Main App component
│   │   ├── App.css        # Main styling
│   │   ├── index.js       # React entry point
│   │   ├── index.css
│   │   └── components/
│   │       ├── ControlBar.js       # Language, seed, likes controls
│   │       ├── SongTable.js        # Table view with pagination
│   │       ├── SongGallery.js      # Gallery view with infinite scroll
│   │       └── MusicGenerator.js   # Audio synthesis logic
│   └── package.json
└── README.md
```

## Installation

### Prerequisites
- Node.js 14+ and npm
- Modern web browser with Web Audio API support

### Local Setup

1. **Clone and install dependencies**
```bash
cd music-store-app/server
npm install

cd ../client
npm install
```

2. **Start the server**
```bash
cd server
npm start
# Server runs on http://localhost:5000
```

3. **In another terminal, start the frontend**
```bash
cd client
REACT_APP_API_URL=http://localhost:5000 npm start
# App runs on http://localhost:3000
```

## API Endpoints

### GET `/api/songs`
Fetches a page of generated songs.

**Query Parameters:**
- `seed` (string) - Random seed for reproducibility
- `page` (number) - Page number (0-based)
- `region` (string) - Language/region code (en-US, de-DE, uk-UA)
- `likes` (number) - Average likes per song (0-10)

**Response:**
```json
{
  "songs": [
    {
      "index": 1,
      "title": "Fast Dreams",
      "artist": "The Melody",
      "album": "Echoes Album",
      "genre": "Indie",
      "likes": 3,
      "review": "Amazing track",
      "seed": "1234567890",
      "audioSeed": "1234567890-audio-0"
    }
  ],
  "page": 0,
  "pageSize": 12,
  "seed": "1234567890"
}
```

### GET `/api/cover/:id`
Generates a dynamic album cover image.

**Query Parameters:**
- `title` (string) - Song title to display
- `artist` (string) - Artist name to display

**Response:** SVG image

## Configuration

### Supported Languages
- `en-US` - English (USA)
- `de-DE` - Deutsch (Germany)
- `uk-UA` - Українська (Ukraine)

### Likes Per Song
Range: 0-10 with fractional support
- 0: No likes
- 0.5: ~50% of songs have 1 like
- 10: All songs have exactly 10 likes

## Deployment Options

### Option 1: Vercel (Recommended)
1. Push code to GitHub
2. Connect repo to Vercel
3. Set environment variables: `REACT_APP_API_URL`
4. Deploy automatically

### Option 2: Render.com
1. Create new Web Service on Render
2. Connect GitHub repository
3. Set build command: `cd client && npm install && npm run build && cd ../server && npm install`
4. Set start command: `cd server && npm start`

### Option 3: Heroku
```bash
heroku create your-app-name
git push heroku main
heroku config:set REACT_APP_API_URL=https://your-app-name.herokuapp.com
```

### Option 4: Docker
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install server dependencies
COPY server/package*.json ./server/
RUN cd server && npm install

# Build client
COPY client/package*.json ./client/
COPY client/src ./client/src
COPY client/public ./client/public
RUN cd client && npm install && npm run build

# Start server
WORKDIR /app/server
EXPOSE 5000
CMD ["npm", "start"]
```

## Usage Guide

### 1. Set Language
Select from dropdown: English, Deutsch, or Українська

### 2. Control Seed
- Enter a specific seed value for reproducible results
- Click "🎲 Random Seed" to generate new data

### 3. Adjust Likes
Use the slider to set average likes per song (0-10)

### 4. Change View Mode
- **Table**: Paginated view with expandable rows
- **Gallery**: Infinite scroll card view

### 5. Expand Song Details
Click on a row/card to see:
- Album cover image
- Full review text
- Play button for audio preview

## Seed Behavior

- **Same seed = Same data**: Always reproducible across devices
- **Different seed = Different data**: New song titles, artists, genres
- **Changing likes only**: Updates like counts, keeps other data same
- **Page number**: Combined with seed for pagination consistency

## Performance Notes

- Server generates data on-the-fly (no database)
- Each request is ~50ms (very fast)
- Infinite scroll loads 12 songs at a time
- Audio synthesis happens in browser

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers with Web Audio API

## Development Notes

### Adding New Languages
1. Edit `/server/server.js` and add locale to `locales` object
2. Include: adjectives, nouns, artists, genres, reviewPhrases
3. Update ControlBar language options

### Customizing Music Generation
Edit `MusicGenerator.js`:
- Change `scales` for different musical styles
- Modify `chordProgressions` for harmony
- Adjust `beatDuration`, `tempo` for speed
- Change oscillator `type` for different sounds

### Album Cover Customization
Edit `/server/server.js` in the `/api/cover/:id` endpoint:
- Modify gradient colors
- Change text positioning
- Add decorative shapes

## Troubleshooting

**Issue: Songs don't update when changing seed**
- Ensure seed is in correct format (numeric)
- Check browser console for errors
- Verify API URL is correct

**Issue: Audio not playing**
- Check browser supports Web Audio API
- Verify browser hasn't blocked autoplay
- Check browser console for errors

**Issue: Styles look broken**
- Clear browser cache
- Restart development server
- Check CSS variables are supported

## Performance Optimization

For production:
1. Enable gzip compression on server
2. Add caching headers to API endpoints
3. Optimize SVG album covers
4. Implement service worker for offline support
5. Use CDN for static assets

## Future Enhancements

- [ ] Export songs to MP3/ZIP
- [ ] Lyrics display with playback sync
- [ ] More realistic music generation
- [ ] Genre-specific soundscapes
- [ ] Social sharing features
- [ ] User preferences/favorites

## License

MIT - Feel free to use for any purpose

## Support

For issues or questions, contact: p.lebedev@itransition.com

---

**Made with 🎵 and ☕**

# 🚀 Quick Start Guide - Music Store Showcase

Follow this guide to get your Music Store application running quickly.

## First Steps

### Method 1: Local Development

```bash
# 1. Start the server (Terminal 1)
cd server
npm install
npm start
# Server runs at: http://localhost:5000

# 2. Start the client (Terminal 2)
cd client
npm install
npm start
# App opens at: http://localhost:3000
```

### Method 2: Docker Deployment

```bash
docker-compose up --build
# App available at: http://localhost:3000
```

## Using the Main Features

### 1. Set a Seed
Enter any number in the Seed field and press Enter.
- The same seed always produces the same data (Reproducible)
- A new seed produces different songs

### 2. Change Language
English (USA) → Deutsch → Українська
- All song titles, artists, and genres update automatically

### 3. Adjust Likes
- `0`   → No likes
- `0.5` → Average 0.5 likes per song
- `5`   → Average 5 likes per song
- `10`  → Exactly 10 likes per song

### 4. Switch Views
- 📋 **Table View** → With pagination (12 songs per page)
- 🖼️ **Gallery View** → Infinite scroll

### 5. Expand a Song
Click any song → View album cover → Read review → Play preview (▶️)

## Using the API

```bash
# Get songs
GET http://localhost:5000/api/songs?seed=123&page=0&region=en-US&likes=0

# Get album cover
GET http://localhost:5000/api/cover/123
```

## Customization Options

### Add a New Language
Edit `server/server.js`:

```js
'fr-FR': {
  adjectives: ['Rapide', 'Lent', 'Électrique', ...],
  nouns: ['Rêves', 'Nuits', 'Échos', ...],
  ...
}
```

Then add to ControlBar:
```jsx
<option value="fr-FR">Français (France)</option>
```

### Change Music Style
Edit `client/src/components/MusicGenerator.js`:

```js
scales: {
  major: [0, 2, 4, 5, 7, 9, 11],      // Traditional
  minor: [0, 2, 3, 5, 7, 8, 10],      // Melancholic
  pentatonic: [0, 2, 4, 7, 9],        // Asian
}
```

### Change Album Cover Colors
Edit colors in `server/server.js`:

```js
const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];
```

## Testing Features

### Test Reproducibility
1. Set seed: `123456789`
2. Note: "Fast Dreams" appears at #1
3. Change the seed
4. Set seed back to `123456789`
5. Verify: "Fast Dreams" is back 😊

### Test Language Independence
1. Set seed `999` in English → note song title (e.g. "Electric Thunder")
2. Switch to Deutsch → same seed shows different German titles
3. Change likes → titles remain unchanged ✓

### Test Infinite Scroll
1. Go to Gallery View
2. Scroll down → 12 more songs load automatically
3. Keep scrolling → more songs keep loading

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Songs not updating | Clear browser cache (Ctrl+Shift+Del) |
| Music not playing | Use a browser that supports Web Audio API |
| Broken styles | Restart the server |
| API connection error | Check that `REACT_APP_API_URL` is set correctly |

## Next Steps

- [ ] Add custom languages
- [ ] Tune music parameters
- [ ] Deploy to production using Render.com or Vercel

## Useful Links

- 📖 [Full Documentation](./README.md)
- 🐳 [Docker Setup](./docker-compose.yml)
- 💻 [Server Code](./server/server.js)
- ⚛️ [Client Code](./client/src/App.js)

---

**Happy Coding! 🎵✨**

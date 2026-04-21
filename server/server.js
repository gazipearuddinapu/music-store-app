const express = require('express');
const cors = require('cors');
const seedrandom = require('seedrandom');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/build')));

// ─── Localization data ────────────────────────────────────────────────────────
const locales = {
  'en-US': {
    adjectives: ['Fast', 'Slow', 'Electric', 'Silent', 'Golden', 'Dark', 'Bright',
                 'Sweet', 'Bitter', 'Wild', 'Tame', 'Cosmic', 'Ancient', 'Modern', 'Ethereal'],
    nouns:      ['Dreams', 'Nights', 'Echoes', 'Waves', 'Fires', 'Storms', 'Roses',
                 'Shadows', 'Wings', 'Hearts', 'Roads', 'Stars', 'Tears', 'Thunder', 'Whispers'],
    bandNames:  ['The Melody', 'Echo Chamber', 'Neon Lights', 'Silent Storm',
                 'Velvet Voice', 'Crystal Sound', 'Midnight Echo', 'Golden Hour',
                 'Sonic Waves', 'The Harmonics'],
    soloNames:  ['James Carter', 'Lily Monroe', 'Alex Reed', 'Sofia Lane',
                 'Marcus Bell', 'Nora Hayes', 'Dylan Cross', 'Ava Stone'],
    genres:     ['Indie', 'Electronic', 'Rock', 'Jazz', 'Pop', 'Hip-Hop', 'Ambient',
                 'Folk', 'R&B', 'Metal'],
    reviewPhrases: [
      'An incredible sonic journey that stays with you long after the last note.',
      'Raw energy balanced perfectly with melodic precision.',
      'A bold new direction that still feels familiar and inviting.',
      'The production here is absolutely top-tier — every layer earns its place.',
      'Catchy hooks wrapped in a genuinely fresh sound.',
      'Masterful use of dynamics; the quiet moments hit just as hard as the loud ones.',
      'A deeply emotional record with an anthemic quality you rarely hear anymore.',
      'Lush arrangements and a vocal performance that sends chills down your spine.',
    ],
    albumSuffixes: ['Album', 'Collection', 'Sessions', 'Chronicles', 'Tapes'],
  },
  'de-DE': {
    adjectives: ['Schnell', 'Langsam', 'Elektrisch', 'Still', 'Golden', 'Dunkel',
                 'Hell', 'Süß', 'Bitter', 'Wild', 'Ruhig', 'Kosmisch', 'Alt', 'Modern', 'Ätherisch'],
    nouns:      ['Träume', 'Nächte', 'Echos', 'Wellen', 'Feuer', 'Stürme', 'Rosen',
                 'Schatten', 'Flügel', 'Herzen', 'Straßen', 'Sterne', 'Tränen', 'Donner', 'Flüstern'],
    bandNames:  ['Die Melodie', 'Echokammer', 'Neonlichter', 'Stiller Sturm',
                 'Samtene Stimme', 'Kristallklang', 'Mitternachtsecho', 'Goldene Stunde',
                 'Schallwellen', 'Die Harmonien'],
    soloNames:  ['Klaus Weber', 'Anna Müller', 'Felix Braun', 'Lena Schmidt',
                 'Tobias Richter', 'Marie Wolf', 'Jonas Berg', 'Laura Fuchs'],
    genres:     ['Indie', 'Elektronisch', 'Rock', 'Jazz', 'Pop', 'Hip-Hop',
                 'Ambient', 'Folk', 'R&B', 'Metal'],
    reviewPhrases: [
      'Eine unglaubliche Klangreise, die noch lange nachwirkt.',
      'Rohe Energie, perfekt mit melodischer Präzision ausbalanciert.',
      'Eine mutige neue Richtung, die sich trotzdem vertraut anfühlt.',
      'Die Produktion hier ist absolut erstklassig — jede Ebene verdient ihren Platz.',
      'Eingängige Hooks in einem wirklich frischen Klangbild.',
      'Meisterhafte Nutzung der Dynamik; die leisen Momente treffen genauso stark.',
      'Eine zutiefst emotionale Platte mit einem epischen Charakter.',
      'Üppige Arrangements und ein Gesang, der Gänsehaut erzeugt.',
    ],
    albumSuffixes: ['Album', 'Sammlung', 'Sessions', 'Chroniken', 'Bänder'],
  },
  'uk-UA': {
    adjectives: ['Швидкий', 'Повільний', 'Електричний', 'Тихий', 'Золотий', 'Темний',
                 'Яскравий', 'Солодкий', 'Гіркий', 'Дикий', 'Спокійний', 'Космічний',
                 'Древній', 'Сучасний', 'Ефірний'],
    nouns:      ['Мрії', 'Ночі', 'Луни', 'Хвилі', 'Вогні', 'Бурі', 'Троянди',
                 'Тіні', 'Крила', 'Серця', 'Дороги', 'Зірки', 'Сльози', 'Грім', 'Шепоти'],
    bandNames:  ['Неонові Вогні', 'Тихий Буран', 'Оксамитний Голос', 'Кришталевий Звук',
                 'Опівнічне Луна', 'Золота Година', 'Звукові Хвилі', 'Нічна Мелодія',
                 'Ехо Камера', 'Гармонія'],
    soloNames:  ['Олексій Коваль', 'Марія Шевченко', 'Тарас Бондар', 'Оксана Мельник',
                 'Ігор Лисенко', 'Наталія Гончар', 'Василь Поліщук', 'Ірина Кравець'],
    genres:     ['Інді', 'Електроніка', 'Рок', 'Джаз', 'Поп', 'Хіп-Хоп',
                 'Амбієнт', 'Фольк', 'R&B', 'Метал'],
    reviewPhrases: [
      'Неймовірна звукова подорож, яка залишається з тобою надовго.',
      'Сира енергія, ідеально збалансована з мелодичною точністю.',
      'Сміливий новий напрямок, який все одно відчувається знайомим.',
      'Виробництво тут абсолютно першокласне — кожен шар заслуговує свого місця.',
      'Чіпкі хуки в справді свіжому звучанні.',
      'Майстерне використання динаміки; тихі моменти вражають не менше гучних.',
      'Глибоко емоційна платівка з гімновою якістю.',
      'Розкішні аранжування та вокальне виконання, що пробирає до мурашок.',
    ],
    albumSuffixes: ['Альбом', 'Збірка', 'Сесії', 'Хроніки', 'Записи'],
  },
};

// ─── Song generation ──────────────────────────────────────────────────────────
function generateSongs(seed, page, pageSize, region, likesPerSong) {
  const locale = locales[region] || locales['en-US'];
  const startIndex = page * pageSize;
  const songs = [];

  for (let i = startIndex; i < startIndex + pageSize; i++) {
    // Per-song seed: combines user seed + song index (MAD: multiply-add)
    const songSeed = seedrandom(`${seed}-song-${i}`);

    // Title
    const adjective = locale.adjectives[Math.floor(songSeed() * locale.adjectives.length)];
    const noun      = locale.nouns[Math.floor(songSeed() * locale.nouns.length)];
    const title     = `${adjective} ${noun}`;

    // Artist — mix of bands and solo names (seeded, not Math.random)
    const artistPool = [...locale.bandNames, ...locale.soloNames];
    const artist = artistPool[Math.floor(songSeed() * artistPool.length)];

    // Album — 70% chance of album, 30% Single (fully seeded)
    const albumNoun   = locale.nouns[Math.floor(songSeed() * locale.nouns.length)];
    const albumSuffix = locale.albumSuffixes[Math.floor(songSeed() * locale.albumSuffixes.length)];
    const album = songSeed() > 0.3 ? `${albumNoun} ${albumSuffix}` : 'Single';

    // Genre
    const genre = locale.genres[Math.floor(songSeed() * locale.genres.length)];

    // Likes — probabilistic to achieve desired average (uses separate seed slot)
    let likes = 0;
    if (likesPerSong > 0) {
      const whole = Math.floor(likesPerSong);
      const frac  = likesPerSong - whole;
      likes = whole + (songSeed() < frac ? 1 : 0);
    }

    // Review
    const review = locale.reviewPhrases[Math.floor(songSeed() * locale.reviewPhrases.length)];

    songs.push({
      index: i + 1,
      title,
      artist,
      album,
      genre,
      likes,
      review,
      seed: seed.toString(),
      audioSeed: `${seed}-audio-${i}`,
    });
  }

  return songs;
}

// ─── API endpoints ────────────────────────────────────────────────────────────
app.get('/api/songs', (req, res) => {
  try {
    const seed        = BigInt(req.query.seed || Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
    const page        = parseInt(req.query.page || 0);
    const region      = req.query.region || 'en-US';
    const likesPerSong = parseFloat(req.query.likes || 0);
    const pageSize    = 12;

    if (!locales[region]) {
      return res.status(400).json({ error: `Unknown region: ${region}` });
    }

    const songs = generateSongs(seed, page, pageSize, region, likesPerSong);
    res.json({ songs, page, pageSize, seed: seed.toString() });
  } catch (err) {
    console.error('Error generating songs:', err);
    res.status(500).json({ error: 'Failed to generate songs', details: err.message });
  }
});

// Escape XML chars to prevent broken SVG
function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Album cover endpoint — returns SVG
app.get('/api/cover/:id', (req, res) => {
  const { id } = req.params;
  const { title, artist } = req.query;

  const colors        = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
  const gradientColors = ['#C0392B', '#1A5276', '#117A65', '#B7950B', '#6C3483', '#1A237E', '#BF360C', '#004D40'];

  const hash        = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const color       = colors[hash % colors.length];
  const gradColor   = gradientColors[hash % gradientColors.length];

  const safeTitle  = escapeXml((title  || 'Track').substring(0, 24));
  const safeArtist = escapeXml((artist || 'Artist').substring(0, 24));

  const svg = `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   style="stop-color:${color};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${gradColor};stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="300" height="300" fill="url(#grad)"/>
  <circle cx="150" cy="120" r="80" fill="white" opacity="0.08"/>
  <circle cx="240" cy="60"  r="50" fill="white" opacity="0.06"/>
  <circle cx="30"  cy="240" r="60" fill="${color}" opacity="0.2"/>
  <text x="150" y="145" font-size="20" font-weight="bold" text-anchor="middle" fill="white" font-family="Arial, sans-serif">${safeTitle}</text>
  <text x="150" y="175" font-size="14" text-anchor="middle" fill="rgba(255,255,255,0.85)" font-family="Arial, sans-serif">${safeArtist}</text>
</svg>`;

  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(svg);
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, '../client/build/index.html');
  res.sendFile(indexPath, (err) => {
    if (err) res.status(200).send('<h2>Music Store Server is running. Start the React client separately.</h2>');
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

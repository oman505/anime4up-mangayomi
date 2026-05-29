# Anime4Up Mangayomi Extension

🎌 **Arabic anime streaming extension for Mangayomi with direct video extraction**

## ✨ Features

- 🎥 **Direct Video URL Extraction** - Uses MoonGetter-inspired regex patterns to extract direct mp4/m3u8 URLs
- 🌐 **Multi-Server Support** - Compatible with mp4upload, VOE, streamtape, and other popular hosts
- 🔄 **Smart Fallback** - Returns embed URL if direct extraction fails
- 🖼️ **Image Handling** - Robust lazy-load image extraction with Referer header support
- 🇸🇦 **Arabic Content** - Native support for Arabic anime streaming from Anime4Up

## 📦 Installation

### Method 1: Direct URL (Recommended)

1. Open **Mangayomi** app
2. Go to **Browse** → **Extensions**
3. Tap the **+** button (Add extension)
4. Enter this URL:
   ```
   https://raw.githubusercontent.com/oman505/anime4up-mangayomi/main/anime_index.json
   ```
5. Tap **Install**

### Method 2: Manual Import

1. Download `anime4up.js` and `anime_index.json` from this repository
2. In Mangayomi, go to **Browse** → **Extensions**
3. Import the files manually

## 🎯 Version

**Current Version:** `0.1.5`

### What's New in v0.1.5

- ✅ Implemented MoonGetter-inspired direct video URL extraction
- ✅ Added support for mp4upload, VOE, streamtape and other hosts
- ✅ Multiple regex patterns for robust video detection
- ✅ Fallback mechanism for unsupported hosts
- ✅ Referer header handling for protected content

## 🔧 Technical Details

### Video Extraction Patterns

The extension uses multiple regex patterns to extract direct video URLs:

```javascript
// Mp4Upload pattern
/src\\s*:\\s*"([^"]+\\.mp4[^"]*)"/

// VOE/HLS pattern
/'hls'\\s*:\\s*'([^']+\\.m3u8[^']*)'/

// Streamtape pattern
/getElementById\\('robotlink'\\)\\.innerHTML\\s*=\\s*'([^']+)'/

// Generic mp4/m3u8 detection
/"(https?:\\/\\/[^"]+\\.(mp4|m3u8)[^"]*)"/
```

### Supported Functions

- `getPopularAnime(page)` - Get popular anime list
- `getLatestUpdates(page)` - Get latest episode updates
- `search(query, page)` - Search anime by title
- `getDetail(url)` - Get anime details and episode list
- `getVideoList(episodeUrl)` - Extract video servers with direct URLs
- `getImageUrl(imageUrl)` - Handle lazy-loaded images

## 🌐 Source Website

**Base URL:** `https://w1.anime4up.rest`

## 🤝 Credits

- Inspired by [MoonGetter](https://github.com/darkryh/MoonGetter) for video extraction patterns
- Built for [Mangayomi](https://github.com/kodjodevf/mangayomi) - Multi-source anime/manga reader

## 📝 License

MIT License - Feel free to use and modify

## ⚠️ Disclaimer

This extension is for educational purposes only. Please respect copyright laws and support official releases when available.

## 🐛 Issues & Contributions

Found a bug or want to contribute? Feel free to open an issue or submit a pull request!

---

**Made with ❤️ for the anime community**

const mangayomiSources = [{
  "name": "Anime4Up",
  "lang": "ar",
  "baseUrl": "https://w1.anime4up.rest",
  "apiUrl": "",
  "iconUrl": "https://w1.anime4up.rest/wp-content/themes/Anime4uP/images/logo.png",
  "typeSource": "single",
  "itemType": 1,
  "version": "0.1.5",
  "dateFormat": "",
  "dateFormatLocale": "",
  "pkgPath": "anime/src/ar/anime4up.js"
}];

const baseUrl = "https://w1.anime4up.rest";
const client = new Client();

// Helper: Extract direct video URL from embed
async function extractDirectVideo(embedUrl) {
  try {
    const response = await client.get(embedUrl, { "Referer": baseUrl });
    const html = response.body;
    
    const patterns = [
      /src\\s*:\\s*"([^"]+\\.mp4[^"]*)"/,
      /file\\s*:\\s*"([^"]+\\.mp4[^"]*)"/,
      /'hls'\\s*:\\s*'([^']+\\.m3u8[^']*)'/,
      /sources\\s*:\\s*\\[\\s*{\\s*file\\s*:\\s*"([^"]+)"/,
      /getElementById\\('robotlink'\\)\\.innerHTML\\s*=\\s*'([^']+)'/,
      /"(https?:\\/\\/[^"]+\\.(mp4|m3u8)[^"]*)"/,
      /'(https?:\\/\\/[^']+\\.(mp4|m3u8)[^']*)'/
    ];
    
    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        let videoUrl = match[1];
        if (videoUrl.startsWith('http')) {
          return videoUrl;
        }
        if (videoUrl.startsWith('//')) {
          return 'https:' + videoUrl;
        }
      }
    }
    
    return embedUrl;
  } catch (e) {
    return embedUrl;
  }
}

class DefaultExtension extends MProvider {
  async getPopular(page) {
    const url = `${baseUrl}/home8/page/${page}`;
    const response = await client.get(url, { "Referer": baseUrl });
    const doc = new Document(response.body);
    
    const animeList = [];
    const items = doc.select("ul.Indexul li");
    
    items.forEach(item => {
      const link = item.selectFirst("a");
      const img = item.selectFirst("img");
      
      if (link && img) {
        animeList.push({
          name: link.text().trim() || img.attr("alt") || "Unknown",
          link: link.attr("href"),
          imageUrl: img.attr("src") || img.attr("data-src") || ""
        });
      }
    });
    
    return JSON.stringify(animeList);
  }

  async getLatestUpdates(page) {
    const url = `${baseUrl}/home8/page/${page}`;
    const response = await client.get(url, { "Referer": baseUrl });
    const doc = new Document(response.body);
    
    const updates = [];
    const sections = doc.select("div.col-md-6.col-lg-4");
    
    sections.forEach(section => {
      const heading = section.selectFirst("h3");
      if (!heading) return;
      
      const link = heading.selectFirst("a");
      if (!link) return;
      
      const animeTitle = link.text().trim();
      const episodes = section.select("ul.Indexul2 li a");
      
      episodes.forEach(ep => {
        updates.push({
          name: `${animeTitle} - ${ep.text().trim()}`,
          link: ep.attr("href"),
          imageUrl: ""
        });
      });
    });
    
    return JSON.stringify(updates);
  }

  async search(query, page) {
    const url = `${baseUrl}/?search_param=anime&s=${encodeURIComponent(query)}`;
    const response = await client.get(url, { "Referer": baseUrl });
    const doc = new Document(response.body);
    
    const results = [];
    const items = doc.select("div.hover0 a");
    
    items.forEach(item => {
      const img = item.selectFirst("img");
      const title = item.selectFirst("div.ImgOverlay1");
      
      if (img && title) {
        results.push({
          name: title.text().trim() || img.attr("alt") || "Unknown",
          link: item.attr("href"),
          imageUrl: img.attr("src") || img.attr("data-src") || ""
        });
      }
    });
    
    return JSON.stringify(results);
  }

  async getDetail(url) {
    const response = await client.get(url, { "Referer": baseUrl });
    const doc = new Document(response.body);
    
    const title = doc.selectFirst("h1.anime-details-title")?.text().trim() || "Unknown";
    const desc = doc.selectFirst("div.anime-details-description, p.story")?.text().trim() || "No description";
    const img = doc.selectFirst("img.anime-details-img, div.RightBox img");
    const imageUrl = img ? (img.attr("src") || img.attr("data-src") || "") : "";
    
    const episodes = [];
    const epList = doc.select("ul.Indexul li a, div.Episodes--Mainbody a");
    
    epList.forEach(ep => {
      episodes.push({
        name: ep.text().trim(),
        url: ep.attr("href")
      });
    });
    
    return JSON.stringify({
      name: title,
      imageUrl: imageUrl,
      description: desc,
      episodes: episodes
    });
  }

  async getVideoList(episodeUrl) {
    const response = await client.get(episodeUrl, { "Referer": baseUrl });
    const doc = new Document(response.body);
    
    const videos = [];
    const serverRows = doc.select("tr");
    
    for (const row of serverRows) {
      const cells = row.select("td");
      if (cells.length < 2) continue;
      
      const serverName = cells[0].text().trim();
      const link = cells[1].selectFirst("a");
      
      if (!link) continue;
      
      const embedUrl = link.attr("href");
      if (!embedUrl || embedUrl === "#") continue;
      
      const directUrl = await extractDirectVideo(embedUrl);
      
      videos.push({
        url: directUrl,
        originalUrl: embedUrl,
        quality: serverName,
        headers: { "Referer": baseUrl }
      });
    }
    
    return JSON.stringify({ videos: videos });
  }

  getImageUrl(imageUrl) {
    const patterns = [
      imageUrl,
      imageUrl.replace("-150x150", ""),
      imageUrl.replace("-300x169", ""),
      imageUrl.replace(/\\/resize\\/\\d+,\\d+\\//, "/")
    ];
    
    for (const url of patterns) {
      if (url && url.startsWith("http")) {
        return url;
      }
    }
    
    return imageUrl;
  }
}

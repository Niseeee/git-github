import fetch from 'node-fetch'; // Make sure to install node-fetch

export default class NyaaSource extends AbstractSource {
  name = 'Nyaa.si';
  description = 'Fetches torrents from Nyaa.si RSS feed';
  accuracy = 'Medium';

  async fetchRSS() {
    try {
      const response = await fetch('https://nyaa.si/?page=rss');
      if (!response.ok) throw new Error('Network response was not ok');
      const text = await response.text();
      return new window.DOMParser().parseFromString(text, 'text/xml');
    } catch (error) {
      console.error('Failed to fetch RSS feed:', error);
      throw error;
    }
  }

  async parseFeed(feed) {
    const items = feed.getElementsByTagName('item');
    const results = [];

    for (let i = 0; i < items.length; i++) {
      const title = items[i].getElementsByTagName('title')[0].textContent;
      const link = items[i].getElementsByTagName('link')[0].textContent;
      const pubDate = items[i].getElementsByTagName('pubDate')[0].textContent;

      results.push({ title, link, pubDate });
    }

    return results;
  }

  /**
   * Gets results for single episode
   * @type {import('./type-definitions').SearchFunction}
   */
  async single(options) {
    const feed = await this.fetchRSS();
    const results = await this.parseFeed(feed);
    return results; // Implement filtering for a specific episode if necessary
  }

  /**
   * Gets results for batch of episodes
   * @type {import('./type-definitions').SearchFunction}
   */
  async batch(options) {
    const feed = await this.fetchRSS();
    return await this.parseFeed(feed); // Return all results for batch search
  }

  /**
   * Gets results for a movie
   * @type {import('./type-definitions').SearchFunction}
   */
  async movie(options) {
    const feed = await this.fetchRSS();
    const results = await this.parseFeed(feed);
    return results; // Implement filtering for movies if necessary
  }
}

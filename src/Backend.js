import 'whatwg-fetch';

/**
 * Manages backend requests.
 * @author Johan Svensson
 */
export default class Backend {
  static get baseUrl() {
    return `${document.location.origin}/api`;
  }

  /**
   * Performs a regular request to the backend.
   * @param {string} path Relative path + query parameters, excluding leading question mark ("?")
   * @param {Object} post Optional POST parameters
   */
  static async request(path, post) {
    let useGet = !post || Object.keys(post).length == 0;

    await (await window.fetch(`${Backend.baseUrl}${path}`, {
      method: useGet ? "GET" : "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: useGet ? undefined : JSON.stringify(post)
    })).json();
  }
}
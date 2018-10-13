/**
 * Manages backend requests.
 * @author Johan Svensson
 */
export default class {
  static get baseUrl() {
    return document.location.origin;
  }

  /**
   * Performs a regular request to the backend.
   * @param {string} query Query parameters, excluding leading question mark ("?")
   * @param {Object} post Optional POST parameters
   */
  static async request(query, post) {

  }
}
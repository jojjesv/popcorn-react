import 'whatwg-fetch';
import Utils from './Utils';

let dev = document.location.origin.indexOf('localhost') != -1;

/**
 * Manages backend requests.
 * @author Johan Svensson
 */
export default class Backend {
  static get baseUrl() {
    return `${dev ? 'http://192.168.98.96:3001' : document.location.origin.replace(":3000", ":3001")}/api`;
  }

  /**
   * Performs a simple GET request.
   * @param {string} path 
   */
  static async get(path) {
    return await this.request(path, null, 'get');
  }

  /**
   * Performs a simple POST request.
   * @param {string} path 
   */
  static async post(path, body) {
    return await this.request(path, body, 'post');
  }

  /**
   * Performs a simple PUT request.
   * @param {string} path 
   */
  static async put(path, body) {
    return this.request(path, body, 'put');
  }

  /**
   * Performs a simple DELETE request.
   * @param {string} path 
   */
  static async delete(path) {
    return await this.request(path, null, 'get');
  }

  /**
   * Performs a regular request to the backend.
   * @param {string} path Relative path + query parameters, excluding leading question mark ("?")
   * @param {Object} post Optional POST parameters
   * @param {"get"|"post"|"put"|"delete"} method HTTP method
   */
  static async request(path, body, method) {
    if (body instanceof FormData) {
      body = Utils.formDataToObject(body);
    }

    let useGet = !body || Object.keys(body).length == 0;

    if (method == null && useGet) {
      method = 'get';
    }

    return await (await window.fetch(`${Backend.baseUrl}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: useGet ? undefined : JSON.stringify(body)
    })).json();
  }
}
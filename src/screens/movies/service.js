import {
  QueryOptions
} from './search'
import Utils from '../../Utils';
import Backend from '../../Backend';

/**
 * Fetches all movies with optional query parameters.
 * @param {QueryOptions} opts
 */
export async function fetchMovies(opts = {}) {
  let hasOpts = !Utils.isEmpty(opts);

  let queryParams = "";
  if (hasOpts) {
    queryParams = `?q=${encodeURIComponent(opts.query)}&scope=${opts.queryScope || "movie"}`
  }

  return await Backend.get(
    `/movies${queryParams}`
  );
}
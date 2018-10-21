import Backend from "../../Backend";
import Utils from "../../Utils";

export default {
  /**
   * Submits input data to the back.
   * @param {FormData} data 
   */
  async submit(data) {
    let result = await Backend.post('/movie', data);
    return result;
  },

  async fetchMovieByImdbId(imdbId) {
    while (true) {
      try {
        let { result } = await Backend.request(
          `/movie/imdb/${imdbId}`
        );

        return result;

      } catch (e) {
        //  Wait a little before trying again
        await Utils.sleep(2500);
      }
    }
  }
}
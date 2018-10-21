import Backend from "../../Backend";

export default {
  async saveModification(movieId, modified) {
    let result = await Backend.put(
      `/movie/${movieId}`,
      modified
    );
  }
}
/**
 * Some utilities.
 * @author Johan Svensson
 */
export default {
  /**
   * Converts minutes to an hour-minute time string.
   * e.g. 110 -> 1hr 50min
   * @param {number} minutes 
   */
  minutesToTimeString(minutes) {
    let hrs = Math.floor(minutes / 60);
    let mins = minutes % 60;
    
    if (hrs && mins) {
      return `${hrs}${hrs == 1 ? 'hr' : 'hrs'} ${mins}min`;
    } else if (hrs) {
      return `${hrs}${hrs == 1 ? 'hr' : 'hrs'}`;
    } else {
      return `${mins}min`;
    }
  },

  sleep(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms)
    })
  }
}
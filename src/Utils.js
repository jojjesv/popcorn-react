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
  },

  /**
   * Converts a FormData instance to a JSON object.
   * @param {FormData} data 
   */
  formDataToObject(data) {
    let obj = {};
    data.forEach((v, k) => {
      obj[k] = v;
    })
    return obj;
  },

  isEmpty(obj) {
    return Object.keys(obj).length == 0;
  },

  /**
   * @returns Name initials, e.g. John Doe -> JD
   * @param {string} fullName 
   */
  nameInitials(fullName) {
    return fullName.split(" ").map(s => s.charAt(0).toUpperCase()).join("");
  }
}
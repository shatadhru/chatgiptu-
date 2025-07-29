// utils/sanitize.js
function sanitize(obj = {}) {
  for (let key in obj) {
    if (key.startsWith('$') || key.includes('.')) {
      const safeKey = key.replace(/\$/g, "_").replace(/\./g, "_");
      obj[safeKey] = obj[key];
      delete obj[key];
    }
  }
  return obj;
}

module.exports = sanitize;

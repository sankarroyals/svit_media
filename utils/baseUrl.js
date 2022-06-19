const baseUrl =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:3000"
    : "https://svit-media.herokuapp.com";

module.exports = baseUrl;

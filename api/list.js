const fetch = require("node-fetch");

module.exports = async (req, res) => {
  const dbres = await fetch(
    `https://college-break-calendar-default-rtdb.firebaseio.com/.json?auth=${process.env.FIREBASE_SECRET}`
  );
  const db = await dbres.json();

  return res.send(db);
};

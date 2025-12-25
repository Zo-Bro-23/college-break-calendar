const ics = require("ics");
const fetch = require("node-fetch");

module.exports = async (req, res) => {
  const events = [];
  const colleges = req.query.college.split(",");
  const dbres = await fetch(
    `https://college-break-calendar-default-rtdb.firebaseio.com/.json?auth=${process.env.FIREBASE_SECRET}`
  );
  const db = await dbres.json();
  console.log(db);
  for (key in db) {
    if (colleges.includes(key) || colleges == []) {
      for (br in db[key]) {
        const event = db[key][br];
        const start = new Date(event.startDate);
        const end = new Date(event.endDate);
        events.push({
          start: [start.getFullYear(), start.getMonth() + 1, start.getDate()],
          end: [end.getFullYear(), end.getMonth() + 1, end.getDate()],
          title: event.collegeName,
          description: `${event.breakType} Break`,
          url: event.proof,
          status: "CONFIRMED",
          categories: [event.collegeName, event.breakType, key],
          productId: "Zo-Bro-23/college-break-calendar",
          calName: "College Break Calendar",
        });
      }
    }
  }

  console.log(events);

  const { error, value } = ics.createEvents(events);
  if (error) {
    return res.status(400).send(error);
  } else {
    res.setHeader("Content-Type", "text/calendar; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="breaks.ics"');
    return res.send(value);
  }
};

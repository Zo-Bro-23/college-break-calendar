const ics = require("ics");
const admin = require("firebase-admin");
const fetch = require("node-fetch");

module.exports = async (req, res) => {
  const events = [];
  const colleges = req.query.college.split(",");
  const dbres = await fetch(
    `https://college-break-calendar-default-rtdb.firebaseio.com/.json?auth=${process.env.FIREBASE_SECRET}`
  );
  const db = await dbres.json();
  for (key in json) {
    if (colleges.includes(key)) {
      for (br in json[key]) {
        const event = json[key][br];
        const start = new Date(event["Start Date"]);
        const end = new Date(event["End Date"]);
        events.push({
          start: [start.getFullYear(), start.getMonth(), start.getDate()],
          end: [end.getFullYear(), end.getMonth(), end.getDate()],
          title: event["College Name"],
          description: `${event["Break Type"]} Break`,
          url: event["Proof"],
          status: "CONFIRMED",
          categories: [event["College Name"], event["Break Type"], key],
          productId: "Zo-Bro-23/college-break-calendar",
          calName: "College Break Calendar",
        });
      }
    }
  }

  const { error, value } = ics.createEvents(events);
  if (error) {
    return res.status(500).send(error);
  } else {
    res.setHeader("Content-Type", "text/calendar; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="breaks.ics"');
    return res.send(value);
  }
};

const express = require("express");
const app = express();
const cors = require("cors");
const create = require("./api/create");
const list = require("./api/list");
require("dotenv").config();

app.use(cors());

app.get("/", create);
app.get("/list", list);

app.listen(5210);

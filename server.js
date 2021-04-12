// load .env data into process.env
require('dotenv').config();

const express = require("express");
const path = require('path');

const app = express();
app.get("/login")

// Use node to connect to psql db
const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
// const db = new Pool({
//   user: 'vagrant',
//   password: '123',
//   host: 'localhost',
//   database: 'final_project'
// });
db.connect();
module.exports = db;

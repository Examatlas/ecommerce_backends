// gfs.js
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

// MongoDB URI
const mongoURI = process.env.DB;

const conn = mongoose.createConnection(mongoURI);

let gfs;

// Create a promise to ensure connection happens once
    conn.once('open', () => {
      gfs = Grid(conn.db, mongoose.mongo);
      gfs.collection('uploads'); // The GridFS collection
      console.log("GFS Connection initiated")
    });

module.exports = {
  gfs
};

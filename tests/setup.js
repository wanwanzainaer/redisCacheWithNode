jest.setTimeout(30000);
require("../models/User");

const mongoose = require("mongoose");
const mongoURI = require("../config/keys").mongoURI;
mongoose.Promise = global.Promise;
mongoose.connect(mongoURI, { useMongoClient: true });

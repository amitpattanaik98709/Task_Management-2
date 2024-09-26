const mongoose = require("mongoose");

const Userlistschema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  list: {
    type: String,
    required: [true, "List name is required"], // Custom error message for required validation
    trim: true, // Trims whitespace from the string
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the field to the current date and time
  },
  tasks: {
    type: [String], // Array of task objects
    default: [],
  },
});

const Userlists=mongoose.model("Userlists",Userlistschema);
module.exports=Userlists;
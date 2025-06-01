const mongoose = require("mongoose");

const chefSchema = mongoose.Schema({
  name: {
    type: String,
  },

  orders: {
    type: Number,
    default: 0,
    min: 0,
  },

  timeRemaining: {
    type: Number,
    default: 0,
    min: 0,
  },
});

const Chef = new mongoose.model("Chef", chefSchema);

module.exports = Chef;

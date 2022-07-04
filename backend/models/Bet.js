const mongoose = require("mongoose");

const BetSchema = mongoose.Schema({
  id: Number,
  contractAddress: String,
  teamA: String,
  teamB: String,
  teamALogo: String,
  teamBLogo: String,
  date: String,
  category: String,
  status: Boolean,
  winner: String,
});

module.exports = mongoose.model("Bets", BetSchema);

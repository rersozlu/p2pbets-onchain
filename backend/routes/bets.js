const { request } = require("express");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Bet = require("../models/Bet");
const cors = require("cors");
require("dotenv").config();

router.use(cors());

router.get("/", async (req, res) => {
  console.log(req.headers);

  try {
    const bets = await Bet.find();
    res.json(bets);
  } catch (e) {
    res.send(e);
  }
});

router.post("/", async (req, res) => {
  try {
    const validation = await bcrypt.compare(
      req.headers.password || "none",
      process.env.PASSWORD_HASH
    );
    if (validation) {
      const bet = new Bet({
        id: req.body.id,
        contractAddress: req.body.contractAddress,
        teamA: req.body.teamA,
        teamB: req.body.teamB,
        teamALogo: req.body.teamALogo,
        teamBLogo: req.body.teamBLogo,
        date: req.body.date,
        category: req.body.category,
        status: req.body.status,
        winner: req.body.winner,
      });
      await bet
        .save()
        .then((data) => {
          res.json(data);
        })
        .catch((err) => res.status(404).send(err));
    }
  } catch (e) {
    console.log(e);
  }
});

router.patch("/:betId", async (req, res) => {
  try {
    const validation = await bcrypt.compare(
      req.headers.password || "none",
      process.env.PASSWORD_HASH
    );
    if (validation) {
      const updatedBet = await Bet.updateOne(
        { id: req.params.betId },
        {
          $set: {
            status: req.body.status,
            winner: req.body.winner,
          },
        }
      )
        .then((data) => res.send(data))
        .catch((e) => res.send(e));
    }
  } catch (e) {
    res.send(e);
  }
});

router.delete("/:betId", async (req, res) => {
  try {
    const validation = await bcrypt.compare(
      req.headers.password || "none",
      process.env.PASSWORD_HASH
    );
    if (validation) {
      await Bet.remove({
        id: req.params.betId,
      })
        .then((data) => res.send(data))
        .catch((e) => res.send(e));
    }
  } catch (e) {
    res.send(e);
  }
});

module.exports = router;

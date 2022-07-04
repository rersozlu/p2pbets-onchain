const { request } = require("express");
const express = require("express");
const router = express.Router();
const Bet = require("../models/Bet");

router.get("/", async (req, res) => {
  try {
    const bets = await Bet.find();
    res.json(bets);
  } catch (e) {
    res.send(e);
  }
});

router.post("/", async (req, res) => {
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
});

router.patch("/:betId", async (req, res) => {
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
});

router.delete("/:betId", async (req, res) => {
  await Bet.remove({
    id: req.params.betId,
  })
    .then((data) => res.send(data))
    .catch((e) => res.send(e));
});

module.exports = router;

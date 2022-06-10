const express = require('express')
const router = express.Router()
const { corporation } = require("../models")
const db = require('../models')


// GET ALL CORPORATIONS - localhost:3001/corporation
router.get("/", async (req, res) => {
    const data = req.body;
    console.log(data);

    const [results, metadata] = await db.sequelize.query(
        "SELECT * FROM corporation"
    );

    res.send(results);
})

// GET ALL CORPORATIONS STATS - localhost:3001/corporation/stats
router.get("/stats", async (req, res) => {
    const data = req.body;
    console.log(data);

    const [results, metadata] = await db.sequelize.query(
        "SELECT * FROM display_corporation_stats"
    );

    res.send(results);
})

// GET SINGLE CORPORATION - localhost:3001/:corpID
router.get("/:corpID", async (req, res) => {
    console.log(req.params);

    const [results, metadata] = await db.sequelize.query(
        "SELECT * FROM corporation WHERE corpID = :corpID",
        {
            replacements: {corpID: req.params.corpID}
        }
    );

    res.send(results);
})

// CREATE A COPORATION - localhost:3001/corporation
router.post("/create", async (req, res) => {
    const data = req.body;
    console.log(data);

    await corporation.create(data)
    .then((data) => {
        res.json(data)
    }).catch((err) => {
        res.status(500).json(err);
    })
})

// DELETE A CORPORATION - localhost:3001/corporation/:corpID
router.delete("/:corpID", async (req, res) => {
    console.log(req.params);

    corporation.destroy({
        where: {
            corpID: req.params.corpID //this will be your id that you want to delete
        }
    }).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
        if(rowDeleted === 1){
            console.log('Deleted successfully');
        }
    });

    res.sendStatus(200)
})

module.exports = router
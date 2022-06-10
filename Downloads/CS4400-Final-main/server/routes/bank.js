const express = require('express')
const router = express.Router()
const { bank, workFor } = require("../models")
const db = require('../models')


// GET ALL BANKS - localhost:3001/bank
router.get("/", async (req, res) => {
    const data = req.body;
    console.log(data);

    const [results, metadata] = await db.sequelize.query(
        "SELECT * FROM bank"
    );
    res.send(results);
})
// Get count of employees in a bank based on bankID

// GET ALL BANK STATS - localhost:3001/bank/stats
router.get("/stats", async (req, res) => {
    const data = req.body;
    console.log(data);

    const [results, metadata] = await db.sequelize.query(
        "SELECT * FROM display_bank_stats"
    );

    res.send(results);
})

// GET SINGLE BANK - localhost:3001/:bankID
router.get("/:bankID", async (req, res) => {
    console.log(req.params);

    const [results, metadata] = await db.sequelize.query(
        "SELECT * FROM bank WHERE bankID = :bankID",
        {
            replacements: {bankID: req.params.bankID}
        }
    );

    res.send(results);
})

// CREATE A BANK - localhost:3001/bank
router.post("/", async (req, res) => {
    const data = req.body;
    console.log(data);

    try {
        await bank.create({
            bankID: data.bankID,
            bankName: data.bankName,
            street: data.street,
            city: data.city,
            state: data.state,
            zip: data.zip,
            resAssets: data.resAssets,
            corpID: data.corpID,
            manager: data.manager,
        });
    } catch (err) {
        res.status(500).json(err)
    }
    
    if (data.employee !== "") {
        try {
            await db.sequelize.query(
                "INSERT INTO workFor (bankID, perID) VALUES (:bankID, :perID)",
                {
                    replacements: {bankID: data.bankID, perID: data.employee}
                }
            )
        } catch (err) {
            res.status(500).json(err)
        }
    }
    
    res.json(data);

})

// DELETE A BANK - localhost:3001/bank/:bankID
router.delete("/:bankID", async (req, res) => {
    console.log(req.params);

    bank.destroy({
        where: {
            bankID: req.params.bankID //this will be your id that you want to delete
        }
    }).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
        if(rowDeleted === 1){
            console.log('Deleted successfully');
        }
    });

    res.sendStatus(200)
})

module.exports = router
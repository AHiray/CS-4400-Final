const express = require('express')
const router = express.Router()
const { interest_bearing } = require("../models")
const db = require('../models')


// GET ALL INTEREST BEARING ACCOUNTS - localhost:3001/interest_bearing
router.get("/", async (req, res) => {
    const data = req.body;
    console.log(data);

    const [results, metadata] = await db.sequelize.query(
        "SELECT * FROM interest_bearing"
    );

    res.send(results);
})

// GET ALL INTEREST-BEARING ACCOUNTS FROM ONE BANK- localhost:3001/interest_bearing/:bankID
router.get("/:bankID", async (req, res) => {
    console.log(req.params);
    const [results, metadata] = await db.sequelize.query(
        "SELECT * FROM interest_bearing WHERE bankID = :bankID",
        {
            replacements: {bankID: req.params.bankID}
        }

    );
    res.send(results);
})

// GET SINGLE INTEREST BEARING ACCOUNT - localhost:3001/:bankID%:accountID
router.get("/:bankID%:accountID", async (req, res) => {
    console.log(req.params);

    const [results, metadata] = await db.sequelize.query(
        "SELECT * FROM interest_bearing WHERE bankID = :bankID and accountID = :accountID",
        {
            replacements: {bankID: req.params.bankID, accountID: req.params.accountID}
        }
    );

    res.send(results);
})

// CREATE A INTEREST BEARING ACCOUNTS - localhost:3001/interest_bearing
router.post("/", async (req, res) => {
    const data = req.body;
    console.log(data);

    await interest_bearing.create({
        bankID: data.bankID,
        accountID: data.accountID,
        interest_rate: data.interest_rate,
        dtDeposit: data.dtDeposit
    });

    await db.sequelize.query(
        "INSERT INTO bank_account (bankID, accountID) VALUES (:bankID, :accountID)",
        {
            replacements: {bankID: data.bankID, accountID: data.accountID}
        }
    )
    res.json(data);

})

// DELETE A INTEREST BEARING ACCOUNT - localhost:3001/interest_bearing/:bankID
router.delete("/:bankID%:accountID", async (req, res) => {
    console.log(req.params);

    interest_bearing.destroy({
        where: {
            bankID: req.params.bankID, //this will be your id that you want to delete
            accountID: req.params.accountID // accountID to delete
        }
    }).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
        if(rowDeleted === 1){
            console.log('Deleted successfully');
        }
    });

    res.sendStatus(200)
})

module.exports = router
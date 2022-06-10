const express = require('express')
const router = express.Router()
const { market } = require("../models")
const { bank_account } = require("../models")
const { interest_bearing } = require("../models")
const db = require('../models')


// GET ALL MARKET - localhost:3001/market
router.get("/", async (req, res) => {
    const data = req.body;
    console.log(data);

    const [results, metadata] = await db.sequelize.query(
        "SELECT * FROM market"
    );

    res.send(results);
})

// GET SINGLE MARKET - localhost:3001/:bankID%:accountID
router.get("/:bankID%:accountID", async (req, res) => {
    console.log(req.params);

    const [results, metadata] = await db.sequelize.query(
        "SELECT * FROM market WHERE bankID = :bankID and accountID = :accountID",
        {
            replacements: {bankID: req.params.bankID, accountID: req.params.accountID}
        }
    );

    res.send(results);
})

// CREATE A market - localhost:3001/market
router.post("/", async (req, res) => {
    const data = req.body;
    console.log(data);

    try {
        await bank_account.create(data);

        await interest_bearing.create(data);
    
        await market.create({
            bankID: data.bankID,
            accountID: data.accountID,
            maxWithdrawals: data.maxWithdrawals,
            numWithdrawals: 0
        });
    } catch (err) {
        return res.status(500).json(err)
    }

    

    res.json(data);
})

// DELETE A MARKET - localhost:3001/market/:bankID%:accountID
router.delete("/:bankID%:accountID", async (req, res) => {
    console.log(req.params);

    market.destroy({
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
const express = require('express')
const router = express.Router()
const { bank_account } = require("../models")
const db = require('../models')


// GET ALL BANK ACCOUNTS - localhost:3001/bank_account
router.get("/", async (req, res) => {
    const data = req.body;
    console.log(data);

    const [results, metadata] = await db.sequelize.query(
        "SELECT * FROM bank_account"
    );
    res.send(results);
})

// GET ALL BANK ACCOUNTS STATS - localhost:3001/bank_account/stats
router.get("/stats", async (req, res) => {
    const data = req.body;
    console.log(data);

    const [results, metadata] = await db.sequelize.query(
        "SELECT * FROM display_account_stats"
    );

    res.send(results);
})


// GET SINGLE BANK ACCOUNT - localhost:3001/bank_account/:bankID%:accountID
router.get("/:bankID%:accountID", async (req, res) => {
    console.log(req.params);
    const [results, metadata] = await db.sequelize.query(
        "SELECT * FROM bank_account WHERE bankID = :bankID and accountID = :accountID",
        {
            replacements: {bankID: req.params.bankID, accountID: req.params.accountID}
        }

    );

    res.send(results[0]);
})

// GET ALL ACCOUNTS FROM ONE BANK- localhost:3001/bank_account/:bankID
router.get("/:bankID", async (req, res) => {
    console.log(req.params);
    const [results, metadata] = await db.sequelize.query(
        "SELECT * FROM bank_account WHERE bankID = :bankID",
        {
            replacements: {bankID: req.params.bankID}
        }

    );
    res.send(results);
})

// CREATE A BANK ACCOUNT - localhost:3001/bank_account
router.post("/", async (req, res) => {
    const data = req.body;
    console.log(data);

    await bank_account.create(data);

    res.json(data);

})

// DELETE A BANK ACCOUNT - localhost:3001/bank_account/:bankID%:accountID
router.delete("/:bankID%:accountID", async (req, res) => {
    console.log(req.params);

    try {
        bank_account.destroy({
            where: {
                bankID: req.params.bankID, //this will be your id that you want to delete
                accountID: req.params.accountID
            }
        }).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
            if(rowDeleted === 1){
                console.log('Deleted successfully');
            }
        });
    } catch (err){
        return res.status(500).json(err);
    }
    res.sendStatus(200);
})

// DEPOSIT TO A BANK ACCOUNT - localhost:3001/bank_account/deposit
router.post("/deposit", async (req, res) => {
    const data = req.body;
    console.log(data);

    await db.sequelize.query(
        "CALL account_deposit(:perID, :amount, :bankID, :accountID, :dt_action)",
        {
            replacements: {perID: req.body.perID, amount: req.body.amount, bankID: req.body.bankID, accountID: req.body.accountID, dt_action: req.body.dt_action}
        }

    );

    res.json(data);

})

// WITHDRAWAL FROM A BANK ACCOUNT - localhost:3001/bank_account/withdrawal
router.post("/withdrawal", async (req, res) => {
    const data = req.body;
    console.log(data);

    await db.sequelize.query(
        "CALL account_withdrawal(:perID, :amount, :bankID, :accountID, :dt_action)",
        {
            replacements: {perID: req.body.perID, amount: req.body.amount, bankID: req.body.bankID, accountID: req.body.accountID, dt_action: req.body.dt_action}
        }

    );

    res.json(data);

})

module.exports = router
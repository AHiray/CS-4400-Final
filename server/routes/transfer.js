const express = require('express')
const router = express.Router()
const { transfer } = require("../models")
const db = require('../models')

//TRANSFER MONEY BETWEEN TWO BANK ACCOUNTS - localhost:3001/transfer/:perID%:bankIDFrom%:accountIDFrom%:bankIDTo%:accountIDTO%:amount
router.post("/", async (req, res) => {
    console.log(req.body);

    try {
        const results = await db.sequelize.query(
            "CALL account_transfer(:perID, :amount, :bankIDFrom, :accountIDFrom, :bankIDTo, :accountIDTo, curdate())",
            {
                replacements: {perID: req.body.perID, bankIDFrom: req.body.bankIDFrom, bankIDTo: req.body.bankIDTo, accountIDFrom: req.body.accountIDFrom, accountIDTo: req.body.accountIDTo, amount: req.body.amount}
            }

        );
        res.send(results);
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }

})

module.exports = router
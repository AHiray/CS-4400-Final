const express = require('express')
const router = express.Router()
const { savings, access, bank_account, interest_bearing } = require("../models")
const db = require('../models')
const { route } = require('./access')


// GET ALL SAVINGS ACCOUNTS - localhost:3001/savings
router.get("/", async (req, res) => {
    const data = req.body;
    console.log(data);

    const [results, metadata] = await db.sequelize.query(
        "SELECT * FROM savings"
    );

    res.send(results);
})

// get all savings accounts a user has access to - localhost:3001/savings/:perID
router.get("/:perID", async (req, res) => {
    const results = [];

    const accs = await access.findAll({
        where: {
            perID: req.params.perID
        }
    });

    for (let i = 0; i < accs.length; i++) {
        console.log(accs[i].dataValues);
        if (await savings.findOne({
            where: {
                bankID: accs[i].dataValues.bankID,
                accountID: accs[i].dataValues.accountID
            }
        })) {
            results.push(accs[i].dataValues);
        }
    }

    res.send(results);
})

// GET SINGLE SAVINGS ACCOUNT - localhost:3001/savings/:bankID%:accountID
router.get("/:bankID%:accountID", async (req, res) => {
    console.log(req.params);
    const [results, metadata] = await db.sequelize.query(
        "SELECT * FROM savings WHERE bankID = :bankID and accountID = :accountID",
        {
            replacements: {bankID: req.params.bankID, accountID: req.params.accountID}
        }

    );

    res.send(results[0]);
})

// CREATE A SAVINGS ACCOUNT - localhost:3001/savings
router.post("/", async (req, res) => {
    const data = req.body;
    console.log(data);

    try {
        await bank_account.create(data);

        await interest_bearing.create({
            bankID: data.bankID,
            accountID: data.accountID,
            interest_rate: data.interest_rate
        });
    
        await savings.create({
            bankID: data.bankID,
            accountID: data.accountID,
            minBalance: data.minBalance
        });
    } catch (err) {
        return res.status(500).json(err)
    }
    
    res.json(data);

})

// DELETE A SAVINGS ACCOUNT - localhost:3001/savings/:bankID%:accountID
router.delete("/:bankID%:accountID", async (req, res) => {
    console.log(req.params);

    savings.destroy({
        where: {
            bankID: req.params.bankID, //this will be your id that you want to delete
            accountID: req.params.accountID
        }
    }).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
        if(rowDeleted === 1){
            console.log('Deleted successfully');
        }
    });

    res.sendStatus(200)
})

module.exports = router
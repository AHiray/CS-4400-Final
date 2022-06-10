const express = require('express')
const router = express.Router()
const { interest_bearing_fees } = require("../models")
const db = require('../models')


// GET ALL INTEREST BEARING FEES - localhost:3001/interest_bearing_fees
router.get("/", async (req, res) => {
    const data = req.body;
    console.log(data);

    const [results, metadata] = await db.sequelize.query(
        "SELECT * FROM interest_bearing_fees"
    );

    res.send(results);
})

// GET SINGLE INTEREST BEARING FEES - localhost:3001/:bankID%:accountID
router.get("/:bankID%:accountID", async (req, res) => {
    console.log(req.params);

    const [results, metadata] = await db.sequelize.query(
        "SELECT * FROM interest_bearing_fees WHERE bankID = :bankID and accountID = :accountID",
        {
            replacements: {bankID: req.params.bankID, accountID: req.params.accountID}
        }
    );

    res.send(results);
})

// CREATE A INTEREST BEARING FEE - localhost:3001/interest_bearing_fees
router.post("/", async (req, res) => {
    const data = req.body;
    console.log(data);
    if (await interest_bearing_fees.findOne({where: {bankID: data.bankID, accountID: data.accountID, fee: data.fee}}) != null) {
        return res.status(500).json("Already Exist.")
    }

    try {
        await interest_bearing_fees.create({
            bankID: data.bankID,
            accountID: data.accountID,
            fee: data.fee
        });
    } catch (err){
        return res.status(500).json(err);
    }
    
    return res.sendStatus(200);
})

// DELETE A INTEREST BEARING FEE - localhost:3001/interest_bearing_fees/:bankID%:accountID
router.delete("/:bankID%:accountID", async (req, res) => {
    console.log(req.params);

    interest_bearing_fees.destroy({
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
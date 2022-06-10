const express = require('express')
const router = express.Router()
const {customer, bank, access, workFor, employee} = require("../models")
const db = require('../models')


// GET ALL FROM workFor - localhost:3001/workFor
router.get("/", async (req, res) => {
    const data = req.body;
    console.log(data);

    const [results, metadata] = await db.sequelize.query(
        "SELECT * FROM workFor"
    );

    res.send(results);
})

// GET SINGLE workFor - localhost:3001/:bankID%:perID
router.get("/:bankID%:perID", async (req, res) => {
    console.log(req.params);

    const [results, metadata] = await db.sequelize.query(
        "SELECT * FROM workFor WHERE bankID = :bankID and perID = :perID",
        {
            replacements: {bankID: req.params.bankID, perID: req.params.perID}
        }
    );

    res.send(results);
})

// CREATE A workFor - localhost:3001/workFor
router.post("/", async (req, res) => {
    const data = req.body;
    console.log(data);
    console.log(data.bankID + "-" + data.perID);
    if (await employee.findByPk(data.perID) == null) {
        return res.status(500).json("Not An Employee")
    }
    
    if (await bank.findOne({where: {manager: data.perID}}) !== null){
        return res.status(500).json("Manager can not have a second job");
    }

    if (await workFor.findOne({ where: {bankID: data.bankID, perID: data.perID}}) == null) {
        workFor.create({
            bankID: data.bankID,
            perID: data.perID,
        });
        return res.status(200).json("Hired")
    } else {
        return res.status(500).json("Employee already works at that bank.");
    }

})

// DELETE A workFor - localhost:3001/workFor/:bankID%:perID
router.delete("/:bankID%:accountID", async (req, res) => {
    console.log(req.params);
    workFor.destroy({
        where: {
            bankID: req.params.bankID, //this will be your id that you want to delete
            perID: req.params.perID // accountID to delete
        }
    }).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
        if(rowDeleted === 1){
            console.log('Deleted successfully');
        }
    });
    res.sendStatus(200)
})

module.exports = router
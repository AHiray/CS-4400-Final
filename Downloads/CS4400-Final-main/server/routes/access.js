const express = require('express')
const router = express.Router()
const { access } = require("../models")
const db = require('../models')


// GET ALL FROM ACCESS - localhost:3001/access
router.get("/", async (req, res) => {
    const data = req.body;
    console.log(data);

    const [results, metadata] = await db.sequelize.query(
        "SELECT * FROM access"
    );

    res.send(results);
})

// GET ALL FOR PERID - localhost:3001/access/:perID
router.get("/:perID", async (req, res) => {
    console.log(req.params);

    const [results, metadata] = await db.sequelize.query(
        "SELECT * FROM access where perID = :perID",
        {
            replacements: {perID: req.params.perID}
        }
    )

    res.send(results);

})

// GET SINGLE access - localhost:3001/:perID%:bankID%:accountID
router.get("/:perID%:bankID%:accountID", async (req, res) => {
    console.log(req.params);

    const [results, metadata] = await db.sequelize.query(
        "SELECT * FROM access WHERE bankID = :bankID and perID = :perID and accountID = :accountID",
        {
            replacements: {bankID: req.params.bankID, perID: req.params.perID, accountID: req.params.accountID}
        }
    );

    res.send(results);
})

// GET All people with access to an account- localhost:3001/:bankID%:accountID
router.get("/with/:bankID%:accountID", async (req, res) => {
    console.log(req.params);

    const [results, metadata] = await db.sequelize.query(
        "SELECT perID FROM access WHERE bankID = :bankID and accountID = :accountID",
        {
            replacements: {bankID: req.params.bankID, accountID: req.params.accountID}
        }
    );

    res.send(results);
})

// GET All people without access to an account- localhost:3001/:bankID%:accountID
router.get("/without/:bankID%:accountID", async (req, res) => {
    console.log(req.params);

    const [results, metadata] = await db.sequelize.query(
        "SELECT * FROM CUSTOMER WHERE NOT perID IN (SELECT perID FROM access WHERE bankID = :bankID and accountID = :accountID)",
        {
            replacements: {bankID: req.params.bankID, accountID: req.params.accountID}
        }
    );

    res.send(results);
})

// CREATE A ACCESS - localhost:3001/access
router.post("/", async (req, res) => {
    const data = req.body;
    console.log(data);

    await access.create(data);

    res.json(data);
})

// DELETE A access - localhost:3001/
router.delete("/", async (req, res) => {
    console.log(req.body);

    access.destroy({
        where: {
            bankID: req.body.bankID, //this will be your id that you want to delete
            perID: req.body.perID, // perID to delete
            accountID: req.body.accountID // accountID to delete
        }
    }).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
        if(rowDeleted === 1){
            console.log('Deleted successfully');
        }
    });

    res.sendStatus(200)
})

module.exports = router
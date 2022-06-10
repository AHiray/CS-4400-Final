const express = require('express')
const router = express.Router()
const { bank_user } = require("../models")
const db = require('../models')


// GET ALL Bank USERS - localhost:3001/bank_user
router.get("/", async (req, res) => {
    const data = req.body;
    console.log(data);

    const [results, metadata] = await db.sequelize.query(
        "SELECT * FROM bank_user"
    );

    res.send(results);
})

// GET SINGLE BANK USER - localhost:3001/:perID
router.get("/:perID", async (req, res) => {
    console.log(req.params);

    const [results, metadata] = await db.sequelize.query(
        "SELECT * FROM bank_user WHERE perID = :perID",
        {
            replacements: {perID: req.params.perID}
        }
    );

    res.send(results[0]);
})

// CREATE A BANK USER - localhost:3001/bank_user
router.post("/", async (req, res) => {
    const data = req.body;
    console.log(data);

    await bank_user.create(data);

    res.json(data);

})

// DELETE A BANK USER - localhost:3001/bank_user/:perID
router.delete("/:perID", async (req, res) => {
    console.log(req.params);

    bank_user.destroy({
        where: {
            perID: req.params.perID //this will be your id that you want to delete
        }
    }).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
        if(rowDeleted === 1){
            console.log('Deleted successfully');
        }
    });

    res.sendStatus(200)
})

module.exports = router
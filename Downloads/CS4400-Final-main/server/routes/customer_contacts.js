const express = require('express')
const router = express.Router()
const { customer_contacts } = require("../models")
const db = require('../models')


// GET ALL CUSTOMER CONTACTS - localhost:3001/customer_contacts
router.get("/", async (req, res) => {
    const data = req.body;
    console.log(data);

    const [results, metadata] = await db.sequelize.query(
        "SELECT * FROM customer_contacts"
    );

    res.send(results);
})

// GET CUSTOMER CONTACTS - localhost:3001/:perID
router.get("/:perID", async (req, res) => {
    console.log(req.params);

    const [results, metadata] = await db.sequelize.query(
        "SELECT * FROM customer_contacts WHERE perID = :perID",
        {
            replacements: {perID: req.params.perID}
        }
    );

    res.send(results);
})

// CREATE A CUSTOMER CONTACTS - localhost:3001/customer_contacts
router.post("/", async (req, res) => {
    const data = req.body;
    console.log(data);

    await customer_contacts.create(data);

    res.json(data);

})

// DELETE A CUSTOMER CONTACTS - localhost:3001/customer_contacts/:perID
router.delete("/:perID", async (req, res) => {
    console.log(req.params);

    customer_contacts.destroy({
        where: {
            corpID: req.params.perID //this will be your id that you want to delete
        }
    }).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
        if(rowDeleted === 1){
            console.log('Deleted successfully');
        }
    });

    res.sendStatus(200)
})

module.exports = router
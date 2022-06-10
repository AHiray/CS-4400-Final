const express = require('express')
const router = express.Router()
const { system_admin } = require("../models")
const db = require('../models')


// GET ALL SYSTEM ADMINS - localhost:3001/system_admin
router.get("/", async (req, res) => {
    const data = req.body;
    console.log(data);

    const [results, metadata] = await db.sequelize.query(
        "SELECT * FROM system_admin"
    );

    res.send(results);
})

// GET SINGLE SYSTEM ADMIND - localhost:3001/:perID
router.get("/:perID", async (req, res) => {
    console.log(req.params);

    const [results, metadata] = await db.sequelize.query(
        "SELECT * FROM system_admin WHERE perID = :perID",
        {
            replacements: {perID: req.params.perID}
        }
    );

    res.send(results);
})

// CREATE A SYSTEM ADMIN - localhost:3001/system_admin
router.post("/", async (req, res) => {
    const data = req.body;
    console.log(data);

    await system_admin.create(data);

    res.json(data);

})

// DELETE A SYSTEM ADMIN - localhost:3001/system_admin/:perID
router.delete("/:corpID", async (req, res) => {
    console.log(req.params);

    system_admin.destroy({
        where: {
            corpID: req.params.corpID //this will be your id that you want to delete
        }
    }).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
        if(rowDeleted === 1){
            console.log('Deleted successfully');
        }
    });

    res.sendStatus(200)
})

module.exports = router
const express = require('express')
const router = express.Router()
const { person } = require("../models")
const db = require('../models')

// GET ALL PERSONS
router.get("/", async (req, res) => {
    const data = req.body;
    console.log(data);

    const [results, metadata] = await db.sequelize.query(
        "SELECT * FROM person"
    );

    res.send(results);
})

// GET SINGLE PERSON with :perID
router.get("/:perID", async (req, res) => {
    console.log(req.params);

    const [results, metadata] = await db.sequelize.query(
        "SELECT * FROM person WHERE perID = :perID",
        {
            replacements: {perID: req.params.perID}
        }
    );

    res.send(results);
})

// CREATE A PERSON
router.post("/", async (req, res) => {
    const data = req.body;
    console.log(data);

    await person.create(data);

    res.json(data);

})

// CREATE A PERSON
router.post("/login", async (req, res) => {
    const data = req.body;
    console.log(data);

    const pers = await person.findOne({where: {perID: data.perID}});

    if(!pers) {
        res.status(400).json({error: "User ID Doesn't Exist"});
    }

   if(data.pwd != pers.pwd) {
        res.status(400).json({error: "Incorrect Password"})
    } else {

        const userTypes = [];

        //---------------CHECK IF ADMIN-------------
        const [adminResults, adminMetadata] = await db.sequelize.query(
            "SELECT count(*) as count FROM system_admin WHERE perID = :perID",
            {
                replacements: {perID: pers.perID}
            }
        );
        console.log(adminResults);

        if(adminResults[0].count >= 1) {
            userTypes.push("admin")
        }

        //---------------CHECK IF MANAGER-------------
        const [bankResults, bankMetadata] = await db.sequelize.query(
            "SELECT count(*) as count FROM Bank WHERE manager = :perID",
            {
                replacements: {perID: pers.perID}
            }
        );
        console.log(bankResults);

        if(bankResults[0].count >= 1) {
            userTypes.push("manager")
        }

        //---------------CHECK IF EMPLOYEE-------------
        const [employeeResults, employeeMetadata] = await db.sequelize.query(
            "SELECT count(*) as count FROM employee WHERE perID = :perID",
            {
                replacements: {perID: pers.perID}
            }
        );
        console.log(employeeResults);


        if(employeeResults[0].count >= 1) {
            userTypes.push("employee")
        }

        //---------------CHECK IF CUSTOMER-------------
        const [customerResults, customerMetadata] = await db.sequelize.query(
            "SELECT count(*) as count FROM customer WHERE perID = :perID",
            {
                replacements: {perID: pers.perID}
            }
        );
        console.log(customerResults);

        
        if(customerResults[0].count >= 1) {
            userTypes.push("customer")
        }


        res.status(200).json({perID: pers.perID, userTypes: userTypes});
    }

})



// DELETE A PERSON with :perID
router.delete("/:perID", async (req, res) => {
    console.log(req.params);

    person.destroy({
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
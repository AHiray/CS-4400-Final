const express = require('express')
const router = express.Router()
const { employee, person, system_admin, workFor, customer, bank, bank_user} = require("../models")
const db = require('../models')


// GET ALL EMPLOYEES
router.get("/", async (req, res) => {
    const data = req.body;
    console.log(data);

    const [results, metadata] = await db.sequelize.query(
        "SELECT * FROM employee"
    );

    res.send(results);
})

// GET ALL AVAILABLE MANAGERS
router.get("/valid-managers", async (req, res) => {
    const data = req.body;
    console.log(data);
    const [results, metadata] = await db.sequelize.query(
        "SELECT * FROM employee WHERE NOT EXISTS (SElECT perID FROM workFor WHERE employee.perID = workFor.perID) AND NOT EXISTS (SELECT manager FROM bank WHERE employee.perID = bank.manager)"
    );

    res.send(results);

})

// REPLACE A MANAGER
router.post("/replace-manager", async (req, res) => {
    const data = req.body;
    console.log(data);

    try {
        await db.sequelize.query(
            "CALL replace_manager(:perID, :bankID, :salary)", 
            {
                replacements: {perID: req.body.employee, bankID: req.body.bankID, salary: req.body.salary}
            }
        );    
    } catch (err) {
        return res.status(500).json(err);
    } 
   return res.sendStatus(200);

})

// GET ALL VALID EMPLOYEES (I.E NOT INCLUDING MANAGERS)
router.get("/valid-employees", async (req, res) => {
    const data = req.body;
    console.log(data);

    
    const [results, metadata] = await db.sequelize.query(
        "SELECT * FROM employee WHERE NOT EXISTS (SELECT manager FROM bank WHERE employee.perID = bank.manager)"
    );

    res.send(results);

})

// GET EMPLOYEE STATS
router.get("/stats", async (req, res) => {
    console.log(req.body.perID);

    const [results, metadata] = await db.sequelize.query(
        "SELECT * FROM display_employee_stats"
    );

    res.send(results);
})


// Pay Employees
router.post("/pay-all", async (req, res) => {
    console.log(req.body.perID);

    try {
        const [results, metadata] = await db.sequelize.query(
            "call pay_employees();"
        ).then(response => {
            console.log(response);
            res.send(response);
        }).catch((err) => {
            console.log(err);

            res.status(500).json(err);
        });

    } catch (err) {
        console.log(err.message);
        res.status(500).json(err.message);
    }
    
})

// GET SINGLE EMPLOYEE with :perID
router.get("/:perID", async (req, res) => {
    console.log(req.params);

    const [results, metadata] = await db.sequelize.query(
        "SELECT * FROM employee WHERE perID = :perID",
        {
            replacements: {perID: req.params.perID}
        }
    );
    res.send(results);
})

// CREATE A EMPLOYEE
router.post("/", async (req, res) => {
    const data = req.body;
    if (await person.findByPk(data.perID) != null) {
        if (await employee.findByPk(data.perID) != null || await system_admin.findByPk(data.perID) != null  ) {
            console.log("we got here");
            return res.status(500).json("Already Admin/Employee");
        } else {
            await employee.create({
                perID: data.perID,
                salary: data.salary,
                payments: data.payments,
                earned: data.earned
            }).then((data) => {
                res.json(data)
            }).catch((err) => {
                return res.status(500).json("Invalid Input Data");
            });
            return res.status(200).json("Employee Created")
        }
    } else {
        return res.status(500).json("Person Not Found- All Employees Must First Create an Account.");
    }
})

async function getBankID(pID) {
    try {
        const {bankID, perID} = await workFor.findOne({
            raw: true,
            attributes: {
                include: workFor.bankID
            },
            where: {
                perID : pID
            }
        })
        return bankID
    } catch (err) {
        return null
    }

}

async function getEmployees(bnkID) {
    const {count, row} = await workFor.findAndCountAll({
        where: {
            bankID: bnkID,
        }
    });
    return count;
}
// DELETE A EMPLOYEE with :perID
router.delete("/", async (req, res) => {
    console.log(req.body.perID);
    const data = req.body;

    if (await employee.findByPk(data.perID) != null) {
        if (await bank.findOne({where: {manager: data.perID}}) == null) {
            if (await getEmployees(await getBankID(data.perID)) > 1) {
                workFor.destroy({
                    where: {
                        perID: data.perID //this will be your id that you want to delete
                    }
                }).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
                    if(rowDeleted === 1){
                        console.log('Deleted successfully');
                    }
                });
                employee.destroy({
                    where: {
                        perID: data.perID //this will be your id that you want to delete
                    }
                }).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
                    if(rowDeleted === 1){
                        console.log('Employee Deleted successfully');
                    }
                });

                if (await customer.findByPk(data.perID) == null) {
                    bank_user.destroy({
                        where: {
                            perID: data.perID //this will be your id that you want to delete
                        }
                    }).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
                        if(rowDeleted === 1){
                            console.log('Bank User Deleted successfully');
                        }
                    });
                    person.destroy({
                        where: {
                            perID: data.perID //this will be your id that you want to delete
                        }
                    }).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
                        if(rowDeleted === 1){
                            console.log('Person Deleted successfully');
                        }
                    });
                    return res.status(200).json("Done");
                } else {
                    return res.status(200).json("Done");;
                }
            } else {
                return res.status(500).json("This is the only employee working for the bank.")
            }
        } else {
            return res.status(500).json("Employee is Manager of Bank");
        }
    } else {
        return res.status(500).json("Not An Employee");
    }
})


module.exports = router
const express = require('express')
const router = express.Router()
const {customer, system_admin, person, access, customer_contacts, bank_user, employee} = require("../models")
const db = require('../models')


// GET ALL CUSTOMERS - localhost:3001/customer
router.get("/", async (req, res) => {
    const data = req.body;
    console.log(data);

    const [results, metadata] = await db.sequelize.query(
        "SELECT * FROM customer"
    );

    res.send(results);
})

// GET ALL CUSTOMER STATS - localhost:3001/customer/stats
router.get("/stats", async (req, res) => {
    const data = req.body;
    console.log(data);

    const [results, metadata] = await db.sequelize.query(
        "SELECT * FROM display_customer_stats"
    );

    res.send(results);
})

// GET SINGLE CUSTOMERS - localhost:3001/:perID
router.get("/:perID", async (req, res) => {
    console.log(req.params);

    const [results, metadata] = await db.sequelize.query(
        "SELECT * FROM customer WHERE perID = :perID",
        {
            replacements: {perID: req.params.perID}
        }
    );

    res.send(results);
})

// CREATE A CUSTOMERS - localhost:3001/customer
router.post("/", async (req, res) => {
    const data = req.body;
    if (await person.findByPk(data.perID) != null) {
        if (await system_admin.findByPk(data.perID) == null) {
            if (await customer.findByPk(data.perID) == null) {
                await customer.create(data).then((data) => {
                    res.json(data)
                }).catch((err) => {
                    return res.status(500).json("Invalid Input Data");
                });
            } else {
                return res.status(500).json("Customer Already Exists");
            }

        } else {
            return res.status(500).json("Administrators can not be customers. ")
        }
    } else {
        return res.status(500).json("Person Not Found- All Customers Must First Create an Account.");
    }

})

// DELETE A CUSTOMER - localhost:3001/customer/:perID
router.delete("/", async (req, res) => {
    // console.log(req.body);
    const data = req.body;
    if (await customer.findByPk(data.perID) != null) {
        const account_ids = await access.findAll({
            attributes: ["accountID", "bankID"],
            where: {
                perID: data.perID
            }
        });
        if (account_ids.length == 0) {

            if(await employee.findByPk(data.perID) == null) {
                await customer.destroy({
                    where: {
                        perID : data.perID
                    }
                }).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
                    if(rowDeleted >= 1){
                        console.log('Customer Deleted Successfully');
                    }
                });
                await person.destroy({
                    where: {
                        perID : data.perID
                    }
                }).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
                    if(rowDeleted >= 1){
                        console.log('Person Deleted Successfully');
                    }
                });

                res.status(200).json("Customer and Person Data deleted")
            } else {
                await customer.destroy({
                    where: {
                        perID : data.perID
                    }
                }).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
                    if(rowDeleted >= 1){
                        console.log('Customer Deleted Successfully');
                    }
                });
                res.status(200).json("Customer Data Deleted")
            }
            
            return
        }
         async function findNumber(id) {
             try {
                 console.log(id);
                 const {count, row} = await access.findAndCountAll({
                     raw: true,
                     where: {
                         accountID: id["accountID"],
                         bankID: id["bankID"]
                     }
                 });
                 console.log(count);
                 if (count > 1) {
                     await access.destroy({
                         where: {
                             accountID: id["accountID"],
                             bankID: id["bankID"]
                         }
                     }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
                         if (rowDeleted >= 1) {
                             console.log("Access deleted from " + id["accountID"] + " In Bank " + id["bankID"]);
                         }
                     });

                 } else {
                     return res.status(500).json("Only Holder Of The Account " + id["accountID"] + " In Bank " + id["bankID"]);
                 }
                 if (await access.findOne({where :{perID: data.perID}}) == null && await employee.findByPk(data.perID) == null) {
                     console.log("Only Customer for One Acc");
                     customer_contacts.destroy({
                         where: {
                             perID : data.perID
                         }
                     }).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
                         if(rowDeleted >= 1){
                             console.log('Customer Contacts Deleted Successfully');
                         }
                     });
                     await customer.destroy({
                         where: {
                             perID : data.perID
                         }
                     }).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
                         if(rowDeleted >= 1){
                             console.log('Customer Deleted Successfully');
                         }
                     });
                     await bank_user.destroy({
                         where: {
                             perID : data.perID
                         }
                     }).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
                         if(rowDeleted >= 1){
                             console.log('Bank User Deleted Successfully');
                         }
                     });
                     await person.destroy({
                         where: {
                             perID : data.perID
                         }
                     }).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
                         if(rowDeleted >= 1){
                             console.log('Person Deleted Successfully');
                         }
                     });
                     return res.status(200).json("Accounts Updated");
                 }
             } catch (e) {
                 console.log(e.toString());
             }
         }
        account_ids.forEach(findNumber);
    } else {
        return res.status(500).json("Not A Customer");
    }
})

module.exports = router
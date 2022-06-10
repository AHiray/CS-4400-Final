const express = require('express')
const router = express.Router()
const { checking, access, bank_account } = require("../models")
const db = require('../models')


// GET ALL CHECKING ACCOUNTS - localhost:3001/checking
router.get("/", async (req, res) => {
    const data = req.body;
    console.log(data);

    const [results, metadata] = await db.sequelize.query(
        "SELECT * FROM checking"
    );

    res.send(results);
})

// get all checking accounts a user has access to - localhost:3001/checking/:perID
router.get("/:perID", async (req, res) => {
    const results = [];

    const accs = await access.findAll({
        where: {
            perID: req.params.perID
        }
    });

    for (let i = 0; i < accs.length; i++) {
        console.log(accs[i].dataValues);
        if (await checking.findOne({
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

// GET SINGLE CHECKING ACCOUNT - localhost:3001/checking/:bankID%:accountID
router.get("/:bankID%:accountID", async (req, res) => {
    console.log(req.params);
    const [results, metadata] = await db.sequelize.query(
        "SELECT * FROM checking WHERE bankID = :bankID and accountID = :accountID",
        {
            replacements: {bankID: req.params.bankID, accountID: req.params.accountID}
        }

    );

    res.send(results[0]);
})

// GET A CHECKING ACCOUNT'S OVERDRAFT - localhost:3001/checking/overdraft
router.get("/overdraft/:bankID%:accountID", async (req, res) => {
    console.log(req.params);
    const [results, metadata] = await db.sequelize.query(
        "SELECT protectionBank, protectionAccount FROM checking where bankID = :bankID and accountID = :accountID",
        {
            replacements: {bankID: req.params.bankID, accountID: req.params.accountID}
        }

    );
    console.log("Overdraft info: ", results);
    res.send(results);
})

// CREATE A CHECKING ACCOUNT - localhost:3001/checking
router.post("/", async (req, res) => {
    const data = req.body;
    console.log(data);

    try {
        await bank_account.create(data);

        await checking.create(data);
    } catch (err) {
        return res.status(500).json(err);
    }
    

    res.json(data);

})

// DELETE A CHECKING ACCOUNT - localhost:3001/checking/:bankID%:accountID
router.delete("/:bankID%:accountID", async (req, res) => {
    console.log(req.params);

    checking.destroy({
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

// start overdraft
router.post("/start-overdraft", async (req, res) => {
    const data = req.body;
    console.log(data);
 

    if (data.isAdmin === 0) {

        let isCheckingOwner
        await db.sequelize.query(
            "SELECT count(*) as count FROM access WHERE perID = :perID AND bankID = :bankID AND accountID = :accountID",
            {
                replacements: { perID: req.body.requester, bankID: req.body.checkingBankID, accountID: req.body.checkingAccountID }
            }
        ).then((data) => {
            console.log(data)
            isCheckingOwner = data[0][0].count;
        })

        let isSavingsOwner
        await db.sequelize.query(
            "SELECT count(*) as count FROM access WHERE perID = :perID AND bankID = :bankID AND accountID = :accountID",
            {
                replacements: { perID: req.body.requester, bankID: req.body.savingsBankID, accountID: req.body.savingsAccountID }
            }
        ).then((data) => {
            console.log(data)
            isSavingsOwner = data[0][0].count;
        })

        if(isCheckingOwner !== 1 && isSavingsOwner !== 1) {
            return res.status(500).json({message: "User does not have access to both accounts"})
        }


        await db.sequelize.query(
            "CALL start_overdraft(:perID, :bankID, :accountID, :bankID2, :accountID2)",
            {
                replacements: {perID: req.body.requester, bankID: req.body.checkingBankID, accountID: req.body.checkingAccountID,
                                bankID2: req.body.savingsBankID, accountID2: req.body.savingsAccountID}
            }
        ).then((data) => {
            res.sendStatus(200);
        }).catch((err) => {
            res.status(500).json(err);
        })

    } else {
        let checkingOwners = [];
        await db.sequelize.query(
            "SELECT perID FROM access WHERE bankID = :bankID AND accountID = :accountID",
            {
                replacements: { bankID: req.body.checkingBankID, accountID: req.body.checkingAccountID }
            }
        ).then((data) => {
            console.log("checking owners", data)
    
            data.forEach(element => {
            
                element.forEach(e=> {
                    console.log("Checking Owner: ", e.perID)
                    checkingOwners.push(e.perID)
                })
            });
        })

        let savingsOwners = [];
        await db.sequelize.query(
            "SELECT perID FROM access WHERE bankID = :bankID AND accountID = :accountID",
            {
                replacements: { bankID: req.body.savingsBankID, accountID: req.body.savingsAccountID }
            }
        ).then((data) => {
            data.forEach(element => {
            
                element.forEach(e=> {
                    console.log("Savings Owner: ", e.perID)
                    savingsOwners.push(e.perID)
                })
            });
        })

        console.log("Savings Owners LIST:", savingsOwners)
        console.log("Checking Owners LIST:", checkingOwners)
        const found = savingsOwners.some(r=> checkingOwners.includes(r))
        console.log(found)
        if (!found) {
            return res.status(500).json({message: "Checking Account owners do not have access to Savings Account"})

        }
        
        await checking.update(
            {
                protectionBank: req.body.savingsBankID,
                protectionAccount: req.body.savingsAccountID
            },
            {
                where: {
                    bankID: req.body.checkingBankID, 
                    accountID: req.body.checkingAccountID
                }
            }
        ).then((data) => {
            res.sendStatus(200);
        }).catch((err) => {
            res.status(500).json(err)
        })
    }
})

// stop overdraft
router.post("/stop-overdraft", async (req, res) => {
    const data = req.body;
    console.log(data);

    if (data.isAdmin === 0) {
        await db.sequelize.query(
            "CALL stop_overdraft(:perID, :bankID, :accountID)",
            {
                replacements: {perID: req.body.requester, bankID: req.body.checkingBankID, accountID: req.body.checkingAccountID}
            }
        ).then((data) => {
            res.sendStatus(200);
        }).catch((err) => {
            res.sendStatus(500).json(err);
        })
    } else {
        await checking.update(
            {
                protectionBank: null,
                protectionAccount: null
            },
            {
                where: {
                    bankID: req.body.checkingBankID,
                    accountID: req.body.checkingAccountID
                }
            }
        ).then((data) => {
            res.sendStatus(200);
        }).catch((err) => {
            res.sendStatus(500).err;
        })
    }
})

module.exports = router
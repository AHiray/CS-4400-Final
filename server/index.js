const express = require('express')
const app = express()
const cors = require("cors")

app.use(express.json())
app.use(cors())

const db = require('./models')

const corpRouter = require('./routes/corporation')
app.use("/corporation", corpRouter)

const customer_contactsRouter = require('./routes/customer_contacts')
app.use("/customer_contacts", customer_contactsRouter)

const customerRouter = require('./routes/customer')
app.use("/customer", customerRouter)

const employeeRouter = require('./routes/employee')
app.use("/employee", employeeRouter)

const bankRouter = require('./routes/bank')
app.use("/bank", bankRouter)

const interest_bearingRouter = require('./routes/interest_bearing')
app.use("/interest_bearing", interest_bearingRouter)

const interest_bearing_feesRouter = require('./routes/interest_bearing_fees')
app.use("/interest_bearing_fees", interest_bearing_feesRouter)

const savingsRouter = require('./routes/savings')
app.use("/savings", savingsRouter)

const marketRouter = require('./routes/market')
app.use("/market", marketRouter)

const checkingRouter = require('./routes/checking')
app.use("/checking", checkingRouter)

const workForRouter = require('./routes/workFor')
app.use("/workFor", workForRouter)

const accessRouter = require('./routes/access')
app.use("/access", accessRouter)

const personRouter = require('./routes/person')
app.use("/person", personRouter)

const bankAccountRouter = require('./routes/bank_account')
app.use("/bank_account", bankAccountRouter)

const transferRouter = require('./routes/transfer')
app.use("/transfer", transferRouter)

const adminRouter = require('./routes/system_admin')
app.use("/system_admin", adminRouter)

db.sequelize.sync().then(() => {
    app.listen(3001, () => {
        console.log("Server running on port: 3001")
    })    
})



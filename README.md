# CS4400-Phase-4

Final Project For CS-4400 (Introduction to Database Management) <br> 

**Project Description** <br> 
You are being asked to design and develop a system to manage bank accounts and assets.  This system will 
support a banking oversight effort to track banks, their employees and customers, and the assets contained in 
the various accounts. Employees will work at the banks to provide services to customers, and customers will open 
various types of accounts to manage their assets.  The main operations of the system will include customers 
depositing into, transferring between, and withdrawing from their various accounts, and keeping track of the 
asset balances at various levels (e.g., bank, customer, account, etc.). 

<img src="cs4400_enhanced_ERD_v1.pdf" alt="Bank ERD Diagram" title="Bank ERD Diagram">
This project uses React.js, Node.js, Express, and Sequelize to communicate with the stored sql database. **My main focus was on working with the sql database for queries and updates.**

Start Server first time:

```
cd server
npm install
npm start
```

If it says "UnhandledPromiseRejectionWarning: SequelizeAccessDeniedError: Access denied for user 'root'@'localhost' (using password: NO)"

Go to file "/server/config/config.json" and replace null passwords with your mysql user password

``` 
{
  "development": {
    "username": "root",
    "password": null,
    "database": "bank_management",
    "host": "localhost",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "bank_management",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "bank_management",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}

```

Start Client: On a seperate terminal tab

```
cd client
npm install
npm start
```



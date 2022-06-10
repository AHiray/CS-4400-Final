import React, { useState, useEffect, useRef } from 'react'
import axios from "axios";
import { Card } from 'react-bootstrap';
import { toast } from 'react-toastify';

function DepositWithdrawScreen (){ 
    const [bankOptions, setBankOptions] = useState([])
    const [accessOptions, setAccessOptions] = useState([]);

    const perID = useRef(sessionStorage.getItem("perID"));

    const [depositBankID, setDepositBankID] = useState("");
    const [depositAccountID, setDepositAccountID] = useState("");
    const [depositAmount, setDepositAmount] = useState("")

    const [withdrawBankID, setWithdrawBankID] = useState("");
    const [withdrawAccountID, setWithdrawAccountID] = useState("");
    const [withdrawAmount, setWithdrawAmount] = useState("")


    let handleDeposit = async (e) => { 
        e.preventDefault();
        //check that deposit is number, bank and account exist
        let inputError = false
        if (depositBankID === "") {
            toast.error("Please select a bank.");
            inputError = true;
        }
        if (depositAccountID === "") {
            toast.error("Please select a account.");
            inputError = true;
        }
        if (depositAmount === "" || isNaN(depositAmount)) {
            toast.error("Deposit Amount must be a number.");
            inputError = true;
        }
        if (inputError) {
            return
        }
        //query
        var today = new Date().toISOString().slice(0, 10);
        await axios.post("http://localhost:3001/bank_account/deposit", {
            perID: perID.current, 
            amount: depositAmount,
            bankID: depositBankID, 
            accountID: depositAccountID, 
            dt_action: today
        })
        .then((res) => {
            //Success
            console.log(res)
    
            if(res.status === 200) {
                toast.success("Deposit Successful!");
                //Reset the fields
                setDepositAccountID("");
                setDepositBankID("");
                setDepositAmount("");
                setWithdrawAccountID("");
                setWithdrawBankID("");
                setWithdrawAmount("");
                fetchAccessOptions();
            }    
            
        })
    }

    let handleWithdraw = async (e) => { 
        e.preventDefault();
        //check that withdrawal is number, bank and account exist
        let inputError = false
        if (withdrawBankID === "") {
            toast.error("Please select a bank.");
            inputError = true;
        }
        if (withdrawAccountID === "") {
            toast.error("Please select a account.");
            inputError = true;
        }
        if (withdrawAmount === "" || isNaN(withdrawAmount)) {
            toast.error("Withdraw Amount must be a number.");
            inputError = true;
        }
        if (inputError) {
            return
        }
        let totalBalance = 0
        //check that amount is available between account and its potential overdraft
        //query for checking overdraft bank and acct
        //if checking, query for overdraft acct balance
        //compare balance to withdrawal
        await axios.get("http://localhost:3001/checking/overdraft/" + withdrawBankID + "%" + withdrawAccountID)
        .then((res) => {
            //Success
            console.log(res)
            let overBankID = Array.from(new Set(res.data.map(a =>  a.protectionBank)))[0];
            let overAcctID = Array.from(new Set(res.data.map(a =>  a.protectionAccount)))[0];
            console.log("OverAcct:", overAcctID)
            console.log("OverBank:", overBankID)
            axios.get("http://localhost:3001/bank_account/" + withdrawBankID + "%" + withdrawAccountID)
            .then((res) => {
                //Success
                console.log("reg balance: ", res.data)
                totalBalance += res.data.balance;
                console.log("Normal acct", totalBalance)
                if (overBankID && overAcctID) { //it has an overdraft
                    //query for overdraft balance
                    axios.get("http://localhost:3001/bank_account/" + overBankID + "%" + overAcctID)
                    .then((res) => {
                        //Success
                        console.log("Overbalance: ", res)
                        let overdrafting = false
                        if (totalBalance < withdrawAmount) {
                            overdrafting = true
                        }
                        totalBalance += res.data.balance;
                        console.log("Overdraft and normal acct bal", totalBalance)
                        if (totalBalance >= withdrawAmount) {
                            console.log("Withdrawal possible")
                        } else {
                            console.log("Withdrawal not possible")
                            toast.error("Insufficient funds to make a withdrawal of that amount");
                            return
                        }
                        //withdraw query
                        var today = new Date().toISOString().slice(0, 10);
                        axios.post("http://localhost:3001/bank_account/withdrawal", {
                            perID: perID.current, 
                            amount: withdrawAmount,
                            bankID: withdrawBankID, 
                            accountID: withdrawAccountID, 
                            dt_action: today
                        })
                        .then((res) => {
                            //Success
                            console.log(res)
                            if(res.status === 200) {
                                if (overdrafting) {
                                    toast.success("Withdrawal Successful, but an overdraft was necessary.");
                                } else {
                                    toast.success("Withdrawal Successful!");
                                }
                                //Reset the fields
                                setDepositAccountID("");
                                setDepositBankID("");
                                setDepositAmount("");
                                setWithdrawAccountID("");
                                setWithdrawBankID("");
                                setWithdrawAmount("");
                                fetchAccessOptions();
                            }    
                            
                        })
                    })
                } else {
                    if (totalBalance >= withdrawAmount) {
                        console.log("Withdrawal possible")
                    } else {
                        console.log("Withdrawal not possible")
                        toast.error("Insufficient funds to make a withdrawal of that amount");
                        return
                    }
                    //withdraw query
                    if (totalBalance >= withdrawAmount) {
                    console.log("Withdrawal possible")
                } else {
                    console.log("Withdrawal not possible")
                    toast.error("Insufficient funds to make a withdrawal of that amount");
                    return
                }
                    var today = new Date().toISOString().slice(0, 10);
                    axios.post("http://localhost:3001/bank_account/withdrawal", {
                        perID: perID.current, 
                        amount: withdrawAmount,
                        bankID: withdrawBankID, 
                        accountID: withdrawAccountID, 
                        dt_action: today
                    })
                    .then((res) => {
                        //Success
                        console.log(res)
                        if(res.status === 200) {
                            toast.success("Withdrawal Successful!");
                            //Reset the fields
                            setDepositAccountID("");
                            setDepositBankID("");
                            setDepositAmount("");
                            setWithdrawAccountID("");
                            setWithdrawBankID("");
                            setWithdrawAmount("");
                            fetchAccessOptions();
                        }    
                        
                    })
                }
            })
        })
    }

    async function fetchAccessOptions() {
        await axios.get("http://localhost:3001/access/" + perID.current)
        .then((res) => {
            console.log(res.data);
            setAccessOptions(res.data);

            let banks = Array.from(new Set(res.data.map(a =>  a.bankID)));
            
        
            setBankOptions(banks);
            console.log(banks)
        })
    }

    useEffect(() => {   
        perID.current = sessionStorage.getItem("perID");
        fetchAccessOptions();
    }, []);


    let depositAccountOptions = null;
    if(depositBankID && accessOptions) {
        let accounts = []
        accessOptions.forEach(element => {
            if (element.bankID == depositBankID) {
                accounts.push(element.accountID);
            }
        });

        console.log("accounts: ", accounts)
        depositAccountOptions = accounts.map((accountID, index) => <option key={index}>{accountID}</option>)
    }

    let withdrawAccountOptions = null;
    if(withdrawBankID && accessOptions) {
        let accounts = []
        accessOptions.forEach(element => {
            if (element.bankID == withdrawBankID) {
                accounts.push(element.accountID);
            }
        });

        console.log("accounts: ", accounts)
        withdrawAccountOptions = accounts.map((accountID, index) => <option key={index}>{accountID}</option>)
    }

    return(
        <div className="center-block">
            <Card > 
            <Card.Body style={{padding:"10px"}}>
                <Card.Title align="center">Deposit</Card.Title>
                <form onSubmit={handleDeposit} id="transfer_form">

                    <div className="row" style={{padding:"7px"}}>
                            <div className='col'  align="center" >Amount $:</div>

                            <div className='col' align="center">
                                <input 
                                    className="form-control"
                                    value={depositAmount}
                                    onChange={(e) => setDepositAmount(e.target.value)}
                                />                            
                            </div>
                            
                            <div className='col'/>
                    </div>

                     <div className="row" style={{padding:"7px"}}>
                         <div className="col" align="center">To:</div>

                            <div className="col">
                                <label style={{paddingRight:"7px", paddingLeft:"7px"}} className="col">Bank</label>               
                                <div>
                                    <select value={depositBankID} onChange={(e) => setDepositBankID(e.target.value)}>
                                        <option value=""></option>
                                        {bankOptions.map((bank, index) => (
                                            <option value={bank} key={index}>{bank}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="col">
                                <label style={{paddingRight:"7px", paddingLeft:"7px"}} className="col">Account</label>               
                                <div>
                                    <select value={depositAccountID} onChange={(e) => setDepositAccountID(e.target.value)}>
                                        <option value=""></option>
                                        { depositAccountOptions }
                                    </select>
                                </div>
                            </div>
                     </div>



                    <div className="row" style={{padding:"7px"}}>
                        <div className="col" align="center">
                            <button type="reset" className="btn btn-dark">Cancel</button>
                            </div>
                            <div className="col" align="center">
                            <button type="submit" className="btn btn-dark" >Deposit</button>
                        </div>
                    </div>
                </form>                   
            </Card.Body>
            </Card>



            <div style={{paddingTop:"10%"}}/>
            <Card> 
            <Card.Body style={{padding:"10px"}}>
                <Card.Title align="center">Withdraw</Card.Title>

                <form onSubmit={handleWithdraw} id="transfer_form">

                     <div className="row" style={{padding:"7px"}}>
                         <div className="col" align="center">From:</div>

                            <div className="col">
                                <label style={{paddingRight:"7px", paddingLeft:"7px"}} className="col">Bank</label>               
                                <div>
                                    <select value={withdrawBankID} onChange={(e) => setWithdrawBankID(e.target.value)}>
                                        <option value=""></option>
                                        {bankOptions.map((bank, index) => (
                                            <option value={bank} key={index}>{bank}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="col">
                                <label style={{paddingRight:"7px", paddingLeft:"7px"}} className="col">Account</label>               
                                <div>
                                    <select value={withdrawAccountID} onChange={(e) => setWithdrawAccountID(e.target.value)}>
                                        <option value=""></option>
                                        { withdrawAccountOptions }
                                    </select>
                                </div>
                            </div>
                     </div>

                     <div className="row" style={{padding:"7px"}}>
                            <div className='col'  align="center" >Amount $:</div>

                            <div className='col' align="center">
                                <input 
                                    className="form-control"
                                    value={withdrawAmount}
                                    onChange={(e) => setWithdrawAmount(e.target.value)}
                                />                            
                            </div>
                            
                            <div className='col'/>
                    </div>

                    <div className="row" style={{padding:"7px"}}>
                        <div className="col" align="center">
                            <button type="reset" className="btn btn-dark">Cancel</button>
                            </div>
                            <div className="col" align="center">
                            <button type="submit" className="btn btn-dark" >Withdraw</button>
                        </div>
                    </div>
                </form>              
            </Card.Body>
            </Card>
        </div> 
    )
}

export default DepositWithdrawScreen;
import React, { useState, useEffect, useRef } from 'react'
import axios from "axios";
import { Card } from 'react-bootstrap';
import { toast } from 'react-toastify';

function CreateAccountScreen (){ 

    const [bankOptions, setBankOptions] = useState([]);
    const [bankID, setBankID] = useState("");
    const [acctType, setAcctType] = useState("");
    const [acctName, setAcctName] = useState("");

    const [initBal, setInitBal] = useState("");
    const [interestRate, setInterestRate] = useState("");
    const [minBal, setMinBal] = useState("");
    const [maxWithdrawals, setMaxWithdrawals] = useState("");

    //on submit
    /*
    Check that all number fields are either null or a number
    Call create accoaunt
    */
    //whatever the one is that fires when you first get to the page

    let handleSubmit = async (e) => {
        e.preventDefault();
        console.log(initBal);
        //numbers must be empty or numbers, others must be filled
        var inputTypeError = false;
        if(bankID === "") {
            toast.error("Select a Bank")
            inputTypeError = true;
            return
        }
        if(acctName === "") {
            toast.error("Must have a name for the account")
            inputTypeError = true;
            return
        }
        if(acctType === "") {
            toast.error("Select account type")
            inputTypeError = true;
            return
        }
        console.log(initBal);
        console.log(isNaN(initBal))
        if(isNaN(initBal) || initBal === ""){
            toast.error("Initial Balance must be a number")
            inputTypeError = true;
        }
        if((isNaN(interestRate) || interestRate === "") && (acctType === "savings" || acctType === "market")){
            toast.error("Interest Rate must be a number")
            inputTypeError = true;
        }
        if((isNaN(minBal) || minBal === "") && acctType === "savings"){
            toast.error("Minimum Balance must be a number")
            inputTypeError = true;
        }
        if((isNaN(maxWithdrawals) || maxWithdrawals === "") && acctType === "market"){
            toast.error("Maximum Withdrawals must be a number")
            inputTypeError = true;
        }
        if(inputTypeError) {
            return
        }
        //now check that name isn't already taken
        await axios.get("http://localhost:3001/bank_account/" + bankID)
        .then((res) => {
            console.log(res.data);

            let accounts = Array.from(new Set(res.data.map(a =>  a.accountID)));
        
            if(accounts.includes(acctName)){
                toast.error("Account name is already taken")
                return
            }

            try {
                if (acctType === "checking") {
                    axios.post("http://localhost:3001/checking", {
                        bankID: bankID,
                        accountID: acctName,
                        balance: initBal,
    
    
                    }).then((response) => {
                        console.log(response)
    
                        if(response.status === 200) {
                            toast.success("Account created!");
                            setBankID("");
                            setAcctName("");
                            setAcctType("");
                            setInitBal("");
                            setInterestRate("");
                            setMaxWithdrawals("");
                            setMinBal("");
                        }    
                        
                    }).catch((err) => {
                        console.log(err.response);
                        if (err.response.data.original === undefined) {
                            toast.error(err.message);
                        } else {
                            toast.error(err.response.data.original.sqlMessage);
                        }                
                    });
                } else if (acctType === "savings") {
                    axios.post("http://localhost:3001/savings", {
                        bankID: bankID,
                        accountID: acctName,
                        balance: initBal,
                        interest_rate: interestRate,
                        minBalance: minBal
    
    
                    }).then((response) => {
                        console.log(response)
    
                        if(response.status === 200) {
                            toast.success("Account created!");
                            setBankID("");
                            setAcctName("");
                            setAcctType("");
                            setInitBal("");
                            setInterestRate("");
                            setMaxWithdrawals("");
                            setMinBal("");
                        }    
                        
                    }).catch((err) => {
                        console.log(err.response);
                        if (err.response.data.original === undefined) {
                            toast.error(err.message);
                        } else {
                            toast.error(err.response.data.original.sqlMessage);
                        }             
                    });
                } else if (acctType === "market") {
                    axios.post("http://localhost:3001/market", {
                        bankID: bankID,
                        accountID: acctName,
                        balance: initBal,
                        interest_rate: interestRate,
                        maxWithdrawals: maxWithdrawals
    
                    }).then((response) => {
                        console.log(response)
    
                        if(response.status === 200) {
                            toast.success("Account created!");
                            setBankID("");
                            setAcctName("");
                            setAcctType("");
                            setInitBal("");
                            setInterestRate("");
                            setMaxWithdrawals("");
                            setMinBal("");
                        }    
                        
                    }).catch((err) => {
                        console.log(err.response);
                        if (err.response.data.original === undefined) {
                            toast.error(err.message);
                        } else {
                            toast.error(err.response.data.original.sqlMessage);
                        }             
                    });
                }
                
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        })
    };


    useEffect(() => {   
        fetchBanks();
    }, []);

    async function fetchBanks() {
        await axios.get("http://localhost:3001/bank/")
        .then((res) => {
            console.log(res.data);

            let banks = Array.from(new Set(res.data.map(a =>  a.bankID)));
        
            setBankOptions(banks);
            console.log(banks)
        })
    }

    return(
        <div className="center-block">
            <Card> 
            <Card.Body style={{padding:"10px"}}>
                <Card.Title align="center">Create Account</Card.Title>
                <form id="form" onSubmit={handleSubmit}>
                    <div className='row' style={{border: "2px solid grey", padding:"10px"}}>
                        <div className='col' align="center">
                            <label htmlFor="bankID" style={{paddingRight:"7px", paddingLeft:"7px"}}>Bank</label>               
                            <div>
                                <select id="bankID" value={bankID} onChange={(e) => setBankID(e.target.value)}>
                                    <option value=""></option>
                                    {bankOptions.map((bank, index) => (
                                        <option value={bank} key={index}>{bank}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className='col' align="center">
                            <label htmlFor="name" style={{paddingRight:"7px", paddingLeft:"7px"}}>Account Name</label>  
                            <input id="name" value={acctName} onChange={(e) => setAcctName(e.target.value)}></input>
                        </div>
                        <div className='col' align="center">
                            <label htmlFor="name" style={{paddingRight:"7px", paddingLeft:"7px"}}>Account Type</label>  
                            <select id="acct_type" value={acctType} onChange={(e) => setAcctType(e.target.value)}>
                                <option value=""></option>
                                <option value="checking">Checking</option>
                                <option value="savings">Savings</option>
                                <option value="market">Market</option>
                            </select>
                        </div>
                    </div>
                    <div className='row' align="center" style={{border: "2px solid grey"}}>
                        <div className='col' style={{padding:"10px"}}>
                            <label htmlFor="init_bal" style={{paddingRight:"7px", paddingLeft:"7px"}}>Initial Balance</label>  
                            <input id="init_bal" value={initBal} onChange={(e) => setInitBal(e.target.value)}></input>
                        </div>
                        <div className='row' style={{padding:"10px"}}>
                            {(acctType == "savings" || acctType == "market") &&
                                <div className='col'>
                                    <label htmlFor="interest_rate" style={{paddingRight:"7px", paddingLeft:"7px"}}>Interest Rate</label>  
                                    <input id="interest_rate" value={interestRate} onChange={(e) => setInterestRate(e.target.value)}></input>
                                </div>
                            }
                            {acctType == "savings" &&
                                <div className='col'>
                                    <label htmlFor="min_bal" style={{paddingRight:"7px", paddingLeft:"7px"}}>Minimum Balance</label>  
                                    <input id="min_bal" value={minBal} onChange={(e) => setMinBal(e.target.value)}></input>
                                </div>
                            }
                            {acctType == "market" &&
                                <div className='col'>
                                    <label htmlFor="max_withdrawals" style={{paddingRight:"7px", paddingLeft:"7px"}}>Maximum Withdrawals</label>  
                                    <input id="max_withdrawals" value={maxWithdrawals} onChange={(e) => setMaxWithdrawals(e.target.value)}></input>
                                </div>
                            }
                        </div>
                    </div>
                    <div className='row'>
                        <button type="submit" className="btn btn-dark">Create Account</button>
                    </div>
                </form>
            </Card.Body>
            </Card>
        </div>
        /* 
        Select bank
        Type acctID, check available
        Select Type
        if savings:
            balance
            min balance
            interest rate
        if checking:
            balance
        if market:
            balance
            max withdrawals
            interest rate
         */
    )
}

export default CreateAccountScreen;
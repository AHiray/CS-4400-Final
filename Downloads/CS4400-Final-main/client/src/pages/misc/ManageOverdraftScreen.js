import React, { useState, useEffect, useRef, useReducer } from 'react'
import "../../css/Screens.css"
import { Card } from 'react-bootstrap';
import axios from "axios";
import { toast } from 'react-toastify';
import { Link } from "react-router-dom";


function ManageOverdraftScreen (){ 

    const [checkingOptions, setCheckingOptions] = useState([]);
    const [checking, setChecking] = useState("");

    // check box
    const [setOverdraft] = useState("");
    let overdraft = useRef(0);

    const [savingsOptions, setSavingsOptions] = useState([]);
    const [savings, setSavings] = useState("");

    const perID = useRef(sessionStorage.getItem("perID"));
    const userTypes = useRef((sessionStorage.getItem("userTypes")));

    let admin = 0;

    let handleChange = (e) => {
        const checked = e.target.checked;

        if (checked) {
            overdraft.current = 1;
        } else {
            overdraft.current = 0;
        }

        console.log(checking);
    };

    let handleSubmit = async(e) => {

        e.preventDefault();

        console.log(checking, overdraft, savings);

        if(overdraft.current === 1 && (checking === "" || savings === "")) {
            toast.error("Checking and Savings Accounts Must Be Selected for Start Overdraft.")
            return
        } else if(overdraft.current === 0 && checking === '') {
            toast.error("Checking Must Be Selected for Stop Overdraft.")
            return
        }

        const checkingArr = checking.split(':');
        checkingArr[1] = checkingArr[1].replace(/\s+/g, '');

        let savingsArr
        if (overdraft.current === 1) {
            savingsArr = savings.split(':');
            savingsArr[1] = savingsArr[1].replace(/\s+/g, '');
        }
         

        if (userTypes.current.includes("admin")) {
            admin = 1;
        }

        try {
            if (overdraft.current === 0) { // stopping overdraft
                // stop
                await axios.post("http://localhost:3001/checking/stop-overdraft", {
                    requester: perID.current,
                    checkingBankID: checkingArr[0],
                    checkingAccountID: checkingArr[1],
                    isAdmin: admin,
                }).then((response) => {
                    if (response.status === 200) {
                        toast.success("Overdraft Stopped Successfully!");
                    }    
                }).catch((err) => {
                    console.log(err.response);
                    if (err.response.data.original === undefined) {
                        if(err.response.data.message) {
                            toast(err.response.data.message);
                        } else {
                            toast(err.message);
                        }
                    } else {
                        toast.error(err.response.data.original.sqlMessage);
                    }         
                
                });
            } else if (overdraft.current === 1) { // starting overdraft
                console.log("sending request")
                // start
                await axios.post("http://localhost:3001/checking/start-overdraft", {
                    requester: perID.current,
                    checkingBankID: checkingArr[0],
                    checkingAccountID: checkingArr[1],
                    savingsBankID: savingsArr[0],
                    savingsAccountID: savingsArr[1],
                    isAdmin: admin,
                }).then((response) => {
                    if (response.status === 200) {
                        toast.success("Overdraft Started Successfully!");
                    }
                    
                }).catch((err) => {
                    console.log(err.response);
                    if (err.response.data.original === undefined) {
                        if(err.response.data.message) {
                            toast(err.response.data.message);
                        } else {
                            toast(err.message);
                        }
                    } else {
                        toast.error(err.response.data.original.sqlMessage);
                    }        
                });
            }

            fetchChecking();
            fetchSavings();
        
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } 
    };

    async function fetchChecking() {
        if (userTypes.current.includes("admin")) {
            await axios.get("http://localhost:3001/checking")
                .then((res) => {
                    setCheckingOptions(res.data);
                }).catch((err) => {
                    if (err.response) {
                        console.log(err.response);
                        toast.error(err.response.data.original.sqlMessage); 
                    } else if (err.request) {
                        console.log(err.request);
                        toast.error(err.request.data.original.sqlMessage);
                    } else {
                        console.log('Error', err.message);
                    }
                })
        } else {
            await axios.get("http://localhost:3001/checking/" + perID.current)
                .then((res) => {
                    setCheckingOptions(res.data);
                }).catch((err) => {
                    if (err.response) {
                        console.log(err.response);
                        toast.error(err.response.data.original.sqlMessage); 
                    } else if (err.request) {
                        console.log(err.request);
                        toast.error(err.request.data.original.sqlMessage);
                    } else {
                        console.log('Error', err.message);
                    }
                })
        }
    }

    async function fetchSavings() {
        // console.log(perID);
        if (userTypes.current.includes("admin")) {
            await axios.get("http://localhost:3001/savings")
                .then((res) => {
                    setSavingsOptions(res.data);
                }).catch((err) => {
                    if (err.response) {
                        console.log(err.response);
                        toast.error(err.response.data.original.sqlMessage); 
                    } else if (err.request) {
                        console.log(err.request);
                        toast.error(err.request.data.original.sqlMessage);
                    } else {
                        console.log('Error', err.message);
                    }
                })
        } else {
            await axios.get("http://localhost:3001/savings/" + perID.current)
                .then((res) => {
                    setSavingsOptions(res.data);
                }).catch((err) => {
                    if (err.response) {
                        console.log(err.response);
                        toast.error(err.response.data.original.sqlMessage); 
                    } else if (err.request) {
                        console.log(err.request);
                        toast.error(err.request.data.original.sqlMessage);
                    } else {
                        console.log('Error', err.message);
                    }
                })
        }
    }

    useEffect(() => {
        fetchChecking();
        fetchSavings();
    }, []);

    return(
        <div className="center-block">
        <Card> 
        <Card.Body style={{padding:"10px"}}>
            <Card.Title align="center">Manage Overdraft Policies</Card.Title>
            <form onSubmit={handleSubmit}>

            <div className="row" style={{padding:"7px"}}>

                <label htmlFor="checking" style={{paddingRight:"7px", paddingLeft:"7px"}}>Available Checking Accounts</label>               
                    <div>
                        <select id="checking" value={checking} onChange={(e) => setChecking(e.target.value)}>
                            <option value=""></option>
                            {checkingOptions.map(checking => (
                                <option valuebank={checking.bankID} valueaccount={checking.accountID} key={checking.bankID + ": " +checking.accountID}>{checking.bankID + ": " +checking.accountID}</option>
                            ))}
                        </select>
                    </div>
            </div>

            <div className="row" style={{padding:"7px"}}>
                <label htmlFor="overdraft" style={{paddingRight:"7px", paddingLeft:"7px"}}>Adding Overdraft Policy? Unchecked will stop Policy</label>      
                <div>
                    <input type="checkbox" id="overdraft" value={overdraft} onChange ={(e) => handleChange(e)}></input>  
                </div>
                      
            </div>

            <div className="row" style={{padding:"7px"}}>

                <label htmlFor="savings" style={{paddingRight:"7px", paddingLeft:"7px"}}>Available Savings Accounts</label>               
                    <div>
                        <select id="savings" value={savings} onChange={(e) => setSavings(e.target.value)}>
                            <option value=""></option>
                            {savingsOptions.map(savings => (
                                <option valuebank={savings.bankID} valueaccount={savings.accountID} key={savings.bankID + ": " +savings.accountID}>{savings.bankID + ": " +savings.accountID}</option>
                            ))}
                        </select>
                    </div>
            </div>

            

            <div className="row" style={{padding:"7px"}}>
                    <div className="col" align="center">
                    <Link to="/manage-users">
                    <button type="reset" className="btn btn-dark">Cancel</button>
                    </Link>
                    </div>
                    <div className="col" align="center">
                    <button type="submit" className="btn btn-dark">Create</button>
                    </div>
             </div>
           
            </form> 
        </Card.Body>
        </Card>
    </div>


        // <Checkbox otherProps onChange={e => this.handleChange(e)} />
    )
}

export default ManageOverdraftScreen;
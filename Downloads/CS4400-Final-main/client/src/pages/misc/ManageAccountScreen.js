import React, { useState, useEffect, useRef } from 'react'
import axios from "axios";
import { Card } from 'react-bootstrap';
import { toast } from 'react-toastify';

function ManageAccountScreen (){ 
    const [bankOptions, setBankOptions] = useState([]);
    const [bankID, setBankID] = useState("");

    const [accessOptions, setAccessOptions] = useState([]);

    const [accountID, setAccountID] = useState("");

    const [removePerIDOptions, setRemovePerIDOptions] = useState([]);
    const [removePerID, setRemovePerID] = useState("");
    const [addPerIDOptions, setAddPerIDOptions] = useState([]);
    const [addPerID, setAddPerID] = useState("");

    const perID = useRef(sessionStorage.getItem("perID"));
    
    async function fetchAccessOptions() {
        await axios.get("http://localhost:3001/system_admin/")
        .then((res) => {
            console.log(res.data);
            
            let admins = Array.from(new Set(res.data.map(a =>  a.perID)));

            if (admins.includes(perID.current)) { //admins have access to all accounts
                axios.get("http://localhost:3001/bank_account/")
                .then((res) => {
                    console.log(res.data);
                    setAccessOptions(res.data);
        
                    let banks = Array.from(new Set(res.data.map(a =>  a.bankID)));
        
                    setBankOptions(banks);
                    console.log("Banks:", banks);
                })
            } else { //customers have access to their accounts
                axios.get("http://localhost:3001/access/" + perID.current)
                .then((res) => {
                    console.log(res.data);
                    setAccessOptions(res.data);
        
                    let banks = Array.from(new Set(res.data.map(a =>  a.bankID)));
        
                    setBankOptions(banks);
                    console.log("Banks:", banks)
                })
            }
            
        })
    }

    async function fetchAddPersonOptions() {
        await axios.get("http://localhost:3001/access/without/" + bankID +"%"+ accountID)
        .then((res) => {
            console.log(res.data);

            let people = Array.from(new Set(res.data.map(a =>  a.perID)));
            
            setAddPerIDOptions(people);
            console.log("PPLADD:",people);
            console.log("ADD:",removePerIDOptions);
        })
    }

    async function fetchRemovePersonOptions() {
        await axios.get("http://localhost:3001/access/with/" + bankID +"%"+ accountID)
        .then((res) => {
            console.log(res.data);

            let people = Array.from(new Set(res.data.map(a =>  a.perID)));
            
            setRemovePerIDOptions(people);
            console.log("PPLREM:", people);
            console.log("REM:",removePerIDOptions);
        })
    }

    let getAccountInfo = async (e) => {
        e.preventDefault();
        if (!bankID || !accountID) {
            if (!bankID) {
                toast.error("Please select a bank.");
            }
            if (!accountID) {
                toast.error("Please select an account.");
            }
        } else {
            fetchAddPersonOptions();
            fetchRemovePersonOptions();
        }
    }

    useEffect(() => {   
        perID.current = sessionStorage.getItem("perID");
        fetchAccessOptions();
    }, []);

    async function addOwner() {
        if (addPerID && bankID && accountID) {
            var today = new Date().toISOString().slice(0, 10);
            await axios.post("http://localhost:3001/access/", {
                perID: addPerID,
                bankID: bankID,
                accountID: accountID,
                dtShareStart: today
            }).then((res) => {
                if(res.status == 200) {
                    toast.success("Successfully added owner!");
                    setBankID("");
                    setAccountID("");
                    setAddPerID("");
                    setRemovePerID("");
                    setAddPerIDOptions([]);
                    setRemovePerIDOptions([]);
                } else {
                    toast.error("Addition unsuccessful.");
                }
            });
        } else {
            if (!bankID) {
                toast.error("Please select a bank.");
            }
            if (!accountID) {
                toast.error("Please select an account.");
            }
            if (!addPerID) {
                toast.error("Please select an owner to add.");
            }
        }
    }

    async function removeOwner() {
        if (removePerID && bankID && accountID) {
            await axios.delete("http://localhost:3001/access/", {
                data: {
                    perID: removePerID,
                    bankID: bankID,
                    accountID: accountID
                }
            }).then((res) => {
                if(res.status == 200) {
                    toast.success("Successfully removed owner!");
                    setBankID("");
                    setAccountID("");
                    setAddPerID("");
                    setRemovePerID("");
                    setAddPerIDOptions([]);
                    setRemovePerIDOptions([]);
                    fetchAccessOptions();
                } else {
                    toast.error("Removal unsuccessful.");
                }
            });
        } else {
            if (!bankID) {
                toast.error("Please select a bank.");
            }
            if (!accountID) {
                toast.error("Please select an account.");
            }
            if (!removePerID) {
                toast.error("Please select an owner to remove.");
            }
        }
    }

    let accountOptions = null;
    if(bankID && accessOptions) {
        let accounts = []
        accessOptions.forEach(element => {
            if (element.bankID == bankID) {
                accounts.push(element.accountID);
            }
        });

        console.log("accesible accounts at selected bank: ", accounts)
        accountOptions = accounts.map((accountID, index) => <option key={index}>{accountID}</option>)
    }

    let removePerIDSelect = null;
    let addPerIDSelect = null;
    if(bankID && accountID) {
        addPerIDSelect = addPerIDOptions.map((accountID, index) => <option key={index}>{accountID}</option>)
        removePerIDSelect = removePerIDOptions.map((accountID, index) => <option key={index}>{accountID}</option>)
        //console.log("addPerIDSelect: ", addPerIDSelect)
    }

    return (
        <div className="center-block" style={{border: "2px solid grey"}}>
            <Card> 
            <Card.Body style={{padding:"10px"}}>
            <Card.Title align="center">Manage Accounts</Card.Title>
                <div className="row" style={{padding:"7px", border:"1px solid grey"}}>
                    <div className="row">
                        <div className="col" align="center">
                            <label htmlFor="bankID" style={{paddingRight:"7px", paddingLeft:"7px"}} className="col">Bank</label>               
                            <div>
                                <select id="bankID" value={bankID} onChange={(e) => setBankID(e.target.value)}>
                                    <option value=""></option>
                                    {bankOptions.map((bank, index) => (
                                        <option value={bank} key={index}>{bank}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="col" align="center">
                            <label htmlFor="accountID" style={{paddingRight:"7px", paddingLeft:"7px"}} className="col">Account</label>               
                            <div>
                                <select value={accountID} onChange={(e) => setAccountID(e.target.value)}>
                                    <option value=""></option>
                                    { accountOptions }
                                </select>
                            </div>
                        </div>
                    </div>             
                    <div style={{alignItems:"center", justifyContent:"center", display:"flex", padding:"7px"}}>
                        <button className="btn btn-dark" style={{padding:"7px"}} onClick={getAccountInfo}>
                            Get Account Info
                        </button>
                    </div>
                </div>
                <div className='row'>
                    <div className="col" style={{border:"1px solid grey"}}>
                        <label htmlFor="addPerID" style={{paddingRight:"7px", paddingLeft:"7px"}} className="col">Add a New Owner From the List Below:</label> 
                        <div className="row" style={{padding:"30px"}}>
                            <div>   
                                <select value={addPerID} onChange={(e) => setAddPerID(e.target.value)}>
                                    <option value=""></option>
                                    { addPerIDSelect }
                                </select>
                            </div>
                        </div>
                        <div className="row" style={{padding:"30px"}}>
                            <button className="btn btn-dark" onClick={addOwner}>Add Owner</button>
                        </div>
                    </div>

                    <div className="col" style={{border:"1px solid grey"}}>
                        <label htmlFor="removePerID" style={{paddingRight:"7px", paddingLeft:"7px"}} className="col">Remove a Current Owner From the List Below:</label>    
                        <div className="row" style={{padding:"30px"}}>
                            <div>
                                <select value={removePerID} onChange={(e) => setRemovePerID(e.target.value)}>
                                    <option value=""></option>
                                    { removePerIDSelect }
                                </select>
                            </div>
                        </div>
                        <div className="row" style={{padding:"30px"}}>
                            <button className="btn btn-dark" onClick={removeOwner}>Remove Owner</button>
                        </div>
                    </div>
                </div>
            </Card.Body>
            </Card>
        </div>
    )
}

export default ManageAccountScreen;
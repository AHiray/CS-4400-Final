import React, { useState, useEffect, useRef } from 'react'
import axios from "axios";
import { Card } from 'react-bootstrap';
import { toast } from 'react-toastify';

function CreateFeeScreen (){ 
    const [bankOptions, setBankOptions] = useState([]);
    const [bankID, setBankID] = useState("");
    const [accountOptions, setAccountOptions] = useState([]);
    const [accountID, setAccountID] = useState("");
    const [fee, setFee] = useState("");

    let handleSubmit = async (e) => {
        e.preventDefault();
        
        console.log(bankID, accountID, fee);
        
        if(bankID === "" || accountID === "" || fee === "") {
            toast.error("No fields can be NULL")
            return
        }
      
        try {
            await axios.post("http://localhost:3001/interest_bearing_fees", {
                bankID: bankID,
                accountID: accountID,
                fee: fee

            }).then((response) => {
                console.log(response)

                if(response.status === 200) {
                    toast.success("Fee Created Successfully!");
                }    
                setAccountID("")
                setBankID("")
                setFee("")
            }).catch((err) => {
                console.log(err.response);
                toast.error(err.response.data);
            
            });
        } catch (error) {
            console.log(error);
            toast.error(error.response);
        }
    };

    useEffect(() => {   
        fetchBanks();
    }, []);

    async function fetchBanks() {
        await axios.get("http://localhost:3001/bank_account/")
        .then((res) => {
            console.log(res.data);

            let banks = Array.from(new Set(res.data.map(a =>  a.bankID)));
            
        
            setBankOptions(banks);
            console.log(banks)
        })
    }

    async function fetchBanksAccounts(bank) {
        await axios.get("http://localhost:3001/interest_bearing/" + bank)
        .then((res) => {
            console.log(res.data);
            console.log(bank);

            let accounts = Array.from(new Set(res.data.map(a =>  a.accountID)));
            
        
            setAccountOptions(accounts);
            console.log(accounts)
        })
    }

    function bankChanged(bank) {
        console.log(bank);
        setBankID(bank);
        fetchBanksAccounts(bank);
    }

    return (
        <div className="center-block">
            <Card> 
            <Card.Body style={{padding:"10px"}}>
                <Card.Title align="center">Create Fee</Card.Title>
                <form onSubmit={handleSubmit}>

                <div className="row" style={{padding:"7px"}}>
                    <div className="col">
                        <label htmlFor="bankID" style={{paddingRight:"7px", paddingLeft:"7px"}} className="col">Bank</label>               
                        <div>
                            <select id="bankID" value={bankID} onChange={(e) => bankChanged(e.target.value)}>
                                <option value=""></option>
                                {bankOptions.map((bank, index) => (
                                    <option value={bank} key={index}>{bank}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="col">
                        <label htmlFor="accountID" style={{paddingRight:"7px", paddingLeft:"7px"}} className="col">Account</label>               
                        <div>
                            <select value={accountID} onChange={(e) => setAccountID(e.target.value)}>
                                <option value=""></option>
                                {accountOptions.map((account, index) => (
                                    <option value={account} key={index}>{account}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="row" style={{padding:"30px"}}>
                    <div style={{display:"flex"}}>

                        <label htmlFor="fee" style={{padding:"7px"}}>Fee Type</label>
                        <div style={{flexGrow:"1"}}>
                        <input 
                            className="form-control" 
                            id="fee"
                            value={fee}
                            onChange={(e) => setFee(e.target.value)}
                        />
                        </div>
                    </div>
                </div>

                <div className="row" style={{padding:"7px"}}>
                    <div className="col" align="center">
                    <button type="reset" className="btn btn-dark">Back</button>
                    </div>
                    <div className="col" align="center">
                    <button type="submit" className="btn btn-dark" >Create</button>
                    </div>
                </div>
                </form>
            </Card.Body>
            </Card>
        </div>
    )
}

export default CreateFeeScreen;
import React, { useState, useEffect, useRef } from 'react'
import axios from "axios";
import { Card } from 'react-bootstrap';
import { toast } from 'react-toastify';

function TransferScreen (){ 
    const [bankOptions, setBankOptions] = useState([])
    const [bankIDFrom, setBankIDFrom] = useState("");
    const [bankIDTo, setBankIDTo] = useState("");

    const [accountIDFrom, setAccountIDFrom] = useState("");
    const [accountIDTo, setAccountIDTo] = useState("");

    const [accessOptions, setAccessOptions] = useState([]);

    const [amount, setAmount] = useState("")


    const perID = useRef(sessionStorage.getItem("perID"));

    const beforeBalance = useRef();


    let handleSubmit = async (e) => {
        e.preventDefault();

        if(perID.current === "" || bankIDFrom === "" || bankIDTo === "" || accountIDFrom === "" || accountIDTo === "" || amount === "") {
            toast.error("No fields can be NULL")
            return
        }

        
        try {
            await axios.get("http://localhost:3001/bank_account/" + bankIDTo + "%" + accountIDTo)
            .then((res) => {
                console.log(res);
                beforeBalance.current = res.data.balance;

                if(!res.data.balance) {
                    beforeBalance.current = 0;
                }
            })
        } catch (err) {
            console.log(err);
        }

        try {
            await axios.post("http://localhost:3001/transfer", {
                perID: perID.current,
                amount: amount,
                bankIDFrom: bankIDFrom,
                accountIDFrom: accountIDFrom,
                bankIDTo: bankIDTo,
                accountIDTo: accountIDTo,
            })
            .then(async (res) => {
                console.log(res);

                let check = false;

                await axios.get("http://localhost:3001/bank_account/" + bankIDTo + "%" + accountIDTo)
                .then((res) => {
                    console.log(res);

                    console.log(parseInt(beforeBalance.current) + parseInt(amount), parseInt(res.data.balance))

                    if (parseInt(beforeBalance.current) + parseInt(amount) !== parseInt(res.data.balance)) {
                        check =  false;
                    } else {
                        check = true
                    }
                })
                console.log("transfer check: ", check);
                
                

                if(check && res.status === 200) {
                    toast.success("Successfully made transfer!")
                } else {
                    toast.error("Transfer Failed: Not enough funds in sending account and/or overdraft account")
                }
            })
            .catch((err) => {
                console.log(err.response);
                toast.error(err.response.data.original.sqlMessage);
            })
        } catch(err) {
            console.log(err.message);
            toast.error(err.message);
        }
    };

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


    let accountOptionsFrom = null;
    if(bankIDFrom && accessOptions) {
        let accounts = []
        accessOptions.forEach(element => {
            if (element.bankID == bankIDFrom) {
                if (bankIDFrom === bankIDTo && element.accountID !== accountIDTo) {
                    accounts.push(element.accountID)
                } else if (bankIDFrom !== bankIDTo) {
                    accounts.push(element.accountID)
                }
            }
        });

        console.log("accounts from: ", accounts)
        accountOptionsFrom = accounts.map((accountID, index) => <option key={index}>{accountID}</option>)
    }

    let accountOptionsTo = null;
    if(bankIDTo && accessOptions) {
        let accounts = []
        accessOptions.forEach(element => {
            if (element.bankID == bankIDTo) {
                if (bankIDTo=== bankIDFrom && element.accountID !== accountIDFrom) {
                    accounts.push(element.accountID)
                } else if (bankIDTo !== bankIDFrom) {
                    accounts.push(element.accountID)
                }
            }
        });

        console.log("accounts to: ", accounts)
        accountOptionsTo = accounts.map((accountID, index) => <option key={index}>{accountID}</option>)
    }

    return(
        <div className="center-block">
            <Card > 
            <Card.Body style={{padding:"10px"}}>
                <Card.Title align="center">Make Transfer</Card.Title>
                 <form onSubmit={handleSubmit} id="transfer_form">

                     <div className="row" style={{padding:"7px"}}>
                         <div className="col" align="center">From:</div>

                            <div className="col">
                                <label htmlFor="bankID" style={{paddingRight:"7px", paddingLeft:"7px"}} className="col">Bank</label>               
                                <div>
                                    <select id="bankID" value={bankIDFrom} onChange={(e) => setBankIDFrom(e.target.value)}>
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
                                    <select value={accountIDFrom} onChange={(e) => setAccountIDFrom(e.target.value)}>
                                        <option value=""></option>
                                        { accountOptionsFrom }
                                    </select>
                                </div>
                            </div>
                     </div>


                     <div className="row" style={{padding:"7px"}}>
                         <div className='col'  align="center" >Amount $:</div>

                         <div className='col' align="center">
                            <input 
                                className="form-control"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>
                        <div className='col'/>
                     </div>

                     <div className="row" style={{padding:"7px"}}>
                         <div className="col" align="center">To:</div>

                            <div className="col">
                                <label htmlFor="bankID" style={{paddingRight:"7px", paddingLeft:"7px"}} className="col">Bank</label>               
                                <div>
                                    <select id="bankID" value={bankIDTo} onChange={(e) => setBankIDTo(e.target.value)}>
                                        <option value=""> </option>
                                        {bankOptions.map((bank, index) => (
                                            <option value={bank} key={index}>{bank}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="col">
                                <label htmlFor="accountID" style={{paddingRight:"7px", paddingLeft:"7px"}} className="col">Account</label>               
                                <div>
                                    <select value={accountIDTo} onChange={(e) => setAccountIDTo(e.target.value)}>
                                        <option value=""> </option>
                                        { accountOptionsTo }
                                    </select>
                                </div>
                            </div>
                     </div>

                    <div className="row" style={{padding:"7px"}}>
                        <div className="col" align="center">
                            <button type="reset" className="btn btn-dark">Cancel</button>
                            </div>
                            <div className="col" align="center">
                            <button type="submit" className="btn btn-dark" >Confirm</button>
                        </div>
                    </div>
                </form>           
            </Card.Body>
            </Card>
        </div> 
    )
}

export default TransferScreen;
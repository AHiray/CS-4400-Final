import React, { useState, useEffect } from 'react'
import "../../css/Screens.css"
import { Card } from 'react-bootstrap';
import axios from "axios";
import { toast } from 'react-toastify';
import { Link } from "react-router-dom";

function HireWorkerScreen (){ 

    const [bankIDOptions, setBankIDOptions] = useState([]);
    const [perIDOptions, setPerIDOptions] = useState([]);

    const [bankID, setBankID] = useState("");
    const [perID, setPerID] = useState("");

    let handleSubmit = async(e) => {
        e.preventDefault();

        console.log(bankID, perID);

        if(perID === "" || bankID === "") {
            toast.error("Person and Bank ID cannot be NULL")
            return
        }

        try {
            await axios.post("http://localhost:3001/workFor", {
                bankID: bankID,
                perID: perID
            }).then((response) => {
                if(response.status === 200) {
                    toast.success("Worker Hired Successfully!");
                }
                console.log("here")
            }).catch((err) => {
                console.log("hello")
                if (err.response) {
                    console.log(err.response);
                    toast.error(err.response.data);
                    console.log(perID);
                } else if (err.request) {
                    console.log(err.request);
                    toast.error(err.request.data.original.sqlMessage);
                } else {
                    console.log('Error', err.message);
                }
            });

            fetchPerIDs();
        
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    async function fetchBankIDs() {
        await axios.get("http://localhost:3001/bank")
        .then((res) => {
            setBankIDOptions(res.data);
        });
    }

    async function fetchPerIDs() {
        await axios.get("http://localhost:3001/person")
        .then((res) => {
            setPerIDOptions(res.data);
        });
    }

    useEffect(() => {
        fetchBankIDs();
        fetchPerIDs();
    }, []);

    return(
        <div className="center-block">
        <Card> 
        <Card.Body style={{padding:"10px"}}>
            <Card.Title align="center">Hire Worker</Card.Title>
            <form onSubmit={handleSubmit}>

            <div className="row" style={{padding:"7px"}}>
                    <div style={{display:"flex"}}>
                        
                    <label htmlFor="bankID" style={{paddingRight:"7px", paddingLeft:"7px"}}>Bank</label>               
                        <div style={{flexGrow:"1"}}>
                            <select id="bankID" value={bankID} onChange={(e) => setBankID(e.target.value)}>
                                <option value=""></option>
                                {bankIDOptions.map(bank => (
                                    <option value={bank.bankID} key={bank.bankID}>{bank.bankID}</option>
                                ))}
                            </select>
                        </div>

                    
                        <label htmlFor="perID" style={{paddingRight:"7px", paddingLeft:"7px"}}>Employee</label>               
                        <div style={{flexGrow:"1"}}>
                            <select id="perID" value={perID} onChange={(e) => setPerID(e.target.value)}>
                                <option value=""></option>
                                {perIDOptions.map(person => (
                                    <option value={person.perID} key={person.perID}>{person.perID}</option>
                                ))}
                            </select>
                        </div>

                        
                    </div>
                </div>
            
            <div className="row" style={{padding:"7px"}}>
                    <div className="col" align="center">
                    <Link to="/manage-users">
                    <button type="reset" className="btn btn-dark">Cancel</button>
                    </Link>                    
                    </div>
                    <div className="col" align="center">
                    <button type="submit" className="btn btn-dark">Confirm</button>
                    </div>
             </div>
           
            </form> 
        </Card.Body>
        </Card>
    </div>    
    )
}

export default HireWorkerScreen;
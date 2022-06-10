import React, { useState, useEffect } from 'react'
import "../../css/Screens.css"
import { Card } from 'react-bootstrap';
import axios from "axios";
import { toast } from 'react-toastify';
import { Link } from "react-router-dom";

function CreateEmployeeRole (){ 

    const [perIDOptions, setPerIDOptions] = useState([]);
    const [perID, setPerson] = useState("");
    const [salary, setSalary] = useState("");
    const [payments, setPayments] = useState("");
    const [earned, setEarned] = useState("");

    let handleReset = async (e) => {
        setPerson("");
        setSalary("");
        setEarned("");
        setPayments("");
        toast.success("Cleared")
    };

    let handleSubmit = async(e) => {
        e.preventDefault();

        console.log(perID, salary, payments, earned);

        if(perID === "") {
            toast.error("Person ID cannot be NULL")
            return
        }

        try {
            await axios.post("http://localhost:3001/employee", {
                perID: perID,
                salary: salary,
                payments: payments,
                earned: earned
            }).then((response) => {
                if(response.status === 200) {
                    toast.success("Employee Role Created Successfully!");
                }
            }).catch((err) => {
                console.log(err.response);
                toast.error(err.response.data)
                console.log(perID);
            });

            fetchPerIDs();
        
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    async function fetchPerIDs() {
        await axios.get("http://localhost:3001/person")
        .then((res) => {
            setPerIDOptions(res.data);
        });
    }

    useEffect(() => {
        fetchPerIDs();
    }, []);

    return(
        <div className="center-block">
        <Card> 
        <Card.Body style={{padding:"10px"}}>
            <Card.Title align="center">Create Employee Role</Card.Title>
            <form onSubmit={handleSubmit}>

            <div className="row" style={{padding:"7px"}}>

                <label htmlFor="person" style={{paddingRight:"7px", paddingLeft:"7px"}}>Person</label>               
                    <div>
                        <select id="perID" value={perID} onChange={(e) => setPerson(e.target.value)}>
                            <option value=""></option>
                            {perIDOptions.map(person => (
                                <option value={person.perID} key={person.perID}>{person.perID}</option>
                            ))}
                        </select>
                    </div>
            </div>

            <div className="row" style={{padding:"7px"}}>
                <label htmlFor="salary">Salary</label>

                <div>
                <input 
                    className="form-control" 
                    id="salary"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                />
                </div>
            </div>

            <div className="row" style={{padding:"7px"}}>

                    <label htmlFor="payments" style={{padding:"7px"}}># of Payments</label>
                    <div>
                    <input 
                        className="form-control" 
                        id="payments"
                        value={payments}
                        onChange={(e) => setPayments(e.target.value)}
                    />
                    </div>
            </div>

            <div className="row" style={{padding:"7px"}}>

                    <label htmlFor="earned" style={{padding:"7px"}}>Accumulated Earnings</label>
                    <div>
                    <input 
                        className="form-control" 
                        id="earned"
                        value={earned}
                        onChange={(e) => setEarned(e.target.value)}
                    />
                    </div>
            </div>
            
            <div className="row" style={{padding:"7px"}}>
                    <div className="col" align="center">
                    <Link to="/manage-users">
                    <button type="reset" onClick={() => handleReset()} className="btn btn-dark">Cancel</button>
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
    )
}

export default CreateEmployeeRole;
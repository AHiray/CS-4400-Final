import React, { useState, useEffect, useRef } from 'react'
import axios from "axios";
import { Card } from 'react-bootstrap';
import { toast } from 'react-toastify';

function ReplaceManagerScreen (){ 
    const [bankOptions, setBankOptions] = useState([]);
    const [bankID, setBankID] = useState("");
    const [employeeOptions, setEmployeeOptions] = useState([]);
    const [employee, setEmployee] = useState("");
    const [salary, setSalary] = useState("");


    let handleSubmit = async (e) => {
        e.preventDefault();
        
        console.log(bankID, employee, salary);
        
        if(bankID === "" || employee === "" || salary === "") {
            toast.error("No fields can be NULL")
            return
        }
        if (Number.isInteger(parseInt(salary)) === false) {
            toast.error("Integer Salary Only")
            return
        }
      
        try {
            await axios.post("http://localhost:3001/employee/replace-manager", {
                bankID: bankID,
                employee: employee,
                salary: salary

            }).then((response) => {
                console.log(response)

                if(response.status === 200) {
                    toast.success("Manager replaced!");
                    setBankID("");
                    setEmployee("");
                    setSalary("");
                    fetchEmployees();
                }    
                
            }).catch((err) => {
                console.log(err.response);
                if (err.response.data.original === undefined) {
                    toast.error(err.message);
                } else {
                    toast.error(err.response.data.original.sqlMessage);
                }
            });
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };


    useEffect(() => {   
        fetchBanks();
        fetchEmployees();
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

    async function fetchEmployees() {
        await axios.get("http://localhost:3001/employee/valid-managers/")
        .then((res) => {
            console.log(res.data);

            let employees = Array.from(new Set(res.data.map(a =>  a.perID)));

            setEmployeeOptions(employees);
            console.log(employees)
        })
    }

    return (
        <div className="center-block">
            <Card> 
            <Card.Body style={{padding:"10px"}}>
                <Card.Title align="center">Replace Manager</Card.Title>
                <form onSubmit={handleSubmit} id="form">

                <div className="row" style={{padding:"7px"}}>
                    <div className="col">
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

                    <div className="col">
                        <label htmlFor="employee" style={{paddingRight:"7px", paddingLeft:"7px"}} className="col">New Manager</label>               
                        <div>
                            <select value={employee} onChange={(e) => setEmployee(e.target.value)}>
                                <option value=""></option>
                                {employeeOptions.map((employee, index) => (
                                    <option value={employee} key={index}>{employee}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="row" style={{padding:"30px"}}>
                    <div style={{display:"flex"}}>

                        <label htmlFor="salary" style={{padding:"7px"}}>New Salary</label>
                        <div style={{flexGrow:"1"}}>
                        <input 
                            className="form-control" 
                            id="salary"
                            value={salary}
                            onChange={(e) => setSalary(e.target.value)}
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

export default ReplaceManagerScreen;
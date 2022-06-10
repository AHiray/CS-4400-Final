import React, { useState, useEffect } from 'react'
import "../../css/Screens.css"
import { Card } from 'react-bootstrap';
import axios from "axios";
import { toast } from 'react-toastify';

function CreateBankScreen() {
    const [bankID, setBankID] = useState("");
    const [bankName, setBankName] = useState("");
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zip, setZip] = useState("");
    const [resAssets, setResAssets] = useState("");
    const [corpID, setCorpID] = useState("");
    const [manager, setManager] = useState("");
    const [employee, setEmployee] = useState("");

    const[corpOptions, setCorpOptions] = useState([]);
    const[managerOptions, setMangerOptions] = useState([]);
    const[employeeOptions, setEmployeeOptions] = useState([]);

    let handleReset = async (e) => {
        setBankID("");
        setBankName("");
        setCity("");
        setStreet("");
        setZip("");
        setResAssets("");
        setState("");
        toast.success("Cleared")
    };
    let handleSubmit = async (e) => {
        e.preventDefault();
        
        console.log(bankID, corpID, manager);
        
        if(bankID === "" || corpID === "" || manager === "") {
            toast.error("Corporation ID, Bank ID, and Manager cannot be NULL")
            return
        }

        if(employee === manager) {
            toast.error("Manager cannot be the same as Employee")
            return
        }
        
        if (state !== "" && state.length != 2) {
            toast.error("Invalid State Abbreviation");
            return
        }

        if (zip !== "" && zip.length != 5) {
            toast.error("Invalid Zip Code");
            return
        }

      
        try {
            await axios.post("http://localhost:3001/bank", {
                bankID: bankID,
                bankName: bankName,
                street: street,
                city: city,
                state: state,
                zip: zip,
                resAssets: resAssets,
                corpID: corpID,
                manager: manager,
                employee: employee

            }).then((response) => {
                console.log(response)

                if(response.status === 200) {
                    toast.success("Bank Created Successfully!");
                    handleReset();
                }    
                
            }).catch((err) => {
                console.log(err.response);
                if (err.response.data.original === undefined) {
                    toast.error(err.message);
                } else {
                    toast.error(err.response.data.original.sqlMessage);
                }
            });

            fetchCorporations();
            fetchValidEmployees();
            fetchValidManagers();
        
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    async function fetchCorporations() {
        await axios.get("http://localhost:3001/corporation")
        .then((res) => {
            console.log(res.data);
            setCorpOptions(res.data);
        });
    }

    async function fetchValidManagers() {
        await axios.get("http://localhost:3001/employee/valid-managers")
        .then((res) => {
            console.log(res.data);
            setMangerOptions(res.data);
        });
    }

    async function fetchValidEmployees() {
        await axios.get("http://localhost:3001/employee/valid-employees")
        .then((res) => {
            console.log(res.data);
            setEmployeeOptions(res.data);
        });
    }


    
    useEffect(() => {
        fetchCorporations();
        fetchValidEmployees();
        fetchValidManagers();
    }, []);
    

    return (
        <div className="center-block">
            <Card> 
            <Card.Body style={{padding:"10px"}}>
                <Card.Title align="center">Create Bank</Card.Title>
                <form onSubmit={handleSubmit}>

                <div className="row" style={{padding:"7px"}}>
                    <label htmlFor="corpID">Bank ID</label>

                    <div>
                    <input 
                        className="form-control" 
                        id="bankID"
                        value={bankID}
                        onChange={(e) => setBankID(e.target.value)}
                    />
                    </div>
                </div>

                <div className="row" style={{padding:"7px"}}>
                    <label htmlFor="bankName">Bank Name</label>

                    <div>
                    <input 
                        className="form-control" 
                        id="bankName"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                    />
                    </div>
                </div>

                <div className="row" style={{padding:"7px"}}>
                    <h6>Addrees Info</h6>
                </div>
                <div className="row" style={{padding:"7px"}}>
                    <div style={{display:"flex"}}>

                        <label htmlFor="street" style={{padding:"7px"}}>Street</label>
                        <div style={{flexGrow:"1"}}>
                        <input 
                            className="form-control" 
                            id="street"
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                        />
                        </div>

                        <label htmlFor="city" style={{padding:"7px"}}>City</label>
                        <div style={{flexGrow:"1"}}>
                        <input 
                            className="form-control" 
                            id="city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                        </div>
                    </div>
                </div>

                <div className="row" style={{padding:"7px"}}>
                    <div style={{display:"flex"}}>

                        <label htmlFor="state" style={{padding:"7px"}}>State Abbr.</label>
                        <div style={{flexGrow:"1"}}>
                        <input 
                            className="form-control" 
                            id="state"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                        />
                        </div>

                        <label htmlFor="zip" style={{padding:"7px"}}>Zip Code</label>
                        <div style={{flexGrow:"1"}}>
                        <input 
                            className="form-control" 
                            id="zip"
                            value={zip}
                            onChange={(e) => setZip(e.target.value)}
                        />
                        </div>
                    </div>
                </div>
                
                <div className="row" style={{padding:"7px"}}>
                    <h6>Operation Info</h6>
                </div>

                <div className="row" style={{padding:"7px"}}>

                    <div style={{display:"flex"}}>
                        
                        <label htmlFor="resAssets" style={{padding:"7px"}}>Reserved Assets.</label>
                        <div style={{flexGrow:"1"}}>
                        <input 
                            className="form-control" 
                            id="resAssets"
                            value={resAssets}
                            onChange={(e) => setResAssets(e.target.value)}
                        />
                        </div>
                       

                        <label htmlFor="corpID" style={{paddingRight:"7px", paddingLeft:"7px"}}>Corp. ID</label>               
                        <div style={{flexGrow:"1"}}>
                            <select id="corpID" value={corpID} onChange={(e) => setCorpID(e.target.value)}>
                                <option value=""></option>
                                {corpOptions.map(corp => (
                                    <option value={corp.corpID} key={corp.corpID}>{corp.corpID}</option>
                                ))}
                            </select>
                        </div>
                        
                    </div>
                </div>

                <div className="row" style={{padding:"7px"}}>
                    <div style={{display:"flex"}}>
                        
                    <label htmlFor="manager" style={{paddingRight:"7px", paddingLeft:"7px"}}>Manager</label>               
                        <div style={{flexGrow:"1"}}>
                            <select id="manager" value={manager} onChange={(e) => setManager(e.target.value)}>
                                <option value=""></option>
                                {managerOptions.map(manager => (
                                    <option value={manager.perID} key={manager.perID}>{manager.perID}</option>
                                ))}
                            </select>
                        </div>

                    
                        <label htmlFor="employee" style={{paddingRight:"7px", paddingLeft:"7px"}}>Employee</label>               
                        <div style={{flexGrow:"1"}}>
                            <select id="employee" value={employee} onChange={(e) => setEmployee(e.target.value)}>
                                <option value=""></option>
                                {employeeOptions.map(employee => (
                                    <option value={employee.perID} key={employee.perID}>{employee.perID}</option>
                                ))}
                            </select>
                        </div>

                        
                    </div>
                </div>

                <div className="row" style={{padding:"7px"}}>
                    <div className="col" align="center">
                    <button type="reset"onClick={handleReset} className="btn btn-dark">Cancel</button>
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

export default CreateBankScreen;
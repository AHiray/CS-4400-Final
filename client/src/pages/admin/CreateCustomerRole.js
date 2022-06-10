import React, { useState, useEffect } from 'react'
import "../../css/Screens.css"
import { Card } from 'react-bootstrap';
import axios from "axios";
import { toast } from 'react-toastify';
import { Link } from "react-router-dom";

function CreateCustomerRole (){ 

    const [perIDOptions, setPerIDOptions] = useState([]);
    const [perID, setPerson] = useState("");


    let handleReset = async (e) => {
        setPerIDOptions("");
        setPerson("");
        toast.success("Cleared")
    };

    let handleSubmit = async(e) => {
        e.preventDefault();

        if(perID === "") {
            toast.error("Person ID cannot be NULL")
            return
        }

        try {
            await axios.post("http://localhost:3001/customer", {
                perID: perID,
            }).then((response) => {
                console.log(response)
                if(response.status === 200) {
                    toast.success("Customer Role Created Successfully!");
                }
            }).catch((err) => {
                toast.error(err.response.data)
                /*
                if (err.response) {
                    console.log(err.response);
                    toast.error(err.response.data.original.sqlMessage); 
                } else if (err.request) {
                    console.log(err.request);
                    toast.error(err.request);
                } else {
                    console.log('Error', err.message);
                }
                 */
            
            });
            fetchPerIDs();
        
        } catch (error) {
            //toast.error(error.message);
            console.log(perID);
        }
    };

    async function fetchPerIDs() {
        await axios.get("http://localhost:3001/person")
        .then((res) => {
            setPerIDOptions(res.data);
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
    
    });
    }

    useEffect(() => {
        fetchPerIDs();
    }, []);

    return(
        <div className="center-block">
        <Card> 
        <Card.Body style={{padding:"10px"}}>
            <Card.Title align="center">Create Customer Role</Card.Title>
            <form onSubmit={handleSubmit} onReset={handleReset}>

            <div className="row" style={{padding:"7px"}}>

                <label htmlFor="person" style={{paddingRight:"7px", paddingLeft:"7px"}}>Customer</label>               
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
                    <div className="col" align="center">
                    <Link to="/manage-users">
                    <button type="reset" onClick={() => handleReset()} className="btn btn-dark">Cancel</button>
                    </Link>                    </div>
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

export default CreateCustomerRole;
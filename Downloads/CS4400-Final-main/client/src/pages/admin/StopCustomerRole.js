import React, { useState, useEffect } from 'react'
import "../../css/Screens.css"
import { Card } from 'react-bootstrap';
import axios from "axios";
import { toast } from 'react-toastify';
import { Link } from "react-router-dom";

function StopCustomerRole (){ 

    const [perIDOptions, setPerIDOptions] = useState([]);
    const [perID, setPerson] = useState("");

    let handleSubmit = async(e) => {
        e.preventDefault();

        if(perID === "") {
            toast.error("Person ID cannot be NULL")
            return
        }

        try {
            await axios.delete("http://localhost:3001/customer", { 
                data: {
                    perID: perID
                }
            }).then((response) => {
                if(response.status === 200) {
                    toast.success("Customer Role Stopped Successfully!");
                }
                //toast.success("Customer Role Stopped Successfully!");
            }).catch((err) => {
                console.log(err.response);
                toast.error(err.response.data);
                console.log(perID);          
            
            });

            fetchPerIDs();
        
        } catch (error) {
            console.log(error);
            toast.error(error.response.data);
            console.log(perID);     
        }
    };

    async function fetchPerIDs() {
        await axios.get("http://localhost:3001/customer")
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
            <Card.Title align="center">Stop Customer Role</Card.Title>
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

export default StopCustomerRole;
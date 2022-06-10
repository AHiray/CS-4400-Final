import React, { useState } from 'react'

import "../css/Screens.css"
import { Card } from 'react-bootstrap';
import axios from "axios";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

function LoginScreen() {
    const [perID, setPerId] = useState("");
    const [pwd, setPwd] = useState("");
    const navigate = useNavigate();

    let handleSubmit = async (e) => {
        e.preventDefault();

        try{
            await axios.post("http://localhost:3001/person/login", {
                perID: perID,
                pwd: pwd
            }).then((res) => {

                if(res.status === 200) {
                    toast.success("Logged In Successfully");

                    sessionStorage.setItem("perID", res.data.perID);
                    sessionStorage.setItem("userTypes", res.data.userTypes);
                    sessionStorage.setItem("isLoggedIn", "true");
                    console.log("User Logged In")                    
                    navigate("/");
                }

            }).catch((err) => {
                console.log(err.message);

                if((err.response) && err.response.status === 400) {
                    console.log(err.response.data);
                    toast.error(err.response.data.error);
                } else {
                    toast.error(err.message);
                }

            })

        } catch (error) {
            console.log(error.message);
        }
    
    }

    return (
        
        <div className="center-block">
            <Card> 
            <Card.Body style={{padding:"10px"}}>
                <Card.Title align="center">Login</Card.Title>
                <form onSubmit={handleSubmit}>
                    <div className="row" style={{padding:"10px"}}>
                        <label htmlFor="perID">ID:</label>

                        <div>
                        <input 
                            className="form-control" 
                            id="perID"
                            value={perID}
                            onChange={(e) => setPerId(e.target.value)}
                        />
                        </div>
                    </div>

                    <div className="row" style={{padding:"10px"}}>
                        <label htmlFor="pwd">Password</label>

                        <div>
                        <input 
                            className="form-control" 
                            id="pwd"
                            value={pwd}
                            onChange={(e) => setPwd(e.target.value)}
                        />
                        </div>
                    </div>

                    <div className="row" style={{padding:"10px"}}>
                        <div className="col" align="center">
                        <button type="submit" style={{width:"25%"}} className="btn btn-dark" >Login</button>
                        </div>
                    </div>
                    </form>
            </Card.Body>
            </Card>
        </div>
        
    )
}

export default LoginScreen;

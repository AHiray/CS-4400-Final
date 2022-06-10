import React, { useState } from 'react'
import "../../css/Screens.css"
import { Card } from 'react-bootstrap';
import axios from "axios";
import { toast } from 'react-toastify';

function CreateCorpScreen() {
    const [corpID, setCorpID] = useState("");
    const [shortName, setShortName] = useState("");
    const [longName, setLongName] = useState("");
    const [resAssets, setResAssets] = useState("");

    let handleReset = async (e) => {
        setCorpID("");
        setShortName("");
        setLongName("");
        setResAssets("");
        toast.success("Cleared")
    };
    let handleSubmit = async (e) => {
        e.preventDefault();

        if(corpID === "" || shortName === "" || longName === "") {
            toast.error("Corporation ID or Long Name or Short Name cannot be NULL")
            return
        }
      
        try {
            await axios.post("http://localhost:3001/corporation/create", {
                corpID: corpID,
                shortName: shortName,
                longName: longName,
                resAssets: resAssets
            }).then((response) => {
                console.log(response)

                if(response.status === 200) {
                    toast.success("Corporation Created Successfully!");
                    handleReset()
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

    return (
        <div className="center-block">
            <Card> 
            <Card.Body style={{padding:"10px"}}>
                <Card.Title align="center">Create Corporation</Card.Title>
                <form onSubmit={handleSubmit} onReset={handleReset}>

                <div className="row" style={{padding:"7px"}}>
                    <label htmlFor="corpID">Corporation ID</label>

                    <div>
                    <input 
                        className="form-control" 
                        id="corpID"
                        value={corpID}
                        onChange={(e) => setCorpID(e.target.value)}
                    />
                    </div>
                </div>

                <div className="row" style={{padding:"7px"}}>
                    <label htmlFor="shortName">Short Name</label>

                    <div>
                    <input 
                        className="form-control" 
                        id="shortName"
                        value={shortName}
                        onChange={(e) => setShortName(e.target.value)}
                    />
                    </div>
                </div>

                <div className="row" style={{padding:"7px"}}>
                    <label htmlFor="longName">Long Name</label>

                    <div>
                    <input 
                        className="form-control" 
                        id="longName"
                        value={longName}
                        onChange={(e) => setLongName(e.target.value)}
                    />
                    </div>
                </div>
                
                
                <div className="row" style={{padding:"7px"}}>
                    <label htmlFor="resAssets">Reserved Assets</label>

                    <div>
                    <input 
                        className="form-control" 
                        id="resAssets"
                        value={resAssets}
                        onChange={(e) => setResAssets(e.target.value)}
                    />
                    </div>
                </div>


                <div className="row" style={{padding:"7px"}}>
                    <div className="col" align="center">
                    <button type="reset" className="btn btn-dark">Cancel</button>
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

export default CreateCorpScreen;
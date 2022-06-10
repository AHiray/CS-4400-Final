import React from 'react'
import axios from "axios";
import { Card } from 'react-bootstrap';
import { toast } from 'react-toastify';

function PayEmployeeScreen (){ 

    const payEmployees = async (e) => {
        e.preventDefault();

        try {
            await axios.post("http://localhost:3001/employee/pay-all")
            .then((res) => {
                console.log(res)
    
                if(res.status === 200) {
                    toast.success("Employees Paid Succesfully!");
                }  
            }).catch((err) => {
                console.log(err.response);
                if (err.response.data.original === undefined) {
                    toast.error(err.message);
                } else {
                    toast.error(err.response.data.original.sqlMessage);
                }
            });

        } catch (err) {
            console.log(err.response);
            toast.error(err.message);
        }
       
    };

    return(
        <div className="center-block">
            <Card > 
            <Card.Body style={{padding:"10px"}}>
                <Card.Title align="center">Pay Employees</Card.Title>
                <div className="row" style={{paddingBlock:"50px"}}>
                    <div className="col" align="center">
                    <button className="btn btn-dark" onClick={payEmployees}>Pay Employees</button>
                    </div>
                </div>             
            </Card.Body>
            </Card>
        </div> 
    )
}

export default PayEmployeeScreen;
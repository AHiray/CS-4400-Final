import React, { useState, useEffect } from 'react'
import axios from "axios";
import { Card } from 'react-bootstrap';

function CustomerStatsScreen (){ 
    const [customer_stats, setCustomerStats] = useState();

    async function fetchCustomerStats() {
        await axios.get("http://localhost:3001/customer/stats")
            .then((res) => {
                console.log(res);
                setCustomerStats(res.data);
            }).catch((err) => {
                console.log(err);
            });
    }

    useEffect(() => {
        if (!customer_stats) {
            fetchCustomerStats();
        }
        
    }, [customer_stats]);

    return(
        <div className="center-block" style={{width:"75%"}}>
            <Card> 
            <Card.Body style={{padding:"10px"}}>
                <Card.Title align="center">Customer Stats</Card.Title>
                <div style={{padding:"15px"}}>
                    <table className="table table-striped table-bordered" style={{fontSize:"10pt"}}>
                            <thead className="table-dark">
                                <tr>
                                    <th>Customer ID</th>
                                    <th>Tax ID</th>
                                    <th>Name</th>
                                    <th>DOB</th>
                                    <th>Date Joined</th>
                                    <th>Street</th>
                                    <th>City</th>
                                    <th>State</th>
                                    <th>Zip</th>
                                    <th>Number of Accounts</th>
                                    <th>Customer Assets $</th>
                                </tr>
                            </thead>
                            <tbody>
                            {customer_stats && customer_stats.map(customer =>
                                    <tr key={customer.person_identifier}>
                                        <td>{customer.person_identifier}</td>
                                        <td>{customer.tax_identifier}</td>
                                        <td>{customer.customer_name}</td>
                                        <td>{customer.date_of_birth}</td>
                                        <td>{customer.joined_system}</td>
                                        <td>{customer.street}</td>
                                        <td>{customer.city}</td>
                                        <td>{customer.state}</td>
                                        <td>{customer.zip}</td>
                                        <td>{customer.number_of_accounts}</td>
                                        <td>{customer.customer_assets}</td>
                                    </tr>
                                )}
                            </tbody>
                    </table>
                    </div>
            </Card.Body>
            </Card>
        </div>   
    )
}

export default CustomerStatsScreen;
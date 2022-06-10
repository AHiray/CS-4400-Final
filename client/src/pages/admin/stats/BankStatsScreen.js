import React, { useState, useEffect } from 'react'
import axios from "axios";
import { Card } from 'react-bootstrap';

function BankStatsScreen (){ 
    const [bank_stats, setBankStats] = useState();

    async function fetchBankStats() {
        await axios.get("http://localhost:3001/bank/stats")
            .then((res) => {
                console.log(res);
                setBankStats(res.data);
            }).catch((err) => {
                console.log(err);
            });
    }

    useEffect(() => {
        if (!bank_stats) {
            fetchBankStats();
        }
        
    }, [bank_stats]);

    return(
        <div className="center-block" style={{width:"75%"}}>
            <Card> 
            <Card.Body style={{padding:"10px"}}>
                <Card.Title align="center">Bank Stats</Card.Title>
                <div style={{padding:"15px"}}>
                    <table className="table table-striped table-bordered" style={{fontSize:"10pt"}}>
                            <thead className="table-dark">
                                <tr>
                                    <th>Bank ID</th>
                                    <th>Corporation Name</th>
                                    <th>Bank Name</th>
                                    <th>Street</th>
                                    <th>City</th>
                                    <th>State</th>
                                    <th>Zip</th>
                                    <th>Number of Accounts</th>
                                    <th>Bank Assets $</th>
                                    <th>Total Assets $</th>
                                </tr>
                            </thead>
                            <tbody>
                            {bank_stats && bank_stats.map(bank =>
                                    <tr key={bank.bank_identifier}>
                                        <td>{bank.bank_identifier}</td>
                                        <td>{bank.name_of_corporation}</td>
                                        <td>{bank.name_of_bank}</td>
                                        <td>{bank.street}</td>
                                        <td>{bank.city}</td>
                                        <td>{bank.state}</td>
                                        <td>{bank.zip}</td>
                                        <td>{bank.number_of_accounts}</td>
                                        <td>{bank.bank_assets}</td>
                                        <td>{bank.total_assets}</td>
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

export default BankStatsScreen;
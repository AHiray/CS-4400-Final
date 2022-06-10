import React, { useState, useEffect } from 'react'
import axios from "axios";
import { Card } from 'react-bootstrap';

function AccountStatsScreen (){ 

    const [account_stats, setAccountStats] = useState();

    async function fetchAccountStats() {
        await axios.get("http://localhost:3001/bank_account/stats")
            .then((res) => {
                console.log(res);
                setAccountStats(res.data);
            }).catch((err) => {
                console.log(err);
            });
    }

    useEffect(() => {
        if (!account_stats) {
            fetchAccountStats();
        }
        
    }, [account_stats]);

    return(
        <div className="center-block" style={{width:"75%"}}>
            <Card> 
            <Card.Body style={{padding:"10px"}}>
                <Card.Title align="center">Account Stats</Card.Title>
                <div style={{padding:"15px"}}>
                    <table className="table table-striped table-bordered" style={{fontSize:"10pt"}}>
                            <thead className="table-dark">
                                <tr>
                                    <th>Bank</th>
                                    <th>Account ID</th>
                                    <th>Account Balance $</th>
                                    <th>Number of Owners</th>
                                </tr>
                            </thead>
                            <tbody>
                            {account_stats && account_stats.map(account =>
                                    <tr key={[account.name_of_bank, account.account_identifier]}>
                                        <td>{account.name_of_bank}</td>
                                        <td>{account.account_identifier}</td>
                                        <td>{account.account_assets}</td>
                                        <td>{account.number_of_owners}</td>
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

export default AccountStatsScreen;
import React, { useState, useEffect } from 'react'
import axios from "axios";
import { Card } from 'react-bootstrap';

function CorporataionStatsScreen (){ 
    const [corporation_stats, setCorporationStats] = useState();

    async function fetchCorporationStats() {
        await axios.get("http://localhost:3001/corporation/stats")
            .then((res) => {
                console.log(res);
                setCorporationStats(res.data);
            }).catch((err) => {
                console.log(err);
            });
    }

    useEffect(() => {
        if (!corporation_stats) {
            fetchCorporationStats();
        }
        
    }, [corporation_stats]);


    return(
        <div className="center-block" style={{width:"75%"}}>
            <Card> 
            <Card.Body style={{padding:"10px"}}>
                <Card.Title align="center">Corporation Stats</Card.Title>
                <div style={{padding:"15px"}}>
                    <table className="table table-striped table-bordered" style={{fontSize:"10pt"}}>
                            <thead className="table-dark">
                                <tr>
                                    <th>Corporation ID</th>
                                    <th>Short Name</th>
                                    <th>Formal Name</th>
                                    <th>Number of Banks</th>
                                    <th>Corporation Assets $</th>
                                    <th>Total Assets $</th>
                                </tr>
                            </thead>
                            <tbody>
                            {corporation_stats && corporation_stats.map(corporation =>
                                    <tr key={corporation.corporation_identifier}>
                                        <td>{corporation.corporation_identifier}</td>
                                        <td>{corporation.short_name}</td>
                                        <td>{corporation.formal_name}</td>
                                        <td>{corporation.number_of_banks}</td>
                                        <td>{corporation.corporation_assets}</td>
                                        <td>{corporation.total_assets}</td>
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

export default CorporataionStatsScreen;
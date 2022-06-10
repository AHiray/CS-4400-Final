import React, { useState, useEffect } from 'react'
import axios from "axios";
import { Card } from 'react-bootstrap';

function EmployeeStatsScreen (){ 
    const [employee_stats, setEmployeeStats] = useState();

    async function fetchEmployeeStats() {
        await axios.get("http://localhost:3001/employee/stats")
            .then((res) => {
                console.log(res);
                setEmployeeStats(res.data);
            }).catch((err) => {
                console.log(err);
            });
    }

    useEffect(() => {
        if (!employee_stats) {
            fetchEmployeeStats();
        }
        
    }, [employee_stats]);

    return(
        <div className="center-block" style={{width:"75%"}}>
            <Card> 
            <Card.Body style={{padding:"10px"}}>
                <Card.Title align="center">Employee Stats</Card.Title>
                <div style={{padding:"15px"}}>
                    <table className="table table-striped table-bordered" style={{fontSize:"10pt"}}>
                            <thead className="table-dark">
                                <tr>
                                    <th>Per ID</th>
                                    <th>Tax ID</th>
                                    <th>Name</th>
                                    <th>DOB</th>
                                    <th>Date Joined</th>
                                    <th>Street</th>
                                    <th>City</th>
                                    <th>State</th>
                                    <th>Zip</th>
                                    <th>Number of Banks</th>
                                    <th>Bank Assets $</th>
                                </tr>
                            </thead>
                            <tbody>
                            {employee_stats && employee_stats.map(employee =>
                                    <tr key={employee.person_identifier}>
                                        <td>{employee.person_identifier}</td>
                                        <td>{employee.tax_identifier}</td>
                                        <td>{employee.employee_name}</td>
                                        <td>{employee.date_of_birth}</td>
                                        <td>{employee.joined_system}</td>
                                        <td>{employee.street}</td>
                                        <td>{employee.city}</td>
                                        <td>{employee.state}</td>
                                        <td>{employee.zip}</td>
                                        <td>{employee.number_of_banks}</td>
                                        <td>{employee.bank_assets}</td>
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

export default EmployeeStatsScreen;
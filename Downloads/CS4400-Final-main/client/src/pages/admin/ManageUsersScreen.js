import "../../css/Screens.css"
import { Card } from 'react-bootstrap';
import { Link } from "react-router-dom";


function ManageUsersScreen() {

    return (
        
        <div className="center-block">
            <Card> 
            <Card.Body style={{padding:"10px"}}>
                <Card.Title align="center">Manager Menu</Card.Title>

                <div className='row' style={{padding:"20px"}}>
                    <div className="col" align="center">
                        <Link to="/create-employee-role">
                        <button type="submit" style={{width:"50%"}} className="btn btn-dark">Create Employee Role</button>
                        </Link>
                    </div>
                </div>

                <div className='row' style={{padding:"20px"}}>
                    <div className="col" align="center">
                        <Link to="/create-customer-role">
                        <button type="submit" style={{width:"50%"}} className="btn btn-dark">Create Customer Role</button>
                        </Link>
                    </div>
                </div>

                <div className='row' style={{padding:"20px"}}>
                    <div className="col" align="center">
                        <Link to="/stop-employee-role">
                        <button type="submit" style={{width:"50%"}} className="btn btn-dark">Stop Employee Role</button>
                        </Link>
                    </div>
                </div>

                <div className='row' style={{padding:"20px"}}>
                    <div className="col" align="center">
                        <Link to="/stop-customer-role">
                        <button type="submit" style={{width:"50%"}} className="btn btn-dark">Stop Customer Role</button>
                        </Link>
                    </div>
                </div>
            </Card.Body>
            </Card>
        </div>
        
    )
}

export default ManageUsersScreen;

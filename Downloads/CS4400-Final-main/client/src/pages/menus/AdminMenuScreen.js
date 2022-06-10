import "../../css/Screens.css"
import { Card } from 'react-bootstrap';
import { Link } from "react-router-dom";


function AdminMenuScreen() {

    return (
        
        <div className="center-block">
            <Card> 
            <Card.Body style={{padding:"10px"}}>
                <Card.Title align="center">Admin Menu</Card.Title>

                <div className='row' style={{padding:"20px"}}>
                    <div className="col" align="center">
                        <Link to="/view-stats">
                        <button type="submit" style={{width:"50%"}} className="btn btn-dark">View Stats</button>
                        </Link>
                    </div>
                </div>

                <div className='row' style={{padding:"20px"}}>
                    <div className="col" align="center">
                        <Link to="/corporation-create">
                        <button type="submit" style={{width:"100%"}} className="btn btn-dark">Create Corporation</button>
                        </Link>
                    </div>

                    <div className="col" align="center">
                        <Link to="/create-fee">
                        <button type="submit" style={{width:"100%"}} className="btn btn-dark">Create Fee</button>
                        </Link>
                    </div>

                </div>

                <div className='row' style={{padding:"20px"}}>
                    <div className="col" align="center">
                        <Link to="/manage-users">
                        <button type="submit" style={{width:"100%"}} className="btn btn-dark">Manage Users</button>
                        </Link>
                    </div>

                    <div className="col" align="center">
                        <Link to="/manage-overdraft">
                        <button type="submit" style={{width:"100%"}} className="btn btn-dark">Manage Overdraft</button>
                        </Link>
                    </div>

                </div>

                <div className='row' style={{padding:"20px"}}>
                    <div className="col" align="center">
                        <Link to="/hire-worker">
                        <button type="submit" style={{width:"100%"}} className="btn btn-dark">Hire Worker</button>
                        </Link>
                    </div>

                    <div className="col" align="center">
                        <Link to="/pay-employees">
                        <button type="submit" style={{width:"100%"}} className="btn btn-dark">Pay Employees</button>
                        </Link>
                    </div>

                </div>

                <div className='row' style={{padding:"20px"}}>
                    <div className="col" align="center">
                        <Link to="/replace-manager">
                        <button type="submit" style={{width:"100%"}} className="btn btn-dark">Replace Manager</button>
                        </Link>
                    </div>

                    <div className="col" align="center">
                        <Link to="/manage-accounts">
                        <button type="submit" style={{width:"100%"}} className="btn btn-dark">Manage Account Access</button>
                        </Link>
                    </div>

                </div>

                <div className='row' style={{padding:"20px"}}>
                    <div className="col" align="center">
                        <Link to="/bank-create">
                        <button type="submit" style={{width:"100%"}} className="btn btn-dark">Create Bank</button>
                        </Link>
                    </div>

                    <div className="col" align="center">
                        <Link to="/create-accounts">
                        <button type="submit" style={{width:"100%"}} className="btn btn-dark">Create Accounts</button>
                        </Link>
                    </div>
                </div>
            </Card.Body>
            </Card>
        </div>
        
    )
}

export default AdminMenuScreen;

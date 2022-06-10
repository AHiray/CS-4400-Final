import "../../css/Screens.css"
import { Card } from 'react-bootstrap';
import { Link } from "react-router-dom";

function CustomerMenuScreen() {

    return (
        
        <div className="center-block">
            <Card> 
            <Card.Body style={{padding:"10px"}}>
                <Card.Title align="center">Customer Menu</Card.Title>

                <div className='row' style={{padding:"20px"}}>
                    <div className="col" align="center">
                        <Link to="/manage-accounts">
                        <button type="submit" style={{width:"50%"}} className="btn btn-dark">Manage Accounts</button>
                        </Link>
                    </div>
                </div>

                <div className='row' style={{padding:"20px"}}>
                    <div className="col" align="center">
                        <Link to="/deposit-withdraw">
                        <button type="submit" style={{width:"50%"}} className="btn btn-dark">Depost / Withdrawals</button>
                        </Link>
                    </div>
                </div>

                <div className='row' style={{padding:"20px"}}>
                    <div className="col" align="center">
                        <Link to="/manage-overdraft">
                        <button type="submit" style={{width:"50%"}} className="btn btn-dark">Manage Overdraft</button>
                        </Link>
                    </div>
                </div>

                <div className='row' style={{padding:"20px"}}>
                    <div className="col" align="center">
                        <Link to="/transfer">
                        <button type="submit" style={{width:"50%"}} className="btn btn-dark">Make Transfer</button>
                        </Link>
                    </div>
                </div>

            </Card.Body>
            </Card>
        </div>


    )
}

export default CustomerMenuScreen;

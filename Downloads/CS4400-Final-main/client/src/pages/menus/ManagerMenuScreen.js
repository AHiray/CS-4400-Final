import "../../css/Screens.css"
import { Card } from 'react-bootstrap';
import { Link } from "react-router-dom";


function ManagerMenuScreen() {

    return (
        
        <div className="center-block">
            <Card> 
            <Card.Body style={{padding:"10px"}}>
                <Card.Title align="center">Manager Menu</Card.Title>

                <div className='row' style={{padding:"20px"}}>
                    <div className="col" align="center">
                        <Link to="/pay-employees">
                        <button type="submit" style={{width:"50%"}} className="btn btn-dark">Pay Employees</button>
                        </Link>
                    </div>
                </div>

                <div className='row' style={{padding:"20px"}}>
                    <div className="col" align="center">
                        <Link to="/hire-worker">
                        <button type="submit" style={{width:"50%"}} className="btn btn-dark">Hire Worker</button>
                        </Link>
                    </div>
                </div>

            </Card.Body>
            </Card>
        </div>


    )
}

export default ManagerMenuScreen;

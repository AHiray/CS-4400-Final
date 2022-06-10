import "../../../css/Screens.css"
import { Card } from 'react-bootstrap';
import { Link } from "react-router-dom";


function ViewStatsScreen() {

    return (
        
        <div className="center-block">
            <Card> 
            <Card.Body style={{padding:"10px"}}>
                <Card.Title align="center">View Stats</Card.Title>

                <div className='row' style={{padding:"20px"}}>
                    <div className="col" align="center">
                        <Link to="/account-stats">
                        <button type="submit" style={{width:"50%"}} className="btn btn-dark">Display Account Stats</button>
                        </Link>
                    </div>
                </div>

                <div className='row' style={{padding:"20px"}}>
                    <div className="col" align="center">
                        <Link to="/corporation-stats">
                        <button type="submit" style={{width:"50%"}} className="btn btn-dark">Display Corporation Stats</button>
                        </Link>
                    </div>
                </div>

                <div className='row' style={{padding:"20px"}}>
                    <div className="col" align="center">
                        <Link to="/bank-stats">
                        <button type="submit" style={{width:"50%"}} className="btn btn-dark">Display Bank Stats</button>
                        </Link>
                    </div>
                </div>

                <div className='row' style={{padding:"20px"}}>
                    <div className="col" align="center">
                        <Link to="/customer-stats">
                        <button type="submit" style={{width:"50%"}} className="btn btn-dark">Display Customer Stats</button>
                        </Link>
                    </div>
                </div>

                <div className='row' style={{padding:"20px"}}>
                    <div className="col" align="center">
                        <Link to="/employee-stats">
                        <button type="submit" style={{width:"50%"}} className="btn btn-dark">Display Employee Stats</button>
                        </Link>
                    </div>
                </div>


            </Card.Body>
            </Card>
        </div>


    )
}

export default ViewStatsScreen;

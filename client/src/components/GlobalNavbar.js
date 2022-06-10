import { useEffect, useRef, React, useState} from "react";
import { Navbar, Container, Nav, Offcanvas } from 'react-bootstrap';
import { Link, useNavigate} from "react-router-dom";

const GlobalNavbar = () => {
    const navigate = useNavigate();
    const [expanded, setExpanded] = useState(false);


    const loggedIn = useRef(sessionStorage.getItem("isLoggedIn"));
    const userTypes = useRef(sessionStorage.getItem("userTypes"));

    useEffect(() => {
        loggedIn.current = sessionStorage.getItem("isLoggedIn");
        userTypes.current = sessionStorage.getItem("userTypes"); 

    });

    const handleLogout = (e) => {
        
        console.log("User Logged Out")
        sessionStorage.clear();
        sessionStorage.setItem("isLoggedIn", "false");

        loggedIn.current = sessionStorage.getItem("isLoggedIn");
        userTypes.current = sessionStorage.getItem("userTypes"); 
        navigate("/login")
    };

    const onExpand = () => {
        setExpanded(!expanded)
        loggedIn.current = sessionStorage.getItem("isLoggedIn");
        userTypes.current = sessionStorage.getItem("userTypes"); 
        console.log(loggedIn, userTypes)
    }

    return (
            <div>
            <Navbar bg="dark" expand={false} variant="dark" onToggle={onExpand} expanded={expanded} fixed="top">
            <Container fluid>
                <Navbar.Brand as={Link} to="/">Bank Management</Navbar.Brand>
                <Navbar.Toggle aria-controls="offcanvasNavbar"/>
                <Navbar.Offcanvas
                id="offcanvasNavbar"
                aria-labelledby="offcanvasNavbarLabel"
                placement="end"
                >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title id="offcanvasNavbarLabel">Bank Management</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Nav justify variant="pills" onClick={() => setExpanded(!expanded)}>    
                        <Nav.Item>
                            <Nav.Link as={Link} to="/">Home Menu</Nav.Link>  
                        </Nav.Item>    

                        {(function() {
                            if (loggedIn.current === "true" && userTypes.current.includes("admin")) {
                                return (
                                    <Nav.Item>
                                        <Nav.Link as={Link} to="/view-stats">View Stats</Nav.Link>   
                                        <Nav.Link as={Link} to="/corporation-create">Create Corporation</Nav.Link>
                                        <Nav.Link as={Link} to="/create-fee">Create Fee</Nav.Link>
                                        <Nav.Link as={Link} to="/manage-users">Manage Users</Nav.Link>
                                        <Nav.Link as={Link} to="/manage-overdraft">Manage Overdraft</Nav.Link>
                                        <Nav.Link as={Link} to="/hire-worker">Hire Worker</Nav.Link>
                                        <Nav.Link as={Link} to="/pay-employees">Pay Employees</Nav.Link>
                                        <Nav.Link as={Link} to="/replace-manager">Replace Manager</Nav.Link>
                                        <Nav.Link as={Link} to="/manage-accounts">Manage Accounts</Nav.Link>
                                        <Nav.Link as={Link} to="/create-accounts">Create Accounts</Nav.Link>
                                        <Nav.Link as={Link} to="/bank-create">Create Bank</Nav.Link>
                                    </Nav.Item>
                                );
                            }
                        })()}

                        {(function() {
                            if (loggedIn.current === "true" && userTypes.current.includes("manager")) {
                                return (
                                    <Nav.Item>
                                        <Nav.Link as={Link} to="/pay-employee">Pay Employee</Nav.Link>   
                                        <Nav.Link as={Link} to="/hire-worker">Hire Worker</Nav.Link>   
                                    </Nav.Item>
                                );
                            }
                        })()}

                        {(function() {
                            if (loggedIn.current === "true" && userTypes.current.includes("customer")) {
                                return (
                                    <Nav.Item>
                                        <Nav.Link as={Link} to="/manage-accounts">Manage Accounts</Nav.Link>   
                                        <Nav.Link as={Link} to="/deposit-withdraw">Deposit / Withdrawal</Nav.Link>
                                        <Nav.Link as={Link} to="/manage-overdraft">Manage Overdraft</Nav.Link>   
                                        <Nav.Link as={Link} to="/transfer">Make Transfer</Nav.Link>   
                                    </Nav.Item>
                                );
                            }
                        })()}

                        {(function() {

                            if(loggedIn.current === "true") {
                                return (
                                    <Nav.Item >
                                        <button onClick={handleLogout} className="btn btn-dark" style={{margin:"10px", width:"75%"}}>Logout</button>
                                    </Nav.Item>
                                )
                            } else {
                                return (
                                    <Nav.Item >
                                        <button onClick={() => navigate("/login")} className="btn btn-dark" style={{margin:"10px", width:"75%"}}>Login</button>
                                    </Nav.Item>
                                )
                            }

                        })()}

                    </Nav>

                </Offcanvas.Body>
                </Navbar.Offcanvas>
            </Container>
            </Navbar>
            </div>

    )
}   

export default GlobalNavbar;
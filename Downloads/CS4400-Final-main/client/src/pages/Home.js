import { useEffect, useRef} from "react";
import { useNavigate } from "react-router-dom";
import AdminMenuScreen from "./menus/AdminMenuScreen";
import CustomerMenuScreen from "./menus/CustomerMenuScreen";
import ManagerMenuScreen from "./menus/ManagerMenuScreen";

function Home() {
    const loggedIn = useRef(sessionStorage.getItem("isLoggedIn"));
    const userTypes = useRef(sessionStorage.getItem("userTypes"));
    const navigate = useNavigate();

    useEffect(() => {
        loggedIn.current = sessionStorage.getItem("isLoggedIn");
        userTypes.current = sessionStorage.getItem("userTypes");
        console.log(userTypes.current)

        if(!loggedIn.current || loggedIn.current === "false") {
            navigate("/login");
        }
    });


    if(loggedIn.current !== "true") {
        return (
            <>
            </>
        )
    } else {
        return (
            <div>
                {userTypes.current.includes("admin") ? (
                    <>
                    <AdminMenuScreen/>
                    </>
                ) : <></>}

                {userTypes.current.includes("manager") ? (
                    <ManagerMenuScreen/>
                ) : <></>}

                {userTypes.current.includes("customer") ? (
                    <CustomerMenuScreen/>
                ) : <></>}

                <div style={{paddingTop:"5%"}}/>
            </div>
        )
    }
}
export default Home;
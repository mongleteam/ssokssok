import {Routes, Route} from "react-router-dom";
import Signup from "../pages/main/Signup"
import Login from "../pages/main/Login"

const AuthRoutes = () => {
    return (
        <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login/>}/>
        </Routes>
    );
};

export default AuthRoutes;
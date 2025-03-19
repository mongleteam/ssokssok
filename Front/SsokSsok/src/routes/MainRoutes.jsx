import {Routes, Route} from "react-router-dom";
import Main from "../pages/main/MainPage"

const MainRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Main />} />
        </Routes>
    );
};

export default MainRoutes;
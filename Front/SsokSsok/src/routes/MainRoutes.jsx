import {Routes, Route} from "react-router-dom";
import Main from "../pages/main/MainPage"

const MainRoutes = () => {
    return (
        <Routes>
            <Route path="/main" element={<Main />} />
        </Routes>
    );
};

export default MainRoutes;
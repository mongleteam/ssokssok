import {Routes, Route} from "react-router-dom";
import MainPage from "../pages/main/MainPage"
import MyAlbumPage from "../pages/main/MyAlbumPage";

const MainRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="myalbum" element={<MyAlbumPage />} />
        </Routes>
    );
};

export default MainRoutes;
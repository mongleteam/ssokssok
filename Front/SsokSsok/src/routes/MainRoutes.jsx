import {Routes, Route} from "react-router-dom";
import MainPage from "../pages/main/MainPage"
import MyAlbumPage from "../pages/main/MyAlbumPage";
import BookStartPage from "../pages/main/BookStartPage";

const MainRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="myalbum" element={<MyAlbumPage />} />
            <Route path="bookstart/hansel" element={<BookStartPage />} />
        </Routes>
    );
};

export default MainRoutes;
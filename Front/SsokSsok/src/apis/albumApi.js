import { authApi } from "./axiosConfig";

export const getAlbumApi = () => {
    return authApi.get("myalbum")
}


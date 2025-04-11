import { authApi } from "./axiosConfig";

export const getAlbumApi = () => {
    return authApi.get("myalbum")
}

export const deleteAlbumApi = (body) => {
    return authApi.post("myalbum", body)
}




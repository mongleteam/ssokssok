import { authApi } from "./axiosConfig";

export const sendInviteApi = (friendId) => {
    return authApi.post("/multi/regist", {friendId});
  };
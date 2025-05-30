import { authApi } from "./axiosConfig";

export const sendInviteApi = (friendId) => {
    return authApi.post("/multi/regist", {friendId});
  };

export const createProgressApi = async (data) => {
  return await authApi.post("/fairytale/create", data);
};

export const updateProgressApi = (progressPk, body) => {
  return authApi.patch(`/fairytale/${progressPk}`, body);
};

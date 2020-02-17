const token = JSON.parse(sessionStorage.getItem("userInfo")!);

export const config = {
  headers: {'Authorization': "Bearer " + token}
};

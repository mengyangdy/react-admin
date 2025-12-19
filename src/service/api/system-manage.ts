import request from "../request";

export const getUserList;
(data:){
  return request.get('/user/list',data)
}

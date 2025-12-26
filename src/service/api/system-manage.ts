import request from "../request";

export function fetchGetUserList(data: Api.SystemManage.UserSearchParams) {
  return request.get<Api.SystemManage.SystemUserResponse>(
    "/systemManage/getUserList",
    {
      params: data,
    }
  );
}

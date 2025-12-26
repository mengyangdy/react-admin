import { createOtherServiceRequest } from "../request";

// 创建其他服务的请求实例（例如 demo 服务）
const demoRequest = createOtherServiceRequest("demo", {
  timeout: 5000,
  headers: {
    apifoxToken: "XL299LiMEDZ0H5h3A29PxwQXdMJqWyY2",
  },
});

export function fetchGetUserListByDemo(
  data: Api.SystemManage.UserSearchParams
) {
  return demoRequest.get<Api.SystemManage.SystemUserResponse>(
    "/systemManage/getUserList",
    {
      params: data,
    }
  );
}

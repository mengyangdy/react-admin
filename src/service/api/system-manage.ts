import request from "../request";

export function fetchGetUserList(data) {
	return request.get("/user/list", data);
}

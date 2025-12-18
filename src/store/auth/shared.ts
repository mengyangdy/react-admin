import { localStg } from "@/utils/storage.ts";

export function getToken() {
	return localStg.get("token") || "";
}

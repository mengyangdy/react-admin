import { transformRecordToOption } from "@/utils/common";

export const enableStatusRecord: Record<Api.Common.EnableStatus, string> = {
  "1": "启用",
  "2": "禁用",
};

export const enableStatusOptions = transformRecordToOption(enableStatusRecord);

export const userGenderRecord: Record<Api.SystemManage.UserGender, string> = {
  "1": "男",
  "2": "女",
};

export const userGenderOptions = transformRecordToOption(userGenderRecord);

export const menuTypeRecord: Record<Api.SystemManage.MenuType, string> = {
  "1": "目录",
  "2": "菜单",
};

export const menuTypeOptions = transformRecordToOption(menuTypeRecord);

export const menuIconTypeRecord: Record<Api.SystemManage.IconType, string> = {
  "1": "iconify图标",
  "2": "本地图标",
};

export const menuIconTypeOptions = transformRecordToOption(menuIconTypeRecord);

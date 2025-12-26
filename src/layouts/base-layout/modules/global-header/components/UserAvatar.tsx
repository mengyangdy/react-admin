import { useNavigate } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { Button, Dropdown, type MenuProps } from "antd";

import { useUserInfo } from "@/service/hooks";
import { authStore } from "@/store/auth";

const UserAvatar = () => {
  const navigate = useNavigate();
  const token = useStore(authStore, (s) => s.token);
  const { data: userInfo } = useUserInfo();

  // 2. 获取实例
  const toLogin = useLoginRedirect();
  function logout() {
    window?.$modal?.confirm({
      cancelText: "取消",
      content: "确认退出登录吗?",
      okText: "确认",
      onOk: () => {
        toLogin();
      },
      title: "提示",
    });
  }
  function onClick({ key }: { key: string }) {
    if (key === "1") {
      logout();
    } else {
      navigate({
        to: "/account/center",
      });
    }
  }

  function loginOrRegister() {
    toLogin();
  }

  const items: MenuProps["items"] = [
    {
      key: "0",
      label: (
        <div className="flex-center gap-8px">
          <SvgIcon className="text-icon" icon="ph:user-circle" />
          个人中心
        </div>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "1",
      label: (
        <div className="flex-center gap-8px">
          <SvgIcon className="text-icon" icon="ph:sign-out" />
          退出登录
        </div>
      ),
    },
  ];

  return token ? (
    <Dropdown
      menu={{ items, onClick }}
      placement="bottomRight"
      trigger={["click"]}
    >
      <div>
        <ButtonIcon className="px-12px">
          <SvgIcon className="text-icon-large" icon="ph:user-circle" />
          <span className="text-16px font-medium">
            {userInfo?.data?.username}
          </span>
        </ButtonIcon>
      </div>
    </Dropdown>
  ) : (
    <Button onClick={loginOrRegister}>登录 / 注册</Button>
  );
};

export default UserAvatar;

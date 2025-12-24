import { Button, Checkbox, Flex, Form, Input } from "antd";

import DarkModeContainer from "@/components/DarkModeContainer";
import SvgIcon from "@/components/SvgIcon";
import SystemLogo from "@/components/SystemLogo";
import { authActions } from "@/store/auth";
import { useThemeState } from "@/store/theme";

import IKun from "./components/ikun";

function Login() {
  const themeStore = useThemeState();
  const via = themeStore.darkMode ? "#07070915" : "#D5E6FF";
  const title = import.meta.env.VITE_APP_TITLE;
  const { loading, toLogin } = authActions.useInitAuth();

  const onFinish = (values: {
    username: string;
    password: string;
    remember?: boolean;
  }) => {
    const { remember, ...loginParams } = values;
    toLogin(loginParams);
  };

  return (
    <DarkModeContainer>
      <div className="h-screen w-full flex bg-white">
        {/* 左侧装饰区域 - 大屏幕显示 */}
        <div className="hidden lg:flex w-[62%] relative overflow-hidden">
          {/* 主背景 */}
          <div
            className="absolute inset-0 blur-2xl"
            style={{
              background: `linear-gradient(154deg,#07070915 30%,${via} 60%,#07070915 10%)`,
            }}
          />
          <div className="relative z-10 w-full flex flex-col">
            <div className="flex items-center gap-3 p-8">
              <SystemLogo className="w-8 h-8" />
              <span className="text-xl font-semibold text-gray-800">
                {title}
              </span>
            </div>
            <div className="flex-grow flex items-center justify-center">
              <div className="w-[85%] max-w-[480px] mt-[-100px]">
                <div className="login-illustration relative">
                  <div className="relative z-10">
                    <IKun />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* 右侧登录表单区域 */}
        <div className="w-full lg:w-[38%] flex flex-col">
          <div className="flex-grow flex items-center justify-center">
            <div className="w-full max-w-[420px] px-6 lg:px-12 box-content">
              <div className="lg:hidden flex items-center justify-center gap-2 mb-12">
                <SystemLogo className="w-8 h-8" />
                <span className="text-xl font-semibold text-gray-900">
                  {title}
                </span>
              </div>
              <div className="mb-12">
                <h1 className="text-3xl font-bold text-gray-900">账号登录</h1>
                <p className="mt-3 text-base text-gray-500">
                  请使用您的账号密码登录系统
                </p>
              </div>
              <Form
                name="login"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                layout="vertical"
                size="large"
              >
                <Form.Item
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "请输入用户名",
                    },
                  ]}
                >
                  <Input
                    prefix={<SvgIcon icon="ant-design:user-outlined" />}
                    placeholder="请输入用户名"
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: "请输入密码" }]}
                >
                  <Input
                    prefix={<SvgIcon icon="ant-design:lock-outlined" />}
                    type="password"
                    placeholder="请输入密码"
                  />
                </Form.Item>
                <Form.Item>
                  <Flex justify="space-between" align="center">
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                      <Checkbox>记住我</Checkbox>
                    </Form.Item>
                    <Button type="link" className="p-0">
                      忘记密码
                    </Button>
                  </Flex>
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    loading={loading}
                  >
                    登录
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
          <div className="p-8 text-center text-gray-500 text-sm">
            Copyright © 2025 {title}
          </div>
        </div>
      </div>
    </DarkModeContainer>
  );
}

export default Login;

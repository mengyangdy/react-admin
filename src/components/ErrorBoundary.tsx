import { Button, Typography } from "antd";
import type { FallbackProps } from "react-error-boundary";

import { globalConfig } from "@/config.ts";

const { Text, Title } = Typography;
const theme = globalConfig.defaultThemeColor;

const ErrorPage = ({ error, resetErrorBoundary }: FallbackProps) => {
	return (
		<div className="size-full min-h-520px flex-col-center gap-16px overflow-hidden">
			<div className="flex text-400px text-primary">
				<SvgIcon localIcon="error" />
			</div>
			{globalConfig.isDev ? (
				<Text code>{error.message}</Text>
			) : (
				<Title level={3}>{`出错了，请稍后再试`}</Title>
			)}
			<Button
				style={{ backgroundColor: theme }}
				type="primary"
				onClick={resetErrorBoundary}
			>
				{`刷新重试`}
			</Button>
		</div>
	);
};

export default ErrorPage;

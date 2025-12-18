import { App } from "antd";
import type { PropsWithChildren } from "react";

function ContextHolder() {
	const { message, modal, notification } = App.useApp();
	window.$message = message;
	window.$modal = modal;
	window.$notification = notification;
	return null;
}

const AppContextHolder = ({ children }: PropsWithChildren) => {
	return (
		<App className="h-full">
			<ContextHolder />
			{children}
		</App>
	);
};

export default AppContextHolder;

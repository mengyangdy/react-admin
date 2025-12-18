import { Link } from "@tanstack/react-router";
import clsx from "clsx";
import type { ComponentProps } from "react";

interface Props extends Omit<ComponentProps<typeof Link>, "to"> {
	showTitle?: boolean;
}

const GlobalLogo: FC<Props> = ({ className, showTitle = true, ...props }) => {
	return (
		<Link
			className={clsx("w-full flex-center nowrap-hidden", className)}
			to={import.meta.env.VITE_ROUTE_HOME}
			{...props}
		>
			<SystemLogo className="text-32px text-primary" />
			<h2
				className="pl-8px text-16px text-primary font-bold transition duration-300 ease-in-out"
				style={{
					display: showTitle ? "block" : "none",
				}}
			>
				后台管理系统
			</h2>
		</Link>
	);
};

export default GlobalLogo;

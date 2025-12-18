import ButtonIcon from "@/components/ButtonIcon.tsx";

interface Props {
	className?: string;
	full?: boolean;
	toggleFullscreen: () => void;
}

const FullScreen = ({ className, full, toggleFullscreen }: Props) => {
	return (
		<ButtonIcon
			className={className}
			tooltipContent={full ? "退出全屏" : "全屏"}
			onClick={toggleFullscreen}
		>
			{full ? <IconGridiconsFullscreenExit /> : <IconGridiconsFullscreen />}
		</ButtonIcon>
	);
};

export default FullScreen;

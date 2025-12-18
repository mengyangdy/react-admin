import { useState } from "react";

type OnClick = () => void;

export function useTap(onClick: OnClick) {
	const [touchStart, setTouchStart] = useState(false);

	const handleTouchStart = (e: React.TouchEvent) => {
		setTouchStart(true);
	};
	const handleTouchEnd = () => {
		if (touchStart) {
			onClick();
		}
		setTouchStart(false);
	};
	const handleTouchMove = () => {
		setTouchStart(false);
	};

	return {
		onTouchEnd: handleTouchEnd,
		onTouchMove: handleTouchMove,
		onTouchStart: handleTouchStart,
	};
}

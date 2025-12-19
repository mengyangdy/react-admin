import { createPortal } from "react-dom";

import { GLOBAL_HEADER_MENU_ID } from "@/constants/app";

import AntdHorizontalMenu from "../components/AntdHorizontalMenu";
import { HorizontalMenuMode } from "../types";
import { useGetElementById } from "./hook";

interface Props {
	readonly mode?: HorizontalMenuMode;
}

const HorizontalMenu = ({ mode = HorizontalMenuMode.All }: Props) => {
	const container = useGetElementById(GLOBAL_HEADER_MENU_ID);
	if (!container) return null;
	return createPortal(<AntdHorizontalMenu mode={mode} />, container);
};

export default HorizontalMenu;

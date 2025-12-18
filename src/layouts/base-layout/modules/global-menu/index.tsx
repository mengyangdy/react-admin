import HorizontalMenu from "./modules/HorizontalMenu";
import HorizontalMix from "./modules/HorizontalMix";
import ReversedHorizontalMix from "./modules/ReversedHorizontalMix";
import VerticalMenu from "./modules/VerticalMenu";
import VerticalMix from "./modules/VerticalMix.tsx";

interface Props {
	mode: UnionKey.ThemeLayoutMode;
	reverse: boolean;
}

const GlobalMenu = ({ mode, reverse }: Props) => {
	if (mode === "horizontal") return <HorizontalMenu />;
	if (mode === "horizontal-mix") return reverse ? <ReversedHorizontalMix /> : <HorizontalMix />;
	if (mode === "vertical") return <VerticalMenu />;
	return <VerticalMix />;
};

export default GlobalMenu;

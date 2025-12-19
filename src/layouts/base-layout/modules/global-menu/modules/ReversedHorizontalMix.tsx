import { HorizontalMenuMode } from "../types";
import Horizontal from "./HorizontalMenu";
import Vertical from "./VerticalMenu";

const ReversedHorizontalMix = () => {
	return [
		<Vertical key="vertical" />,

		<Horizontal
			key="ReversedHorizontalMix "
			mode={HorizontalMenuMode.FirstLevel}
		/>,
	];
};
export default ReversedHorizontalMix;

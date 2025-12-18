import MenuProvider from "@/features/menu/MenuProvider.tsx";

import BaseLayout from "./BaseLayout";

const index = () => {
	return (
		<MenuProvider>
			<BaseLayout />
		</MenuProvider>
	);
};

export default index;

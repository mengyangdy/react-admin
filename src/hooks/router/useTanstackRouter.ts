import { useRouter } from "@tanstack/react-router";

export const useTanstackRouter = () => {
	const { routeTree } = useRouter();

	return {
		routeTree,
	};
};

import { useMatches } from "@tanstack/react-router";

export const useCurrentRoute = () => {
	const matches = useMatches();
	const route = matches.at(-1);
	const matched = matches.slice(1);
	return { route, matched };
};

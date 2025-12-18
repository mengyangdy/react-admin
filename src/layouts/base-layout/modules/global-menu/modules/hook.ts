import { useStore } from "@tanstack/react-store";

import { themeStore } from "@/store/theme";

export function useGetElementById(id: string) {
	const [container, setContainers] = useState<HTMLElement | null>();
	const isMobile = useStore(themeStore, (s) => s.isMobile);
	useEffect(() => {
		const element = document.getElementById(id);
		setContainers(element);
	}, [isMobile]);
	return container;
}

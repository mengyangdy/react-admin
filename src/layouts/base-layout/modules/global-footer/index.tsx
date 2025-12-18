import DarkModeContainer from "@/components/DarkModeContainer.tsx";

const GlobalFooter = () => {
	return (
		<DarkModeContainer className="h-full flex-center">
			<a
				href="https://github.com/mengyangdy"
				rel="noopener noreferrer"
			>
				Copyright MIT © 2025
			</a>
		</DarkModeContainer>
	);
};

export default GlobalFooter;

const TabReloadButton = () => {
	const { isReload, reloadPage } = useReloadPage();
	return (
		<ButtonIcon
			tooltipContent="刷新页面"
			onClick={reloadPage}
		>
			<IconAntDesignReloadOutlined
				className={isReload ? "animate-spin animate-duration-750" : ""}
			/>
		</ButtonIcon>
	);
};
export default TabReloadButton;

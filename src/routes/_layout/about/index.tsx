import { createFileRoute } from "@tanstack/react-router";
import { Card, Space, Tag } from "antd";

import { TypingAnimation } from "@/components/TypingAnimation";

import {
	type CardInfo,
	type PkgJson,
	type PkgVersionInfo,
	transformVersionData,
} from "./about.utils";
import HeaderDescription from "./components/header-description";
import pkg from "~/package.json";

const latestBuildTime = BUILD_TIME;

// 解构 package.json 数据
const { dependencies, devDependencies, name, version } = pkg;

// 格式化 package.json 数据
const pkgJson: PkgJson = {
	dependencies: Object.entries(dependencies).map(transformVersionData),
	devDependencies: Object.entries(devDependencies).map(transformVersionData),
	name,
	version,
};

// 抽离渲染组件
const TagItem = ({ nameOrHref }: PkgVersionInfo) => <Tag color="blue">{nameOrHref}</Tag>;

// 获取卡片信息的自定义 Hook
function useGetCardInfo(): CardInfo[] {
	// 项目基本信息
	const packageInfo: PkgVersionInfo[] = [
		{
			label: "版本",
			nameOrHref: pkgJson.version,
			render: TagItem,
		},
		{
			label: "最新构建时间",
			nameOrHref: latestBuildTime,
			render: TagItem,
		},
	];

	// 卡片信息配置
	return [
		{
			content: packageInfo,
			title: "项目信息",
		},
		{
			content: pkgJson.dependencies,
			title: "生产依赖",
		},
		{
			content: pkgJson.devDependencies,
			title: "开发依赖",
		},
	];
}

const About = () => {
	const cardInfo = useGetCardInfo();
	return (
		<Space
			className="w-full"
			orientation="vertical"
			size={16}
		>
			<Card
				className="card-wrapper"
				size="small"
				title="关于"
				variant="borderless"
			>
				<TypingAnimation className="h-54px text-12px">
					Admin 是一个优雅且功能强大的后台管理模板，基于最新的前端技术栈，包括 React19.0, Vite7,
					TypeScript,和UnoCSS。它内置了丰富的主题配置和组件，代码规范严谨，实现了自动化的文件路由系统。Admin
					为您提供了一站式的后台管理解决方案，无需额外配置，开箱即用。同样是一个快速学习前沿技术的最佳实践。
				</TypingAnimation>
			</Card>
			{cardInfo.map(HeaderDescription)}
		</Space>
	);
};

export const Route = createFileRoute("/_layout/about/")({
	component: About,
	staticData: {
		title: "关于",
		icon: "fluent:book-information-24-regular",
		hideInMenu: false,
		order: 100,
	},
});

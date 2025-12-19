import { createFileRoute } from "@tanstack/react-router";
import { Col, Row, Space } from "antd";

import CardData from "@/routes/_layout/home/components/CardData.tsx";
import LineChart from "@/routes/_layout/home/components/LineChart.tsx";
import PieChart from "@/routes/_layout/home/components/PieChart.tsx";
import ProjectNews from "@/routes/_layout/home/components/ProjectNews.tsx";

import CreativityBanner from "./components/CreativityBanner";
import HeaderBanner from "./components/HeaderBanner";

export const Route = createFileRoute("/_layout/home/")({
	component: Home,
	staticData: {
		title: "首页",
		icon: "mdi:monitor-dashboard",
		hideInMenu: false,
		order: 1,
	},
});

function Home() {
	return (
		<Space
			className="w-full"
			orientation="vertical"
			size={[16, 16]}
		>
			<HeaderBanner />
			<CardData />
			<Row gutter={[16, 16]}>
				<Col
					lg={14}
					span={24}
				>
					<LineChart />
				</Col>
				<Col
					lg={10}
					span={24}
				>
					<PieChart />
				</Col>
			</Row>
			<Row gutter={[16, 16]}>
				<Col
					lg={14}
					span={24}
				>
					<ProjectNews />
				</Col>
				<Col
					lg={10}
					span={24}
				>
					<CreativityBanner />
				</Col>
			</Row>
		</Space>
	);
}

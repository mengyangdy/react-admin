import { Col, Row, Space } from "antd";

import CardData from "./components/CardData";
import CreativityBanner from "./components/CreativityBanner";
import HeaderBanner from "./components/HeaderBanner";
import LineChart from "./components/LineChart";
import PieChart from "./components/PieChart";
import ProjectNews from "./components/ProjectNews";

function Home() {
  return (
    <Space className="w-full" orientation="vertical" size={[16, 16]}>
      <HeaderBanner />
      <CardData />
      <Row gutter={[16, 16]}>
        <Col lg={14} span={24}>
          <LineChart />
        </Col>
        <Col lg={10} span={24}>
          <PieChart />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col lg={14} span={24}>
          <ProjectNews />
        </Col>
        <Col lg={10} span={24}>
          <CreativityBanner />
        </Col>
      </Row>
    </Space>
  );
}

export default Home;

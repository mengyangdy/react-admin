import { Card, Descriptions } from "antd";

import type { CardInfo } from "../about.utils";

const HeaderDescription = (item: CardInfo) => {
	return (
		<Card
			className="card-wrapper"
			key={item.title}
			size="small"
			title={item.title}
			variant="borderless"
		>
			<Descriptions
				bordered
				column={{
					lg: 2,
					md: 2,
					sm: 2,
					xl: 2,
					xs: 1,
					xxl: 2,
				}}
				size="small"
			>
				{item.content.map((pkgInfo) => (
					<Descriptions.Item
						key={pkgInfo.label}
						label={pkgInfo.label}
					>
						{pkgInfo.render ? pkgInfo.render(pkgInfo) : pkgInfo.nameOrHref}
					</Descriptions.Item>
				))}
			</Descriptions>
		</Card>
	);
};

export default HeaderDescription;

import { Button, Col, Flex, Form, Input, Row, Select } from "antd";

import { enableStatusOptions, userGenderOptions } from "@/constants/business";
import { translateOptions } from "@/utils/common";

const UserSearch: FC<Page.SearchProps> = memo(({ form, reset, search, searchParams }) => {
	return (
		<Form
			form={form}
			initialValues={searchParams}
			labelCol={{
				md: 7,
				span: 5,
			}}
		>
			<Row
				wrap
				gutter={[16, 16]}
			>
				<Col
					lg={6}
					md={12}
					span={24}
				>
					<Form.Item
						className="m-0"
						label="用户名"
						name="username"
					>
						<Input placeholder="请输入用户名" />
					</Form.Item>
				</Col>
				<Col
					lg={6}
					md={12}
					span={24}
				>
					<Form.Item
						className="m-0"
						label="性别"
						name="gender"
					>
						<Select
							allowClear
							options={translateOptions(userGenderOptions)}
							placeholder="请选择性别"
						/>
					</Form.Item>
				</Col>
				<Col
					lg={6}
					md={12}
					span={24}
				>
					<Form.Item
						className="m-0"
						label="昵称"
						name="nickname"
					>
						<Input placeholder="请输入昵称" />
					</Form.Item>
				</Col>
				<Col
					lg={6}
					md={12}
					span={24}
				>
					<Form.Item
						className="m-0"
						label="手机号"
						name="phone"
					>
						<Input placeholder="请输入手机号" />
					</Form.Item>
				</Col>
				<Col
					lg={6}
					md={12}
					span={24}
				>
					<Form.Item
						className="m-0"
						label="邮箱"
						name="email"
					>
						<Input placeholder="请输入邮箱" />
					</Form.Item>
				</Col>
				<Col
					lg={6}
					md={12}
					span={24}
				>
					<Form.Item
						className="m-0"
						label="用户状态"
						name="status"
					>
						<Select
							allowClear
							options={translateOptions(enableStatusOptions)}
							placeholder="请选择用户状态"
						/>
					</Form.Item>
				</Col>
				<Col
					lg={12}
					span={24}
				>
					<Form.Item className="m-0">
						<Flex
							align="center"
							gap={12}
							justify="end"
						>
							<Button
								icon={<IconIcRoundRefresh />}
								onClick={reset}
							>
								重置
							</Button>
							<Button
								ghost
								icon={<IconIcRoundSearch />}
								type="primary"
								onClick={search}
							>
								搜索
							</Button>
						</Flex>
					</Form.Item>
				</Col>
			</Row>
		</Form>
	);
});

export default UserSearch;

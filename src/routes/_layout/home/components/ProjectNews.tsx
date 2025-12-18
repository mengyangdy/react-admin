import { Button, Card, Flex, Space, Typography } from "antd";
import { AnimatePresence, motion } from "framer-motion";

import SkyrocAvatar from "@/components/SkyrocAvatar";

const variants = {
  exit: { opacity: 0, transition: { duration: 0.3 }, x: 200 },
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, transition: { duration: 0.3 }, y: 0 },
};

const ProjectNews = () => {
  const [
    newses,
    { down, pop, push, remove, reset, reverse, shift, sort, unshift, up },
  ] = useArray([
    {
      content: `Dylanjs 在2021年5月28日创建了开源项目 skyroc-admin!`,
      id: 1,
      time: "2021-05-28 22:22:22",
    },
    {
      content: `Yanbowe 向 admin 提交了一个bug，多标签栏不会自适应。`,
      id: 2,
      time: "2023-10-27 10:24:54",
    },
    {
      content: `Dylanjs 准备为 skyroc-admin 的发布做充分的准备工作!`,
      id: 3,
      time: "2021-10-31 22:43:12",
    },
    {
      content: `Dylanjs 正在忙于为skyroc-admin写项目说明文档！`,
      id: 4,
      time: "2022-11-03 20:33:31",
    },
    {
      content: `Dylanjs 刚才把工作台页面随便写了一些，凑合能看了！`,
      id: 5,
      time: "2021-11-07 22:45:32",
    },
  ]);

  const sortByTimeDesc = () => {
    sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  };

  return (
    <Card
      className="card-wrapper"
      size="small"
      title="项目动态"
      variant="borderless"
      extra={[
        <Button key="reset" type="text" onClick={reset}>
          重置
        </Button>,
        <Button key="reverse" type="text" onClick={reverse}>
          反转
        </Button>,
        <Button key="sort" type="text" onClick={sortByTimeDesc}>
          以时间排序
        </Button>,
        <Button
          key="unshift"
          type="text"
          onClick={() =>
            unshift({
              content: "我是第一个",
              id: 1,
              time: "2021-11-07 22:45:32",
            })
          }
        >
          从头添加
        </Button>,
        <Button key="shift" type="text" onClick={shift}>
          删除头部
        </Button>,
        <Button
          key="PUSH"
          type="text"
          onClick={() =>
            push({ content: "我是第六个", id: 6, time: "2021-11-07 22:45:32" })
          }
        >
          尾部添加
        </Button>,
        <Button key="pop" type="text" onClick={pop}>
          删除尾部
        </Button>,
        <a className="ml-8px text-primary" key="a" href="/home">
          更多动态
        </a>,
      ]}
    >
      <AnimatePresence mode="popLayout">
        <Space className="w-full" orientation="vertical" role="list" size={0}>
          {newses.map((item, idx) => (
            <motion.div
              layout // 处理上移、下移等排序动画
              animate="visible" // 动画目标状态
              exit="exit" // 退出时动画
              initial="hidden" // 初始状态
              key={item.id}
              role="listitem"
              variants={variants} // 应用定义的动画 variants
            >
              <Flex
                align="center"
                className="py-10px"
                justify="space-between"
                style={{
                  borderBottom:
                    idx === newses.length - 1
                      ? undefined
                      : "1px solid rgba(5, 5, 5, 0.06)",
                }}
              >
                <Flex align="start" className="min-w-0" gap={12}>
                  <SkyrocAvatar className="size-48px! shrink-0" />
                  <div className="min-w-0">
                    <Typography.Text className="block" ellipsis>
                      {item.content}
                    </Typography.Text>
                    <Typography.Text
                      type="secondary"
                      className="block text-12px"
                    >
                      {item.time}
                    </Typography.Text>
                  </div>
                </Flex>

                <Space size="small">
                  <Button key="up" size="small" onClick={() => up(item.id)}>
                    上移
                  </Button>
                  <Button
                    danger
                    key="del"
                    size="small"
                    onClick={() => remove(item.id)}
                  >
                    删除
                  </Button>
                  <Button key="down" size="small" onClick={() => down(item.id)}>
                    下移
                  </Button>
                </Space>
              </Flex>
            </motion.div>
          ))}
        </Space>
      </AnimatePresence>
    </Card>
  );
};

export default ProjectNews;

import { useNavigate } from "@tanstack/react-router";
import { Button } from "antd";

import { globalConfig } from "@/config";

import SvgIcon from "./SvgIcon";

type ExceptionType = "403" | "404" | "500";
interface Props {
  type: ExceptionType;
}

const iconMap: Record<ExceptionType, string> = {
  "403": "no-permission",
  "404": "not-found",
  "500": "service-error",
};
const ExceptionBase: FC<Props> = memo(({ type }) => {
  const navigate = useNavigate();
  const onClick = () => {
    navigate({
      to: globalConfig.homePath,
    });
  };
  return (
    <div className="size-full min-ho520px flex-col-center gap-24px overflow-hidden">
      <div className="flex text-400px text-primary">
        <SvgIcon localIcon={iconMap[type]} />
      </div>
      <Button type="primary" onClick={onClick}>
        返回首页
      </Button>
    </div>
  );
});

export default ExceptionBase;

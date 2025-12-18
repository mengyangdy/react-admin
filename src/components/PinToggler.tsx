import React from "react";

import ButtonIcon from "./ButtonIcon";
import SvgIcon from "./SvgIcon";

interface Props {
  className: string;
  onClick?: React.ComponentProps<"button">["onClick"];
  pin?: boolean;
}
const PinToggler = ({ className, onClick, pin }: Props) => {
  const icon = pin ? "mdi-pin-off" : "mdi-pin";
  return (
    <ButtonIcon
      triggerParent
      className={className}
      tooltipContent={pin ? "取消固定" : "固定"}
      tooltipPlacement="bottomLeft"
      onClick={onClick}
    >
      <SvgIcon icon={icon} />
    </ButtonIcon>
  );
};

export default PinToggler;

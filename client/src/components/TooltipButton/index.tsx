import type { ReactNode } from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";

interface Props {
  legend: string;
  variant: string;
  onClick: () => void;
  children: ReactNode;
}

export const TooltipButton = ({
  legend,
  variant,
  onClick,
  children,
}: Props) => {
  return (
    <OverlayTrigger trigger="hover" overlay={<Tooltip>{legend}</Tooltip>}>
      <Button onClick={onClick} variant={variant} size="sm">
        {children}
      </Button>
    </OverlayTrigger>
  );
};

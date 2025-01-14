/** @format */

import React from "react";
import { Button } from "../ui/button";

type StyledIconButtonProps = React.ComponentProps<typeof Button>;

const IconButton: React.FC<StyledIconButtonProps> = ({
  className,
  ...props
}) => {
  return (
    <Button
      {...props}
      variant="outline"
      size="icon"
      className={`rounded-full hover:bg-background ${className}`}>
      {props.children}
    </Button>
  );
};

export default IconButton;

/** @format */

import React from "react";
import { Button } from "@/components/ui/button"; // Adjust the import path as necessary

type StyledButtonProps = React.ComponentProps<typeof Button>;

const CustomButton: React.FC<StyledButtonProps> = ({ className, ...props }) => {
  return (
    <Button
      {...props}
      className={`bg-primary-normal text-white font-body text-md hover:bg-primary-light  ${className}`}>
      {props.children}
    </Button>
  );
};

export default CustomButton;

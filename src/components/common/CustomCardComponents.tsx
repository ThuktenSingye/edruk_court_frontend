/** @format */
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";

type StyledCardProps = React.ComponentProps<typeof Card>;
type StyledCardHeaderProps = React.ComponentProps<typeof CardHeader>;
type StyledCardTitleProps = React.ComponentProps<typeof CardTitle>;
type StyledCardDescriptionProps = React.ComponentProps<typeof CardDescription>;
type StyledCardContentProps = React.ComponentProps<typeof CardContent>;
type StyledCardFooterProps = React.ComponentProps<typeof CardFooter>;

const CustomCard: React.FC<StyledCardProps> = ({ className, ...props }) => {
  return (
    <Card {...props} className={`w-auto mx-auto rounded-md m-4 ${className}`}>
      {props.children}
    </Card>
  );
};

const CustomCardHeader: React.FC<StyledCardHeaderProps> = ({
  className,
  ...props
}) => {
  return (
    <CardHeader {...props} className={`font-title p-2 ${className}`}>
      {props.children}
    </CardHeader>
  );
};

const CustomCardTitle: React.FC<StyledCardTitleProps> = ({
  className,
  ...props
}) => {
  return (
    <CardTitle {...props} className={`font-heading text-md ${className}`}>
      {props.children}
    </CardTitle>
  );
};

const CustomCardDescription: React.FC<StyledCardDescriptionProps> = ({
  className,
  ...props
}) => {
  return (
    <CardDescription
      {...props}
      className={`font-body text-black/60 ${className}`}>
      {props.children}
    </CardDescription>
  );
};

const CustomCardContent: React.FC<StyledCardContentProps> = ({
  className,
  ...props
}) => {
  return (
    <CardContent {...props} className={`p-2 ${className}`}>
      {props.children}
    </CardContent>
  );
};

const CustomCardFooter: React.FC<StyledCardFooterProps> = ({
  className,
  ...props
}) => {
  return (
    <CardFooter {...props} className={`p-2 ${className}`}>
      {props.children}
    </CardFooter>
  );
};
export {
  CustomCard,
  CustomCardHeader,
  CustomCardTitle,
  CustomCardDescription,
  CustomCardContent,
  CustomCardFooter,
};

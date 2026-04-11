"use client";

import type { ButtonProps } from "flowbite-react";
import { Button } from "flowbite-react";
import Link from "next/link";

type NormalButtonProps = ButtonProps & {
  variant?: "normal";
};

type LinkButtonProps = ButtonProps & {
  variant: "link";
  href: string;
};

type Props = NormalButtonProps | LinkButtonProps;

const defaultClassName =
  "bg-green-600 hover:bg-green-700 focus:ring-green-500 cursor-pointer";

export default function CustomButton(props: Props) {
  if (props.variant === "link") {
    const {
      href,
      className = defaultClassName,
      fullSized = true,
      ...rest
    } = props;

    return (
      <Button
        as={Link}
        href={href}
        fullSized={fullSized}
        className={className}
        {...rest}
      />
    );
  }

  const {
    children,
    className = defaultClassName,
    fullSized = true,
    ...rest
  } = props;

  return (
    <Button fullSized={fullSized} className={className} {...rest}>
      {children}
    </Button>
  );
}

import React from "react";

export default function Cross(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      display="block"
      id="Cross"
      {...props}
    >
      <path d="M20 20L4 4m16 0L4 20" />
    </svg>
  );
}

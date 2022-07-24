import React from "react";

export default function Hamburger(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      display="block"
      {...props}
    >
      <path d="M3 6h18M3 12h18M3 18h18"></path>
    </svg>
  );
}

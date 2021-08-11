import { ReactNode } from "react";

export default function LinkButton({ children, linkTo }: { children: ReactNode; linkTo: string }) {
  return (
    <a href={linkTo}>
      <a>{children}</a>
    </a>
  );
}

import { PropsWithChildren } from "react";
import "./globals.css";

export const metadata = {
  title: "Lexical Experiment",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

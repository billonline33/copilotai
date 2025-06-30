import type { Metadata } from "next";
import Navigation from "./components/Navigation";

export const metadata: Metadata = {
  title: "To-Do & Math Practice App",
  description: "A to-do list app with math practice for Bianca",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        {children}
      </body>
    </html>
  );
}

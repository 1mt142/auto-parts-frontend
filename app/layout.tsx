import "./globals.css";
import { Toaster } from "react-hot-toast";
import Providers from "@/components/Providers";

export const metadata = {
  title: "Auto Parts Inventory",
  description: "Manage your auto parts inventory efficiently",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
}

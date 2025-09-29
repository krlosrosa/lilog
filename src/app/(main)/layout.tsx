
import "../globals.css";
import { SidebarLayout } from "@/_shared/components/sidebar/sideBar.layout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <SidebarLayout>
        {children}
      </SidebarLayout>
  );
}

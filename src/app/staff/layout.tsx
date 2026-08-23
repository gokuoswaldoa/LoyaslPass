import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LoyalPass - Escaner",
  description: "Portal para empleados de LoyalPass",
  manifest: "/staff-manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "LP Escaner",
  },
  icons: {
    icon: "/logo/iconoEmpleado.webp",
    apple: "/logo/iconoEmpleado.webp",
  },
};

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

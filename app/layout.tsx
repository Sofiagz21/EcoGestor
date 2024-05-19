import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";


const nunito = Nunito({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunito"
})

export const metadata: Metadata = {
  title: "EcoGestor",
  description: "Sistema de gestión de residuos agrícolas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${nunito.className} ${nunito.variable} font-sans subpixel-antialiased`}>
        <AntdRegistry>
          <ConfigProvider
            theme={{
              token: {
                // Seed Token
                fontFamily: "inherit",

                borderRadius: 8,

                // Colors
                colorPrimary: "#659E25",
                colorInfo: "#659E25",
                colorLink: "#659E25",
                colorTextBase: "##515151",
                //colorBgBase: "#f7fff6",


              },
              components: {
                Form: {
                  marginLG: 8
                },
                Menu: {
                  itemActiveBg: "#ffff",
                  itemSelectedBg: "#ADE679",
                  itemSelectedColor: "#515151",
                },
              }
            }}
          >
            {children}
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
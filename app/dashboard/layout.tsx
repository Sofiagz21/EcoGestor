"use client";

import TopBar from "@/components/topBar/topBar";
import { Menu } from "antd";
import { MdCompost } from "react-icons/md";
import { GiFarmTractor, GiPencil } from "react-icons/gi";
import { TbSettingsFilled } from "react-icons/tb";
import { FiMenu, FiX } from "react-icons/fi";
import Logo from "@/public/img/LogoEcogestor.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DashboardLayout(props: {
  children: React.ReactNode;
  content: React.ReactNode;
}) {
  const router = useRouter();
  const [currentActive, setCurrentActive] = useState<string>("1");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const menuItems = [
    {
      key: "1",
      icon: <MdCompost size="25" fill="#162504" className="mt-5" />,
      title: "Residuos",
      url: "/residuos",
    },
    {
      key: "2",
      icon: <GiFarmTractor size="25" fill="#162504" className="mb-2" />,
      title: "Ruta de Residuos",
      url: "/rutasResiduos",
    },
    {
      key: "3",
      icon: <GiPencil size="25" fill="#162504" className="mb-2" />,
      title: "Control de Calidad",
      url: "/controlCalidad",
    },
    {
      key: "4",
      icon: <TbSettingsFilled size="25" fill="#162504" className="" />,
      title: "Configuración",
      url: "/settings",
    },
  ];

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  

  const handleMenuItemClick = (item: { key: string; url: string }) => {
    setCurrentActive(item.key);
    router.push("/dashboard" + item.url);
    setIsSidebarOpen(false); // Close sidebar on menu item click
  };

  return (
    <div className="h-screen overflow-y-hidden bg-gray-100">
      <div className="h-full w-full flex flex-col lg:flex-row">
        <div
          className={`sidebar fixed lg:static z-50 lg:z-auto top-0 left-0 h-full w-64 lg:w-1/5 bg-gray-100 border-r-2 ${
            isSidebarOpen ? "sidebar-open" : ""
          }`}
          style={{ borderColor: "#515151" }}
        >
          <div className="flex justify-between items-center p-4 lg:hidden toggle-button">
            <Image src={Logo} alt="Tabi Logo" height={40} />
            <button onClick={handleToggleSidebar}>
              {isSidebarOpen ? <FiX size={30} /> : <FiMenu size={30} />}
            </button>
          </div>
          <div className="hidden lg:flex mx-2 lg:mx-6 my-2 sidebar-logo">
            <Image src={Logo} alt="EcoGestor" height={50} />
          </div>
          <Menu
            defaultSelectedKeys={["1"]}
            style={{
              backgroundColor: "transparent",
              borderRightWidth: 0,
              marginTop: "5rem", // 2 rem margin after the logo
            }}
            defaultOpenKeys={["sub1"]}
            mode="inline"
            className="h-full"
          >
            {menuItems.map((item) => (
              <Menu.Item
                key={item.key}
                className="flex items-center group py-6"
                onClick={() => handleMenuItemClick(item)}
              >
                <div className="flex gap-6 items-center">
                  {item.icon}
                  <span
                    className={`text-base pt-0.5 ${
                      currentActive === item.key ? "font-bold" : "font-medium"
                    }`}
                  >
                    {item.title}
                  </span>
                </div>
              </Menu.Item>
            ))}
          </Menu>
        </div>
        <div className="w-full lg:w-4/5 bg-white">
          <TopBar />
          {props.content}
        </div>
      </div>
    </div>
  );
}

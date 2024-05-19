"use client";

import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import axiosInstance from "@/axiosInterceptor";
import Logo from "@/public/img/LogoEcogestor.svg";
import { DownOne, User } from "@icon-park/react";
import { Menu } from "antd"; // Importa Menu desde antd
import { Avatar, Dropdown } from "antd";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function TopBar() {
  const pathname = usePathname();

  const [usuario, setUsuario] = useState<AuthResponse | null>(null);

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("usuario");
    window.location.href = "/login";
  };

  useEffect(() => {
    const usuarioCookie = Cookies.get("usuario");
    if (usuarioCookie) {
      setUsuario(JSON.parse(usuarioCookie));
    }
  }, []);

  const handleMenuClick = (e: any) => {
    if (e.key === "1") {
      logout();
    }
  };

  return (
    <header className="w-full flex justify-between items-center px-4 py-3 lg:px-8 lg:py-4 bg-green-300 lg:bg-white text-brown border-b border-brown/15">
      <div className="flex items-center">
        <div className="lg:hidden">
          <Image src={Logo} alt="EcoGestorLogo" height={28} />
        </div>
        <div
          className={`${
            pathname === "/onboarding" ? "hidden lg:flex" : "hidden"
          }`}
        >
          <Image src={Logo} alt="Tabi Logo" height={40} />
        </div>
      </div>

      <div className="flex gap-2 lg:gap-4">
        <Dropdown
          overlay={
            <Menu onClick={handleMenuClick}>
              <Menu.Item key="0">Perfil</Menu.Item>
              <Menu.Item key="1">Cerrar sesión</Menu.Item>
            </Menu>
          }
          trigger={["click"]}
        >
          <button className="flex items-center justify-between gap-2 lg:py-2 lg:px-4 rounded-lg border-brown/20 hover:bg-brown/10">
            <div className="flex items-center gap-2">
              <div className="lg:hidden">
                <Avatar
                  style={{
                    backgroundColor: "#00000000",
                    verticalAlign: "middle",
                  }}
                >
                  <User theme="outline" size="1.25rem" fill="#412F26" />
                </Avatar>
              </div>
              <div className="hidden lg:flex">
                <Avatar
                  style={{
                    backgroundColor: "#8AC942",
                    verticalAlign: "middle",
                    padding: "1.1rem",
                  }}
                >
                  <User theme="outline" size="1.25rem" fill="#412F26" />
                </Avatar>
              </div>
              <span className="hidden md:flex font-extrabold">
                {usuario?.nombresUsuario}
              </span>
              <DownOne theme="filled" size="1rem" fill="#412F26" />
            </div>
          </button>
        </Dropdown>
      </div>
    </header>
  );
}

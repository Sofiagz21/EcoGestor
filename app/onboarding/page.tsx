"use client";

import { Button, Form, Input, Select, DatePicker, Skeleton, Card } from "antd";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import axiosInstance from "@/axiosInterceptor";
import {
  CheckCircleOutlined,
  EnvironmentOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation"; // Import useRouter

export default function OnboardingPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [usuario, setUsuario] = useState<AuthResponse | null>(null);
  const [gameHasPartida, setGameHasPartida] = useState<boolean | null>(null);
  const [isGameAccountReady, setIsGameAccountReady] = useState<boolean | null>(
    null
  );

  const router = useRouter(); // Initialize the router


  useEffect(() => {
    // Set user cookies
    const userCookie = Cookies.get("usuario");
    if (userCookie) setUsuario(JSON.parse(userCookie));
  }, []);

  useEffect(() => {
    if (usuario) {
      console.log(usuario);
    }
  }, [usuario]);

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-8 p-8">
      {usuario && usuario.idRolUsuario === 1 ? (
        <div className="w-full max-w-3xl text-center mb-10">
          <h2
            className="text-4xl lg:text-6xl font-bold mb-2"
            style={{ color: "#659E25" }}
          >
            Bienvenido a EcoGestor
          </h2>
          <p className="text-base lg:text-lg mb-4 text-gray">
            EcoGestor es tu herramienta para gestionar residuos y optimizar tus
            procesos agrícolas.
          </p>
        </div>
      ) : null}

      {usuario && usuario.idRolUsuario === 1 && (
        <div className="w-full p-6 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card
              hoverable
              style={{ backgroundColor: "#EFFBE0" }}
              className="text-center rounded-md shadow-md h-[260px] flex flex-col justify-center items-center p-5"
              onClick={() => router.push("/dashboard/residuos")} 
            >
              <div className="flex justify-center items-center">
                <CheckCircleOutlined
                  style={{
                    fontSize: "3rem",
                    color: "#659e25",
                    marginBottom: "1rem",
                  }}
                />
              </div>
              <h4 className="text-lg font-bold mt-2 mb-1 text-dark-blue">
                Registrar residuos
              </h4>
              <p className="text-base mt-1 text-dark-blue">
                Añade información sobre los residuos generados en tu finca.
              </p>
            </Card>
            <Card
              hoverable
              style={{ backgroundColor: "#EFFBE0" }}
              className="text-center rounded-md shadow-md h-[240px] flex flex-col justify-center items-center p-4"
              onClick={() => router.push("/dashboard/rutasResiduos")} 
            >
              <EnvironmentOutlined
                style={{
                  fontSize: "3rem",
                  color: "#659e25",
                  marginBottom: "1rem",
                }}
              />
              <h4 className="text-lg font-bold mt-2 mb-1 text-dark-blue">
                Registrar una ruta de residuos
              </h4>
              <p className="text-base mt-1 text-dark-blue">
                Define las rutas para el manejo y recolección de residuos.
              </p>
            </Card>
            <Card
              hoverable
              style={{ backgroundColor: "#EFFBE0" }}
              className="text-center rounded-md shadow-md h-[240px] flex flex-col justify-center items-center p-4"
              onClick={() => router.push("/dashboard/controlCalidad")} 
            >
              <SafetyOutlined
                style={{
                  fontSize: "3rem",
                  color: "#659E25",
                  marginBottom: "1rem",
                }}
              />
              <h4 className="text-lg font-bold mt-2 mb-1 text-dark-blue">
                Registrar un control de calidad
              </h4>
              <p className="text-base mt-1 text-dark-blue">
                Registra controles de calidad para los procesos agrícolas.
              </p>
            </Card>
          </div>
        </div>
      )}

      {usuario &&
        usuario.idRolUsuario === 2 &&
         (
          <div className="w-full flex justify-center items-center mt-10">
            <Card
              hoverable
              style={{
                backgroundColor: "#D9EAD3",
                height: "70vh",
                width: "80vw",
              }}
              className="text-center rounded-md shadow-md p-6 flex flex-col justify-center items-center"
            >
              <h1
                className="text-5xl font-bold mb-12"
                style={{ color: "#659E25" }}
              >
                ¡Hola! {usuario.username} 👩‍🌾👨‍🌾
              </h1>
              <h2
                className="text-2xl font-regular mt-3 mb-6"
                style={{ color: "#19233B" }}
              >
                ¡Ya tienes tu cuenta lista para jugar a Green Peel Adventure!
                🎮🍌
              </h2>
              <p
                className="text-xl lg:text-2xl mb-6"
                style={{ color: "#19233B" }}
              >
                <b>Abre el juego e inicia sesión con esta cuenta.</b>
              </p>
              <p className="text-lg lg:text-xl" style={{ color: "#659E25" }}>
                🎉 ¡Diviértete y disfruta de la aventura! 🌱
              </p>
            </Card>
          </div>
        )}
    </div>
  );
}

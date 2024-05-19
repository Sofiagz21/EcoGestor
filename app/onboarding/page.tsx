"use client";

import { Button, Form, Input, Select, DatePicker, Skeleton, Card } from "antd";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import axiosInstance from "@/axiosInterceptor";
import { format, startOfDay, isValid } from "date-fns";
import Image from "next/image";
import {
  CheckCircleOutlined,
  EnvironmentOutlined,
  SafetyOutlined,
} from "@ant-design/icons";

export default function OnboardingPage() {
  const [loading, setLoading] = useState<boolean>(false);

  const [usuario, setUsuario] = useState<AuthResponse | null>(null);
  const [gameHasPartida, setGameHasPartida] = useState<boolean>();
  const [isGameAccountReady, setIsGameAccountReady] = useState<boolean>();

  const checkPlayerPartida = async () => {
    if (!usuario) return;
    console.log("Checking player partida");
    try {
      const response = await axiosInstance.get(
        `/api/Partida?Filters=Partida.IdUsuario%3D%3D${usuario.idUsuario}`
      );
      if (response.data.length > 0) {
        console.log("Player has a partida");
        setGameHasPartida(true);
        setIsGameAccountReady(true); // La cuenta del juego está lista si el jugador ya tiene una partida
      } else {
        setGameHasPartida(false);
        setIsGameAccountReady(false);
        SetPlayerAccount(); // Crear una nueva partida si el jugador no tiene una partida
      }
    } catch (error) {
      console.error("Error checking player partida:", error);
    }
  };

  const SetPlayerAccount = async () => {
    if (!usuario) return;
    const formPartida = new FormData();
    formPartida.append("IdUsuario", usuario.idUsuario.toString());
    formPartida.append("Name", "Granjero de Green Peel Adventure");

    try {
      const resp = await axiosInstance.post("/api/Partida", formPartida);
      if (resp.status === 201) {
        console.log("Partida Creada", resp.data);
        // Ahora que la partida está creada, también la cuenta del juego está lista
        setIsGameAccountReady(true);
        // Agregar lógica para crear un lote u otros detalles de la cuenta del juego aquí
      }
    } catch (err) {
      console.error("Error creating partida:", err);
    }
  };

  function handleRegisterWaste() {
    // Aquí va el código para manejar el registro de residuos
  }

  function handleRegisterWasteRoute() {
    // Aquí va el código para manejar el registro de una ruta de residuos
  }

  function handleRegisterQualityControl() {
    // Aquí va el código para manejar el registro de un control de calidad
  }

  useEffect(() => {
    // Set user cookies
    const userCookie = Cookies.get("usuario");
    if (userCookie) setUsuario(JSON.parse(userCookie));
  }, []);

  useEffect(() => {
    console.log(usuario);
    // check if player has a partida
    checkPlayerPartida();
  }, [usuario]);

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-8 p-8">
      {usuario && usuario.idRolUsuario === 1 ? (
        <div className="w-full max-w-3xl text-center mb-10">
          <h2 className="text-4xl lg:text-6xl font-bold mb-2 text-green">
            Bienvenido a EcoGestor
          </h2>
          <p className="text-brown text-base lg:text-lg mb-4 text-gray">
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
              style={{ backgroundColor: "#8AC942" }}
              className="text-center rounded-md shadow-md h-[240px] flex flex-col justify-center items-center p-4" // Reduced height and added padding
            >
              <CheckCircleOutlined
                style={{
                  fontSize: "3rem",
                  color: "#FFF",
                  marginBottom: "1rem",
                }}
              />
              <h4 className="text-lg font-bold mt-2 mb-1 text-white">
                Registrar residuos
              </h4>{" "}
              <p className="text-base mt-1">
                {" "}
                Añade información sobre los residuos generados en tu finca.
              </p>
            </Card>
            <Card
              hoverable
              style={{ backgroundColor: "#8AC942" }}
              className="text-center rounded-md shadow-md h-[240px] flex flex-col justify-center items-center p-4" // Reduced height and added padding
            >
              <EnvironmentOutlined
                style={{
                  fontSize: "3rem",
                  color: "#FFF",
                  marginBottom: "1rem",
                }}
              />
              <h4 className="text-lg font-bold mt-2 mb-1 text-white">
                Registrar una ruta de residuos
              </h4>{" "}
              <p className="text-base mt-1">
                {" "}
                Define las rutas para el manejo y recolección de residuos.
              </p>
            </Card>
            <Card
              hoverable
              style={{ backgroundColor: "#8AC942" }}
              className="text-center rounded-md shadow-md h-[240px] flex flex-col justify-center items-center p-4" // Reduced height and added padding
            >
              <SafetyOutlined
                style={{
                  fontSize: "3rem",
                  color: "#FFF",
                  marginBottom: "1rem",
                }}
              />{" "}
              <h4 className="text-lg font-bold mt-2 mb-1 text-white">
                Registrar un control de calidad
              </h4>{" "}
              <p className="text-base mt-1">
                {" "}
                Registra controles de calidad para los procesos agrícolas.
              </p>
            </Card>
          </div>
        </div>
      )}
  
      {usuario && usuario.idRolUsuario === 2 && (gameHasPartida || isGameAccountReady) && (
        <div className="w-full max-w-3xl text-center mt-10">
          <h1 className="text-brown text-3xl lg:text-4xl font-extrabold">
            ¡Tu cuenta para jugar está lista!
          </h1>
          <div className="text-brown text-sm lg:text-base">
            ¡Ya puedes jugar a Tabiland!&nbsp;
            <b>Abre el juego e inicia sesión con esta cuenta.</b>
          </div>
        </div>
      )}
  
      {usuario && usuario.idRolUsuario === 2 && gameHasPartida !== undefined && isGameAccountReady !== undefined && !gameHasPartida && !isGameAccountReady && (
        <div className="w-full max-w-3xl text-center mt-10">
          <h1 className="text-brown text-3xl lg:text-4xl font-extrabold">
            Estamos configurando tu cuenta...
          </h1>
          <div className="text-brown text-sm lg:text-base">
            Este proceso sólo tomará un momento
          </div>
        </div>
      )}
    </div>
  );
}  
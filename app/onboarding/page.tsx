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
  const [estadosResiduos, setEstadosResiduos] = useState<any[]>([]);

  const [usuario, setUsuario] = useState<AuthResponse | null>(null);
  const [gameHasResiduo, setGameHasResiduo] = useState<boolean>();
  const [isGameAccountReady, setIsGameAccountReady] = useState<boolean>();

  function handleRegisterWaste() {
    // Aquí va el código para manejar el registro de residuos
  }

  function handleRegisterWasteRoute() {
    // Aquí va el código para manejar el registro de una ruta de residuos
  }

  function handleRegisterQualityControl() {
    // Aquí va el código para manejar el registro de un control de calidad
  }

  // Register farm, lot and crop for players
  const SetPlayerAccount = async () => {
    if (!usuario) return;

    // Send data to API
    const formPartida: FormData = new FormData();
    formPartida.append("IdUsuario", usuario.idUsuario.toString());
    formPartida.append("Name", "Granjero de Green Peel Adventure");

    try {
      const resp = await axiosInstance.post("/api/Partida", formPartida);

      if (resp.status === 201) {
        console.log("Partida Creada", resp.data);
        const formPartida: FormData = new FormData();

        // Now try to create a lot
        formPartida.append("IdPartida", resp.data.idPartida.toString());
        formPartida.append("FechaInicioPartida", "");
        formPartida.append("FechaFinPartida", "");
        formPartida.append("IdNivel", "1");
        formPartida.append("UbicacionJugador", "Granja de Sergio Y Sofia");
        formPartida.append("Puntuacion", "0");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getEstadosResiduos = async () => {
    try {
      const response = await axiosInstance.get("/api/EstadoResiduos");
      const estadosResiduos = response.data;
      setEstadosResiduos(estadosResiduos);
    } catch (error) {
      console.error("Error al obtener los estados de residuos:", error);
    }
  };

  const onFinish = async (values: any) => {
    if (!usuario) return;

    setLoading(true);
    const form: FormData = new FormData();
    form.append("IdUsuario", usuario.toString());
    form.append("NombreResiduo", values.nombreResiduo);

    // Verificar si la fecha es válida antes de formatearla
    const fechaRegistro = values.fechaRegistro.toDate();
    if (isValid(fechaRegistro)) {
      form.append("FechaRegistro", format(fechaRegistro, "yyyy-MM-dd"));
    } else {
      console.error("Fecha de registro no válida");
      setLoading(false);
      return;
    }

    form.append("CantidadRegistrada", values.cantidadRegistrada);
    form.append("IdEstadoResiduos", values.idEstadoResiduo);

    try {
      const res = await axiosInstance.post("/api/Residuos", form);
      setLoading(false);
      window.location.href = "/dashboard";
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log(errorInfo);
  };

  useEffect(() => {
    const usuarioCookie = Cookies.get("usuario");
    if (usuarioCookie) setUsuario(JSON.parse(usuarioCookie));
    getEstadosResiduos();
  }, []);

  useEffect(() => {
    console.log(usuario);
  }, [usuario]);

  return (
    <div
      className="w-screen h-screen p-8 flex flex-col justify-center items-center"
      style={{ backgroundColor: "#FFFFFF" }} // Fondo blanco
    >
      <div className="w-full max-w-3xl text-center mb-10">
        <h2 className="text-4xl lg:text-6xl font-bold mb-2 text-green">
          Bienvenido a EcoGestor
        </h2>
        <p className="text-brown text-base lg:text-lg mb-4 text-gray">
          EcoGestor es tu herramienta para gestionar residuos y optimizar tus
          procesos agrícolas.
        </p>
      </div>
      <div className="w-full">
        <div className="p-6 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card
              onClick={handleRegisterWaste}
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
              onClick={handleRegisterWasteRoute}
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
              onClick={handleRegisterQualityControl}
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
      </div>
    </div>
  );
}

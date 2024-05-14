"use client";

import { useAuth } from "@/hooks/useAuth";
import type { FormProps } from "antd";
import { Button, Form, Input, Segmented, Select, Space } from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

// Antd icons
import { FilePdfOutlined } from "@ant-design/icons";

export default function Page() {
  // Operation state (login or register)
  const [operation, setOperation] = useState<"Iniciar sesión" | "Registrarse">(
    "Iniciar sesión"
  );

  const [userType, setUserType] = useState<
    | "Agricultor"
    | "Personal de recolección"
    | "Personal de control de calidad"
    | "Jugador"
  >("Agricultor");

  // Use auth hook
  const auth = useAuth();

  // Avoid interceptor
  const axiosInstance = axios.create();

  // Login function
  const onFinishLogin: FormProps<AuthRequest>["onFinish"] = async (values) => {
    try {
      const form: FormData = new FormData();
      if (values?.userName.includes("@")) {
        form.append("EmailUsuario", values.userName);
      } else {
        form.append("UserName", values.userName);
      }

      form.append("Password", values.password);

      const { data }: { data: AuthResponse } = await axiosInstance.post(
        "/api/Auth/Login",
        form
      );

      console.log("Success:", data);

      // Set cookies
      Cookies.set("token", data.token);
      Cookies.set("usuario", JSON.stringify(data));

      window.location.href = "/dashboard";
    } catch (error) {
      console.log("Failed:", error);
    }
  };

  const onFinishLoginFailed: FormProps<AuthRequest>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  // UseEffect for log the current user type
  useEffect(() => {
    console.log("User type:", userType);
  }, [userType]);

  const [backgroundImage, setBackgroundImage] = useState("img/SignIn.png");

  useEffect(() => {
    if (operation === "Iniciar sesión") {
      setBackgroundImage("img/SignIn.png");
    } else if (operation === "Registrarse") {
      setBackgroundImage("img/Register.png");
    }
  }, [operation]);

  return (
    <div className="w-screen h-full lg:h-screen flex flex-col lg:flex-row justify-center lg:items-center">
      <div className="w-full lg:w-4/5 h-full flex flex-col justify-center items-center gap-6 px-9 py-12 lg:p-16">
        <Segmented
          size="large"
          className="w-full"
          block
          options={["Iniciar sesión", "Registrarse"]}
          defaultValue={"Iniciar sesión"}
          value={operation}
          onChange={setOperation}
        />
      </div>
      <div
        className="w-full lg:w-4/5 h-full px-8 py-12 lg:p-16 flex flex-col justify-center gap-3 bg-green"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
      </div>
    </div>
  );
}

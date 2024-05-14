"use client";

import { useAuth } from "@/hooks/useAuth";
import type { FormProps } from "antd";
import Image from "next/image";
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
    | "Personal de recoleccion"
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
        <Image
          src="/img/LogoEcogestor.svg"
          alt="Logo"
          width={200}
          height={200}
          className="absolute top-5 left-5"
        />

        <Segmented
          size="large"
          className="w-full"
          block
          options={["Iniciar sesión", "Registrarse"]}
          defaultValue={"Iniciar sesión"}
          value={operation}
          onChange={setOperation}
        />
        <div className="w-full flex flex-col justify-around gap-6 rounded-xl px-8 py-5  ">
          {operation === "Registrarse" ? (
            <>
              <Segmented
                block
                className="w-full"
                value={userType}
                onChange={setUserType}
                options={[
                  {
                    label: (
                      <div className="flex flex-col items-center gap-3 h-full py-3">
                        <div className="flex justify-center">
                          <FilePdfOutlined className="text-3xl" />
                        </div>
                        <div className="flex flex-col items-start gap-1">
                          <p className="text-wrap text-center font-bold leading-tight text-sm">
                            Quiero gestionar mis residuos
                          </p>
                        </div>
                      </div>
                    ),
                    value: "Agricultor",
                  },
                  {
                    label: (
                      <div className="flex flex-col items-center gap-3 h-full py-2">
                        <div className="flex justify-center">
                          <FilePdfOutlined className="text-3xl" />
                        </div>
                        <div className="flex flex-col items-start gap-1">
                          <p className="text-wrap text-center font-bold leading-tight text-sm">
                            Quiero gestionar las rutas de los residuos
                          </p>
                        </div>
                      </div>
                    ),
                    value: "Personal de recoleccion",
                  },
                  {
                    label: (
                      <div className="flex flex-col items-center gap-3 h-full py-2">
                        <div className="flex justify-center">
                          <FilePdfOutlined className="text-3xl" />
                        </div>
                        <div className="flex flex-col items-start gap-1">
                          <p className="text-wrap text-center font-bold leading-tight text-sm">
                            Quiero gestionar el control de calidad de los
                            residuos
                          </p>
                        </div>
                      </div>
                    ),
                    value: "Personal de control de calidad",
                  },
                  {
                    label: (
                      <div className="flex flex-col items-center gap-3 h-full py-2">
                        <div className="flex justify-center">
                          <FilePdfOutlined className="text-3xl" />
                        </div>
                        <div className="flex flex-col items-start gap-1">
                          <p className="text-wrap text-center font-bold leading-tight text-sm">
                            Quiero jugar GreenPeel Adventure{" "}
                          </p>
                        </div>
                      </div>
                    ),
                    value: "Jugador",
                  },
                ]}
              />

              <Form
                name="registerForm"
                layout="vertical"
                size="middle"
                initialValues={{ remember: true }}
                onFinish={onFinishLogin}
                onFinishFailed={onFinishLoginFailed}
                className="w-full"
              >
                <div className="md:flex w-full gap-5">
                  <Form.Item
                    className="md:w-1/2"
                    label="Nombres"
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: "Por favor, ingresa tu nombre!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    className="md:w-1/2"
                    label="Apellidos"
                    name="lastName"
                    rules={[
                      {
                        required: true,
                        message: "Por favor, ingresa tu apellido!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </div>

                {userType === "Jugador" && (
                  <Form.Item
                    label="Nombre de usuario"
                    name="userName"
                    rules={[
                      {
                        required: true,
                        message: "Por favor, ingresa un nombre de usuario",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                )}

                <Form.Item
                  label="Correo electrónico"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Por favor, ingresa tu correo!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Contraseña"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Por favor, ingresa tu contraseña!",
                    },
                  ]}
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item>
                  <Button
                    className="w-full mt-5"
                    type="primary"
                    htmlType="submit"
                  >
                    Registrarse
                  </Button>
                </Form.Item>
              </Form>
            </>
          ) : (
            <>
              <Form
                name="loginForm"
                layout="vertical"
                size="large"
                initialValues={{ remember: true }}
                onFinish={onFinishLogin}
                onFinishFailed={onFinishLoginFailed}
                className="w-full"
              >
                <Form.Item
                  label="Usuario o correo electrónico"
                  name="userName"
                  rules={[
                    {
                      required: true,
                      message: "Por favor, ingresa tu usuario o correo!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Contraseña"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Por favor, ingresa tu contraseña!",
                    },
                  ]}
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item>
                  <Button
                    className="w-full mt-5"
                    type="primary"
                    htmlType="submit"
                  >
                    Iniciar sesión
                  </Button>
                </Form.Item>
              </Form>
            </>
          )}
        </div>
      </div>
      <div
        className="w-full lg:w-4/5 h-full px-8 py-12 lg:p-16 flex flex-col justify-center gap-3 bg-green"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></div>
    </div>
  );
}

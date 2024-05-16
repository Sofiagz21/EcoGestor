"use client";

import { useAuth } from "@/hooks/useAuth";
import type { FormProps } from "antd";
import Image from "next/image";
import { Button, Form, Input, Radio, Select, Space, Tabs } from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useMediaQuery } from 'react-responsive'

// Antd icons
import { FilePdfOutlined } from "@ant-design/icons";

export default function Page() {
  //Roles usuario
  const [rolesUsuario, setRolesUsuario] = useState<RolUsuario[]>([]);
  const [operation, setOperation] = useState<"Iniciar sesión" | "Registrarse">(
    "Iniciar sesión"
  );

  const [rolUsuario, setRolUsuario] = useState<RolUsuario>({
    idRolUsuario: 1,
    nombreRolUsuario: "",
  });

  const auth = useAuth();
  const axiosInstance = axios.create();

  const getRolesUsuario = async () => {
    try {
      const { data }: { data: RolUsuario[] } = await axiosInstance.get(
        "/api/RolUsuario"
      );
      setRolesUsuario(data);
      // Set default Rol Usuario as the first one
      setRolUsuario(data[0]);
    } catch (error) {
      console.log("Failed:", error);
    }
  };

  //== Form functions ==//

  const authenticate = async (values: AuthRequest) => {
    try {
      const form: FormData = new FormData();
      if (values?.username.includes("@")) {
        form.append("EmailUsuario", values.username);
      } else {
        form.append("UserName", values.username);
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

  // Login function
  const onFinishLogin: FormProps<AuthRequest>["onFinish"] = async (values) => {
    try {
      authenticate({
        username: values.username,
        password: values.password,
      });
    } catch (error) {
      console.log("Failed:", error);
    }
  };

  const onFinishLoginFailed: FormProps<AuthRequest>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  //Registers function

  const onFinishRegister: FormProps<Usuario>["onFinish"] = async (values) => {
    try {
      console.log("Register values:", values, rolUsuario);

      // Create form data
      const form: FormData = new FormData();
      form.append("NombresUsuario", values.nombresUsuario);
      form.append("ApellidosUsuario", values.apellidosUsuario);
      form.append("EmailUsuario", values.emailUsuario);
      form.append("Password", values.password);
      form.append("IdRolUsuario", rolUsuario.idRolUsuario.toString());

      // Send request
      const { data }: { data: UsuarioResponse } = await axiosInstance.post(
        "/api/Auth/Register",
        form
      );

      console.log("Success:", data);

      // Authenticate user
      authenticate({
        username: values.emailUsuario,
        password: values.password,
      });
    } catch (errorInfo) {
      console.log("Failed in:", errorInfo);
    }
  };

  const onFinishRegisterFailed: FormProps<Usuario>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  //=== UseEffects ===//

  // Load types on component mount
  useEffect(() => {
    getRolesUsuario();
  }, []);

  // UseEffect for log the current user type
  useEffect(() => {
    console.log("Rol Usuario:", rolUsuario);
  }, [rolUsuario]);

  const [backgroundImage, setBackgroundImage] = useState("img/SignIn.png");
  const isSmallScreen = useMediaQuery({ query: '(max-width: 768px)' })

  useEffect(() => {
    if (operation === "Iniciar sesión") {
      setBackgroundImage("img/SignIn.png");
    } else if (operation === "Registrarse") {
      setBackgroundImage("img/Register.png");
    }
  }, [operation]);

  return (
    <div className="w-screen h-full lg:h-screen flex flex-col lg:flex-row justify-center lg:items-center overflow-hidden">
      <div className="lg:absolute lg:top-0 lg:left-5  flex justify-center lg:justify-start">
        <Image
          src="/img/LogoEcogestor.svg"
          alt="Logo"
          width={200}
          height={200}
        />
      </div>

      <div className="w-full lg:w-4/5 h-full flex flex-col justify-center items-center gap-6 px-9 py-4 lg:p-16">
        <Tabs
          className="w-full"
          defaultActiveKey="Iniciar sesión"
          activeKey={operation}
          onChange={(activeKey: string) => setOperation(activeKey as "Iniciar sesión" | "Registrarse")}
        >
          <Tabs.TabPane tab="Iniciar sesión" key="Iniciar sesión">
            <Form
              name="loginForm"
              layout="vertical"
              size="large"
              onFinish={onFinishLogin}
              onFinishFailed={onFinishLoginFailed}
              className="w-full"
            >
              <Form.Item
                label="Usuario o correo electrónico"
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Por favor, ingresa tu usuario o correo",
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
                    message: "Por favor, ingresa tu contraseña",
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
          </Tabs.TabPane>
          <Tabs.TabPane tab="Registrarse" key="Registrarse">
            <Form
              name="registerForm"
              layout="vertical"
              size="middle"
              onFinish={onFinishRegister}
              onFinishFailed={onFinishRegisterFailed}
              className="w-full"
            >
              <Form.Item
                label="Tipo de usuario"
                name="role"
                rules={[
                  {
                    required: true,
                    message: "Por favor, selecciona un tipo de usuario",
                  },
                ]}
              >
                <Radio.Group
                  optionType="button"
                  buttonStyle="solid"
                  onChange={(e) => setRolUsuario(rolesUsuario.find(role => role.nombreRolUsuario === e.target.value) || rolesUsuario[0])}
                >
                  {rolesUsuario.map((rolUsuario) => (
                    <Radio.Button key={rolUsuario.idRolUsuario} value={rolUsuario.nombreRolUsuario}>
                      {rolUsuario.nombreRolUsuario === "Jugador" ? (
                        <Space>
                          <FilePdfOutlined />
                          Jugador
                        </Space>
                      ) : rolUsuario.nombreRolUsuario === "Admin" ? (
                        <Space>
                          <FilePdfOutlined />
                          Administrador
                        </Space>
                      ) : null}
                    </Radio.Button>
                  ))}
                </Radio.Group>
              </Form.Item>

              <div className="md:flex w-full gap-5">
                <Form.Item
                  className="md:w-1/2"
                  label="Nombres"
                  name="nombresUsuario"
                  rules={[
                    {
                      required: true,
                      message: "Por favor, ingresa tu nombre",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  className="md:w-1/2"
                  label="Apellidos"
                  name="apellidosUsuario"
                  rules={[
                    {
                      required: true,
                      message: "Por favor, ingresa tu apellido",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>
              
              {rolUsuario.nombreRolUsuario === "Jugador" && (
                <Form.Item
                  label="Nombre de usuario"
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "Por favor, ingresa tu nombre de usuario",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              )}

              <Form.Item
                label="Correo electrónico"
                name="emailUsuario"
                rules={[
                  {
                    required: true,
                    message: "Por favor, ingresa tu correo",
                  },
                  { type: "email", message: "Ingresa un correo válido" },
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
                    message: "Por favor, ingresa tu contraseña",
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
          </Tabs.TabPane>
        </Tabs>
      </div>
      <div
        className="w-full lg:w-4/5 h-full px-8 py-12 lg:p-16 flex flex-col justify-center gap-3"
        style={{
          backgroundImage: isSmallScreen ? "none" : `url('${backgroundImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></div>
    </div>
  );
}



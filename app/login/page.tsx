"use client";

import type { FormProps } from "antd";
import Image from "next/image";
import { Alert, Button, Form, Input, Radio, Space, Spin } from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

// Antd icons
import { UserOutlined, UserSwitchOutlined } from "@ant-design/icons";
import { GiFarmer } from "react-icons/gi";
import { LuBanana } from "react-icons/lu";
import { LoadingOutlined } from "@ant-design/icons";

export default function LoginPage() {
  //Roles usuario
  const [rolesUsuario, setRolesUsuario] = useState<RolUsuario[]>([]);
  const [operation, setOperation] = useState<"Iniciar sesión" | "Registrarse">(
    "Iniciar sesión"
  );

  const [rolUsuario, setRolUsuario] = useState<RolUsuario>({
    idRolUsuario: 1,
    nombreRolUsuario: "",
  });

  // Loading button states
  const [loginButtonLoading, setLoginButtonLoading] = useState<boolean>(false);
  const [registerButtonLoading, setRegisterButtonLoading] =
    useState<boolean>(false);

  // Error states
  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);
  // Visibility
  const [loginErrorVisible, setLoginErrorVisible] = useState<boolean>(false);
  const [registerErrorVisible, setRegisterErrorVisible] =
    useState<boolean>(false);

  const axiosInstance = axios.create();

  const getRolesUsuario = async () => {
    try {
      const data = await axiosInstance.get("/api/RolUsuario");
      setRolesUsuario(data.data);
    } catch (error) {
      console.error("Error al obtener los roles de usuario:", error);
    }
  };

  //== Form functions ==//

  // Authenticate (for both login and after register)
  const authenticate = async (values: AuthRequest) => {
    setLoginButtonLoading(true);
    setRegisterButtonLoading(true);
    const form: FormData = new FormData();
    if (values?.username.includes("@")) {
      form.append("EmailUsuario", values.username);
    } else {
      form.append("Username", values.username);
    }

    form.append("Password", values.password);

    try {
      const data = await axiosInstance.post("/api/Auth/Login", form);
      // Set cookies
      if (data.status === 200) {
        Cookies.set("token", data.data.token);
        Cookies.set("usuario", JSON.stringify(data.data));
        setLoginButtonLoading(false);
        setRegisterButtonLoading(false);

        setLoginErrorVisible(false);
        setRegisterErrorVisible(false);

        window.location.href = "/dashboard";
      }
    } catch (error: any) {
      const data = error.response;
      console.log("Error:", data.status);
      setLoginErrorVisible(true);
      setLoginError(
        data.status === 400
          ? "Error al iniciar sesión: Usuario o contraseña incorrectos."
          : "Error al iniciar sesión. Inténtalo de nuevo más tarde."
      );
      setLoginButtonLoading(false);
      setRegisterButtonLoading(false);
    }
  };

  // Login function
  const onFinishLogin: FormProps<AuthRequest>["onFinish"] = async (values) => {
    authenticate({
      username: values.username,
      password: values.password,
    });
  };

  const onFinishLoginFailed: FormProps<AuthRequest>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  // Register function
  const onFinishRegister: FormProps<Usuario>["onFinish"] = async (values) => {
    setRegisterButtonLoading(true);

    // Create form data
    const form: FormData = new FormData();
    form.append("NombresUsuario", values.nombresUsuario);
    form.append("ApellidosUsuario", values.apellidosUsuario);
    form.append("EmailUsuario", values.emailUsuario);
    form.append("Password", values.password);
    form.append("IdRolUsuario", rolUsuario.idRolUsuario.toString());
    if (values.username) form.append("Username", values.username);

    try {
      // Send request
      const data = await axiosInstance.post("/api/Auth/Register", form);
      setRegisterButtonLoading(false);

      // If user is created, authenticate
      if (data.status === 200) {
        authenticate({
          username: values.emailUsuario,
          password: values.password,
        });
      }
    } catch (error: any) {
      const data = error.response.data;
      console.log("Error:", data.message);
      setRegisterErrorVisible(true);
      setRegisterError(
        data.message === "Email is already taken"
          ? "Ya existe un usuario con este correo electrónico. Intenta iniciar sesión."
          : data.message === "Username is already taken"
          ? "Ya existe un usuario con este nombre de usuario. Intenta con otro."
          : "Error al registrarse. Inténtalo de nuevo más tarde."
      );
      setRegisterButtonLoading(false);
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

  const [backgroundImage, setBackgroundImage] = useState("img/SignIn.png");
  const isClient = typeof window !== "undefined";
  const isSmallScreen = isClient && window.innerWidth < 768;

  useEffect(() => {
    if (operation === "Iniciar sesión") {
      setBackgroundImage("img/SignIn.png");
    } else if (operation === "Registrarse") {
      setBackgroundImage("img/Register.png");
    }
  }, [operation]);

  return (
    <div className="w-screen h-full lg:h-screen flex flex-col lg:flex-row justify-center lg:items-center overflow-hidden">
      <div className="lg:absolute lg:top-0 lg:left-5 flex flex-col justify-center items-start gap-6">
        <div>
          <Image
            src="/img/LogoEcogestor.svg"
            alt="Logo"
            width={150}
            height={150}
          />
        </div>
      </div>

      <div className="w-full lg:w-4/5 h-full flex flex-col justify-center gap-6 px-9 py-4 lg:p-16">
        <div className="ml-4 mb-8 text-left">
          <h2 className="text-gray-500 font-semibold text-3xl">{operation}</h2>
        </div>

        {operation === "Iniciar sesión" ? (
          <>
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
                  { required: true, message: 'Por favor, ingresa tu contraseña' },
                  { min: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
              ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item>
                <Button
                  className="w-full mt-5"
                  type="primary"
                  htmlType="submit"
                  loading={loginButtonLoading}
                  icon={
                    loginButtonLoading ? (
                      <Spin indicator={<LoadingOutlined />} />
                    ) : null
                  }
                >
                  Iniciar sesión
                </Button>
              </Form.Item>

              {loginErrorVisible && (
                <Form.Item>
                  <Alert
                    message={loginError}
                    type="error"
                    showIcon
                    closable
                    afterClose={() => setLoginErrorVisible(false)}
                  />
                </Form.Item>
              )}

              <div className="flex justify-between w-full text-gray-500 mt-9">
                <p>¿Aún no tienes una cuenta?</p>
                <a
                  className="text-green-500 hover:text-green-700 cursor-pointer"
                  onClick={() => setOperation("Registrarse")}
                >
                  Registrarme
                </a>
              </div>
            </Form>
          </>
        ) : (
          <>
            <Form
              name="registerForm"
              layout="vertical"
              size="middle"
              onFinish={onFinishRegister}
              onFinishFailed={onFinishRegisterFailed}
              className="w-full"
            >
              <Form.Item name="rolUsuario" style={{ marginBottom: "2rem" }}>
                <Radio.Group
                  optionType="button"
                  buttonStyle="solid"
                  style={{ display: "flex", justifyContent: "space-between" }}
                  onChange={(e) =>
                    setRolUsuario(
                      rolesUsuario.find(
                        (role) => role.nombreRolUsuario === e.target.value
                      ) || rolesUsuario[0]
                    )
                  }
                >
                  {rolesUsuario.map((rolUsuario) => (
                    <Radio.Button
                      key={rolUsuario.idRolUsuario}
                      value={rolUsuario.nombreRolUsuario}
                      style={{
                        flex: 1,
                        height: isSmallScreen ? "50px" : "70px",
                        textAlign: "center",
                        padding: isSmallScreen ? "10px" : "15px",
                        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                      }}
                    >
                      {rolUsuario.nombreRolUsuario === "Jugador" ? (
                        <Space>
                          <LuBanana
                            style={{ fontSize: isSmallScreen ? "20px" : "30px" }}
                          />
                          Quiero jugar GreenPeel Adventure
                        </Space>
                      ) : rolUsuario.nombreRolUsuario === "Admin" ? (
                        <Space>
                          <GiFarmer size={isSmallScreen ? 20 : 30} />
                          Quiero Gestionar mis Residuos
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
                <Input type='email'/>
              </Form.Item>

              <Form.Item
                label="Contraseña"
                name="password"
                rules={[
                  { required: true, message: 'Por favor, ingresa tu contraseña!' },
                  { min: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
              ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item className="mt-5">
                <Button
                  className="w-full mt-9 bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded"
                  type="primary"
                  htmlType="submit"
                  loading={registerButtonLoading}
                  icon={
                    registerButtonLoading ? (
                      <Spin indicator={<LoadingOutlined />} />
                    ) : null
                  }
                >
                  Registrarse
                </Button>
              </Form.Item>

              {registerErrorVisible && (
                <Form.Item>
                  <Alert
                    message={registerError}
                    type="error"
                    showIcon
                    closable
                    afterClose={() => setRegisterErrorVisible(false)}
                  />
                </Form.Item>
              )}

              <div className="flex justify-between w-full text-gray-500 mt-9">
                <p>¿Ya tienes una cuenta?</p>
                <a
                  className="text-green-500 hover:text-green-700 cursor-pointer"
                  onClick={() => setOperation("Iniciar sesión")}
                >
                  Iniciar sesión
                </a>
              </div>
            </Form>
          </>
        )}
      </div>
      <div
        className="hidden lg:flex w-full lg:w-4/5 h-full px-8 py-12 lg:p-16 flex flex-col justify-center gap-3"
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

"use client";

import {
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  Skeleton,
  message,
  Card,
  Row,
  Col,
} from "antd";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import axiosInstance from "@/axiosInterceptor";
import { format, isValid } from "date-fns";

export default function ResiduoPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [estadosResiduos, setEstadosResiduos] = useState<any[]>([]);
  const [usuario, setUsuario] = useState<AuthResponse | null>(null);
  const [residuos, setResiduos] = useState<any[]>([]);

  const getResiduos = async () => {
    if (!usuario) return;
  
    try {
      const response = await axiosInstance.get(
        `/api/Residuos?Filters=Residuos.IdUsuario%3D%3D${usuario.idUsuario}`
      );
      setResiduos(response.data);
    } catch (error) {
      console.error("Error al obtener los residuos:", error);
    }
  };
  
  const getEstadosResiduos = async () => {
    try {
      const response = await axiosInstance.get("/api/EstadoResiduos");
      setEstadosResiduos(response.data);
    } catch (error) {
      console.error("Error al obtener los estados de residuos:", error);
    }
  };

  const onFinish = async (values: any) => {
    if (!usuario) return;

    setLoading(true);
    const form: FormData = new FormData();
    form.append("IdUsuario", usuario.idUsuario.toString());
    form.append("NombreResiduo", values.nombreResiduo);

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
      if (res.status === 201) {
        message.success("Tus residuos fueron creados");
        getResiduos();
      }
    } catch (err) {
      console.log(err);
      message.error("No fue posible registrar tus residuos");
      setLoading(false);
    }
  };

  useEffect(() => {
  const fetchUsuarioAndResiduos = async () => {
    const usuarioCookie = Cookies.get("usuario");
    if (usuarioCookie) {
      const usuario = JSON.parse(usuarioCookie);
      setUsuario(usuario);

      try {
        const response = await axiosInstance.get(
          `/api/Residuos?Filters=Residuos.IdUsuario%3D%3D${usuario.idUsuario}`
        );
        setResiduos(response.data);
      } catch (error) {
        console.error("Error al obtener los residuos:", error);
      }
    }
  };

  fetchUsuarioAndResiduos();
  getEstadosResiduos();
}, []);

  
  useEffect(() => {
    if (usuario) {
      getResiduos();
    }
  }, [usuario]);

  return (
    <div className="w-full h-screen flex justify-center items-center overflow-y-auto">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-screen-lg">
        <h1 className="text-brown text-3xl lg:text-4xl font-extrabold">
          {usuario ? (
            "Empecemos registrando tu finca"
          ) : (
            <Skeleton.Input block active />
          )}
        </h1>
        <div className="text-brown text-sm lg:text-base">
          {usuario && (
            <>
              Agrega a continuación los datos de tu finca para comenzar a usar
              la plataforma.&nbsp;
              <b>
                Podrás cambiar la información o agregar más fincas
                posteriormente.
              </b>
            </>
          )}
        </div>

        <div className="mt-8 overflow-auto">
          <Row gutter={[16, 16]}>
            {residuos.length > 0 ? (
              residuos.map((residuo) => (
                <Col xs={24} sm={12} md={8} lg={6} key={residuo.idResiduo}>
                  <Card title={residuo.nombreResiduo} bordered={false}>
                    <p>Fecha de Registro: {residuo.fechaRegistro}</p>
                    <p>Cantidad Registrada: {residuo.cantidadRegistrada}</p>
                    <p>Estado: {residuo.estadoResiduoNombre}</p>
                  </Card>
                </Col>
              ))
            ) : (
              <p>No hay residuos registrados.</p>
            )}
          </Row>
        </div>

        {usuario && (
          <Form
            name="onboarding"
            layout="vertical"
            onFinish={onFinish}
            className="mt-8"
          >
            <Form.Item
              label="Nombre del residuo"
              name="nombreResiduo"
              rules={[
                {
                  required: true,
                  message: "Por favor ingresa el nombre del residuo",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Fecha de Registro"
              name="fechaRegistro"
              rules={[
                {
                  required: true,
                  message: "Por favor ingresa la fecha de registro",
                },
              ]}
            >
              <DatePicker />
            </Form.Item>

            <Form.Item
              label="Cantidad Registrada"
              name="cantidadRegistrada"
              rules={[
                {
                  required: true,
                  message: "Por favor ingresa la cantidad registrada",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Estado del residuo"
              name="idEstadoResiduo"
              rules={[
                {
                  required: true,
                  message: "Por favor selecciona el estado del residuo",
                },
              ]}
            >
              <Select>
                {estadosResiduos.map((estado) => (
                  <Select.Option
                    key={estado.idEstadoResiduos}
                    value={estado.idEstadoResiduos}
                  >
                    {estado.nombreEstadoResiduos}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                Registrar
              </Button>
            </Form.Item>
          </Form>
        )}
      </div>
    </div>
  );
}

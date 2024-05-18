"use client";

import { Button, Form, Input, Select, DatePicker } from "antd";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import axiosInstance from "@/axiosInterceptor";
import { format, startOfDay, isValid } from 'date-fns';


export default function OnboardingPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [idUsuario, setIdUsuario] = useState<number | null>(null);
  const [estadosResiduos, setEstadosResiduos] = useState<any[]>([]);

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
    if (!idUsuario) return;

    setLoading(true);
    const form: FormData = new FormData();
    form.append("IdUsuario", idUsuario.toString());
    form.append("NombreResiduo", values.nombreResiduo);
    
    // Verificar si la fecha es válida antes de formatearla
    const fechaRegistro = values.fechaRegistro.toDate();
    if (isValid(fechaRegistro)) {
      form.append("FechaRegistro", format(fechaRegistro, 'yyyy-MM-dd'));
    } else {
      console.error('Fecha de registro no válida');
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
    if (usuarioCookie) {
      const usuario = JSON.parse(usuarioCookie);
      setIdUsuario(usuario.idUsuario);
    }
    getEstadosResiduos();
  }, []);

  return (
    <div className="w-screen h-screen flex justify-center items-center p-8">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-semibold text-center mb-4">Registro de Residuos</h1>
        <Form
          name="onboarding"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Nombre del residuo"
            name="nombreResiduo"
            rules={[
              { required: true, message: "Por favor ingresa el nombre del residuo" }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Fecha de Registro"
            name="fechaRegistro"
            rules={[
              { required: true, message: "Por favor ingresa la fecha de registro" }
            ]}
          >
            <DatePicker />
          </Form.Item>

          <Form.Item
            label="Cantidad Registrada"
            name="cantidadRegistrada"
            rules={[
              { required: true, message: "Por favor ingresa la cantidad registrada" }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Estado del residuo"
            name="idEstadoResiduo"
            rules={[
              { required: true, message: "Por favor selecciona el estado del residuo" }
            ]}
          >
            <Select>
              {estadosResiduos.map((estado) => (
                <Select.Option key={estado.idEstadoResiduos} value={estado.idEstadoResiduos}>
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
      </div>
    </div>
  );
}

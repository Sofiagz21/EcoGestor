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
  Modal,
  Popconfirm,
} from "antd";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import axiosInstance from "@/axiosInterceptor";
import moment from "moment";

export default function ResiduoPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [estadosResiduos, setEstadosResiduos] = useState<any[]>([]);
  const [usuario, setUsuario] = useState<any>(null);
  const [residuos, setResiduos] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentResiduo, setCurrentResiduo] = useState<any>(null);
  const [form] = Form.useForm();

  //=== API Methods ==//

  const getEstadosResiduos = async () => {
    try {
      const res = await axiosInstance.get("/api/EstadoResiduos");
      if (res.status === 200) {
        setEstadosResiduos(res.data);
      }
    } catch (error) {
      console.error("Error fetching estadosResiduos:", error);
    }
  };

  const getResiduos = async (idUsuario: number) => {
    try {
      const res = await axiosInstance.get(
        `/api/Residuos?Filters=IdUsuario%3D%3D${idUsuario}`
      );
      if (res.status === 200) {
        console.log("Residuos obtenidos:", res.data);
        setResiduos(res.data);
      }
    } catch (error) {
      console.error("Error fetching residuos:", error);
    }
  };

  const createResiduo = async (form: FormData) => {
    try {
      const res = await axiosInstance.post("/api/Residuos", form);
      if (res.status === 201) {
        message.success("Tus residuos fueron creados");
        getResiduos(usuario.idUsuario);
      }
    } catch (error) {
      console.error("Error creando residuo:", error);
      message.error("No fue posible crear el residuo");
    }
  };

  const updateResiduo = async (idResiduo: number, form: FormData) => {
    try {
      const res = await axiosInstance.put(`/api/Residuos/${idResiduo}`, form);
      if (res.status === 200) {
        message.success("Residuo actualizado correctamente");
        getResiduos(usuario.idUsuario);
        setCurrentResiduo(null); // Clear currentResiduo after updating
      }
    } catch (error) {
      console.error("Error actualizando residuo:", error);
      message.error("No fue posible actualizar el residuo");
    }
  };

  const onFinish = async (values: any) => {
    if (!usuario) return;

    setLoading(true);
    const form: FormData = new FormData();
    form.append("IdUsuario", usuario.idUsuario.toString());
    form.append("NombreResiduo", values.nombreResiduo);

    const fechaRegistro = values.fechaRegistro;
    if (moment(fechaRegistro).isValid()) {
      form.append("FechaRegistro", fechaRegistro.format("YYYY-MM-DD"));
    } else {
      console.error("Fecha de registro no válida");
      setLoading(false);
      return;
    }

    form.append("CantidadRegistrada", values.cantidadRegistrada);
    form.append("IdEstadoResiduos", values.idEstadoResiduo);

    try {
      console.log(
        "onFinish called",
        form,
        currentResiduo,
        currentResiduo ? currentResiduo.idResiduo : "No currentResiduo"
      );
      if (currentResiduo && currentResiduo.idResiduo) {
        // Si hay un residuo actual, actualízalo
        form.append("idResiduo", currentResiduo.idResiduo.toString()); // Asegúrate de enviar el ID del residuo existente
        await updateResiduo(currentResiduo.idResiduo, form);
      } else {
        // Si no hay un residuo actual, crea uno nuevo
        await createResiduo(form);
      }
      setIsModalVisible(false); // Cierra el modal después de la creación o actualización
      setLoading(false);
    } catch (err) {
      console.error("Error manejando residuo:", err);
      message.error("No fue posible manejar tus residuos");
      setLoading(false);
    }
  };

  const handleDelete = async (idResiduo: number) => {
    try {
      await axiosInstance.delete(`/api/Residuos/${idResiduo}`);
      message.success("Residuo eliminado correctamente");
      getResiduos(usuario.idUsuario);
    } catch (error) {
      console.error("Error eliminando residuo:", error);
      message.error("No fue posible eliminar el residuo");
    }
  };

  const handleEdit = (residuo: any) => {
    setCurrentResiduo({
      ...residuo,
      fechaRegistro: moment(residuo.fechaRegistro), // Ensure fechaRegistro is a moment object
    });
    form.setFieldsValue({
      ...residuo,
      fechaRegistro: moment(residuo.fechaRegistro), // Set form values
    });
    setIsModalVisible(true);
  };

  const handleCreate = () => {
    setCurrentResiduo(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const onModifyButtonClick = (residuo: any) => {
    console.log(residuo);
    // Aquí va el resto de tu lógica para modificar el residuo
  };

  useEffect(() => {
    const usuarioCookie = Cookies.get("usuario");
    console.log("Usuario Cookie:", usuarioCookie);
    if (usuarioCookie) setUsuario(JSON.parse(usuarioCookie));
    getEstadosResiduos();
  }, []);

  useEffect(() => {
    if (usuario) {
      getResiduos(usuario.idUsuario);
    }
  }, [usuario]);

  return (
    <div className="w-screen h-screen flex justify-center items-center overflow-y-auto">
      <div className="p-2 w-screen h-screen">
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

        <Button type="primary" onClick={handleCreate} className="mt-4">
          Crear Residuo
        </Button>

        {/* Lista de residuos */}
        <div className="mt-8 overflow-auto">
          <Row gutter={[16, 16]}>
            {residuos.length > 0 ? (
              residuos
                .filter((residuo) => residuo.idUsuario === usuario.idUsuario)
                .map((residuo) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={residuo.idResiduos}>
                    <Card title={residuo.nombreResiduo} bordered={false}>
                      <p>Fecha de Registro: {residuo.fechaRegistro}</p>
                      <p>Cantidad Registrada: {residuo.cantidadRegistrada}</p>
                      <p>
                        Estado:{" "}
                        {residuo.estadoResiduos
                          ? residuo.estadoResiduos.nombreEstadoResiduos
                          : "No se ha asignado un estado"}
                      </p>
                      <Button onClick={() => handleEdit(residuo)}>
                        Modificar
                      </Button>
                      <Popconfirm
                        title="¿Estás seguro de eliminar este residuo?"
                        onConfirm={() => handleDelete(residuo.idResiduos)}
                        okText="Sí"
                        cancelText="Cancelar"
                      >
                        <Button danger>Eliminar</Button>
                      </Popconfirm>
                    </Card>
                  </Col>
                ))
            ) : (
              <p>No hay residuos registrados.</p>
            )}
          </Row>
        </div>

        <Modal
          title={currentResiduo ? "Modificar Residuo" : "Crear Residuo"}
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Form
            name="onboarding"
            layout="vertical"
            onFinish={onFinish}
            form={form}
            initialValues={
              currentResiduo
                ? {
                    ...currentResiduo,
                    fechaRegistro: currentResiduo.fechaRegistro
                      ? moment(currentResiduo.fechaRegistro)
                      : null,
                  }
                : {}
            }
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
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                onClick={() => {
                  if (currentResiduo) {
                    console.log(currentResiduo);
                  }
                }}
              >
                {currentResiduo ? "Modificar" : "Registrar"}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}

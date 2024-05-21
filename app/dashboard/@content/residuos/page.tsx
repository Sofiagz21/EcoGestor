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
//icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";

export default function ResiduoPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [estadosResiduos, setEstadosResiduos] = useState<any[]>([]);
  const [usuario, setUsuario] = useState<any>(null);
  const [residuos, setResiduos] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] =
    useState<boolean>(false);
  const [currentResiduo, setCurrentResiduo] = useState<any>(null);
  const [form] = Form.useForm();
  const [formInstance] = Form.useForm();

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
        const url = `/api/Residuos?Filters=IdUsuario%3D%3D${idUsuario}`;
        console.log("Fetching URL:", url);

        const res = await axiosInstance.get(url);
        
        console.log("Response status:", res.status);
        if (res.status === 200) {
            console.log("Response data:", res.data);
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
        await getResiduos(usuario.idUsuario); // Asegúrate de obtener los residuos actualizados
        setIsModalVisible(false); // Cierra el modal después de la creación
      }
    } catch (error) {
      console.error("Error creando residuo:", error);
      message.error("No fue posible crear el residuo");
    } finally {
      setLoading(false); // Asegúrate de desactivar el estado de carga
    }
  };

  const updateResiduoAPI = async (form: FormData) => {
    try {
      const res = await axiosInstance.put(`/api/Residuos/`, form);
      if (res.status === 200) {
        message.success("Residuo actualizado correctamente");
        await getResiduos(usuario.idUsuario); // Asegúrate de obtener los residuos actualizados
        setIsUpdateModalVisible(false); // Cierra el modal después de la actualización
        setCurrentResiduo(null); // Limpia currentResiduo después de actualizar
      }
    } catch (error) {
      console.error("Error actualizando residuo:", error);
      message.error("No fue posible actualizar el residuo");
    } finally {
      setLoading(false); // Asegúrate de desactivar el estado de carga
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

  const onFinishCreate = async (values: any) => {
    if (!usuario) return;

    setLoading(true);
    const form: FormData = new FormData();
    form.append(
      "IdUsuario",
      usuario.idUsuario ? usuario.idUsuario.toString() : ""
    );
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
      await createResiduo(form);
      setCurrentResiduo(null); // Limpia currentResiduo después de actualizar
      formInstance.resetFields(); // Restablece los campos del formulario
    } catch (err) {
      console.error("Error creando residuo:", err);
      message.error("No fue posible manejar tus residuos");
      setLoading(false);
    }
  };

  const onFinishUpdate = async (values: any) => {
    if (!usuario || !currentResiduo) return;

    setLoading(true);
    const form: FormData = new FormData();
    form.append(
      "IdUsuario",
      usuario.idUsuario ? usuario.idUsuario.toString() : ""
    );
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
      if (currentResiduo.idResiduo) {
        form.append("IdResiduo", currentResiduo.idResiduo.toString());
      } else {
        console.error(
          "currentResiduo.idResiduo es inválido:",
          currentResiduo.idResiduo
        );
        setLoading(false);
        return;
      }
      await updateResiduoAPI(form);
    } catch (err) {
      console.error("Error actualizando residuo:", err);
      message.error("No fue posible actualizar el residuo");
      setLoading(false);
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
    setIsUpdateModalVisible(true);
  };

  const handleCreate = () => {
    setCurrentResiduo(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  useEffect(() => {
    const usuarioCookie = Cookies.get("usuario");
    if (usuarioCookie) setUsuario(JSON.parse(usuarioCookie));
    getEstadosResiduos();
  }, []);

  useEffect(() => {
    if (usuario) {
      getResiduos(usuario.idUsuario);
    }
  }, [usuario]);

  return (
    <div className="flex items-center overflow-y-auto">
      <div className="p-3 h-screen box-border">
        <h1 className="text-green text-3xl lg:text-4xl font-extrabold">
          {usuario ? (
            "🌱 ¡Bienvenido a la gestión de residuos!"
          ) : (
            <Skeleton.Input block active />
          )}
        </h1>
        <div className="mt-4 text-gray text-sm lg:text-base">
          {usuario && (
            <>
              Aquí puedes registrar todos los residuos de tu finca. Esta
              información nos ayudará a optimizar la gestión de residuos y a
              mejorar el medio ambiente. Recuerda, cada pequeño paso cuenta para
              un futuro más verde.
              <p className="mt-2 text-green">
                {" "}
                <b>
                  Puedes editar o agregar más registros en cualquier momento.
                </b>
              </p>
            </>
          )}
        </div>

        <Button type="primary" onClick={handleCreate} className="mt-4 ml-auto">
          <FontAwesomeIcon icon={faPlus} className="mr-2" /> Crear Residuo
        </Button>

        <div
          className="mt-8 overflow-auto"
          style={{ width: "100%", height: "100%" }}
        >
          <Row gutter={[16, 16]}>
            {residuos.length > 0 ? (
              residuos
                .filter((residuo) => residuo.idUsuario === usuario.idUsuario)
                .map((residuo) => (
                  <Col xs={24} sm={12} md={8} lg={8} key={residuo.idResiduo}>
                    <Card
                      title={
                        <span style={{ color: "green" }}>
                          {residuo.nombreResiduo}
                        </span>
                      }
                      bordered={true}
                      style={{ borderColor: "#8AC942" }}
                    >
                      <p style={{ color: "green" }}>
                        <strong>📅 Fecha de Registro:</strong>{" "}
                        <span style={{ color: "#000" }}>
                          {residuo.fechaRegistro}
                        </span>
                      </p>
                      <p style={{ color: "green" }}>
                        <strong>📊 Cantidad Registrada:</strong>{" "}
                        <span style={{ color: "#000" }}>
                          {residuo.cantidadRegistrada}
                        </span>
                      </p>
                      <p style={{ color: "green" }}>
                        <strong>✅ Estado:</strong>{" "}
                        <span style={{ color: "#000" }}>
                          {residuo.estadoResiduos
                            ? residuo.estadoResiduos.nombreEstadoResiduos
                            : "No se ha asignado un estado"}
                        </span>
                      </p>
                      <div className="flex justify-between mt-3">
                        <Button
                          onClick={() => handleEdit(residuo)}
                          style={{
                            backgroundColor: "#8AC942",
                            borderColor: "#8AC942",
                            color: "white",
                          }}
                        >
                          <FontAwesomeIcon icon={faEdit} className="mr-2" />
                          Modificar
                        </Button>
                        <Popconfirm
                          title="¿Estás seguro de eliminar este residuo?"
                          onConfirm={() => handleDelete(residuo.idResiduo)}
                          okText="Sí"
                          cancelText="Cancelar"
                        >
                          <Button
                            danger
                            style={{
                              backgroundColor: "#FA6464",
                              borderColor: "#FA6464",
                              color: "white",
                            }}
                          >
                            <FontAwesomeIcon icon={faTrash} className="mr-2" />
                            Eliminar
                          </Button>
                        </Popconfirm>
                      </div>
                    </Card>
                  </Col>
                ))
            ) : (
              <p>No hay residuos registrados.</p>
            )}
          </Row>
        </div>

        <Modal
          title="Crear Residuo"
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Form
            name="createResiduo"
            layout="vertical"
            onFinish={onFinishCreate}
            form={formInstance}
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
        </Modal>

        <Modal
          title="Modificar Residuo"
          visible={isUpdateModalVisible}
          onCancel={() => setIsUpdateModalVisible(false)}
          footer={null}
        >
          <Form
            name="updateResiduo"
            layout="vertical"
            onFinish={onFinishUpdate}
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
              <Button type="primary" htmlType="submit" loading={loading} block>
                Modificar
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}

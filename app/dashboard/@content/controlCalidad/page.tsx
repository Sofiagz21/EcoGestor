"use client";

import { useEffect, useState } from "react";
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
import axiosInstance from "@/axiosInterceptor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";

export default function ControlCalidadPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [usuario, setUsuario] = useState<any>(null);
  const [residuos, setResiduos] = useState<any[]>([]);
  const [metodosControl, setMetodosControl] = useState<any[]>([]);
  const [controlesCalidad, setControlesCalidad] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] =
    useState<boolean>(false);
  const [currentControlCalidad, setCurrentControlCalidad] = useState<any>(null);
  const [form] = Form.useForm();
  const [formInstance] = Form.useForm();
  const [selectedMetodoControl, setSelectedMetodoControl] = useState<
    string | null
  >(null);

  //=== API Methods ==//

  const getResiduos = async () => {
    try {
      const res = await axiosInstance.get("/api/Residuos");
      if (res.status === 200) {
        setResiduos(res.data);
        console.log("Residuos data:", res.data); // Log the residuos data
      } else {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
    } catch (error) {
      console.error("Error al obtener los residuos:", error);
      message.error("Error al obtener los residuos");
    }
  };

  const getMetodosControl = async () => {
    try {
      const res = await axiosInstance.get("/api/MetodoControl");
      if (res.status === 200) {
        setMetodosControl(res.data);
        console.log("MetodoControl data:", res.data); // Log the metodos control data
      } else {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
    } catch (error) {
      console.error("Error al obtener los metodos de control:", error);
      message.error("Error al obtener los métodos de control");
    }
  };

  const getControlesCalidad = async (idUsuario: number) => {
    try {
      const res = await axiosInstance.get("/api/ControlCalidad");
      if (res.status === 200) {
        const filteredData = res.data.filter(
          (control: any) => control.idUsuario === idUsuario
        );
        setControlesCalidad(filteredData);
        console.log("Filtered ControlCalidad data:", filteredData); // Log the filtered controles calidad data
      } else {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
    } catch (error) {
      console.error("Error al obtener los controles de calidad:", error);
      message.error("Error al obtener los controles de calidad");
    }
  };

  const createControlCalidad = async (form: FormData) => {
    try {
      const res = await axiosInstance.post("/api/ControlCalidad", form);
      if (res.status === 201) {
        message.success("Control de calidad creado exitosamente");
        getControlesCalidad(usuario.idUsuario);
        setIsModalVisible(false);
      } else {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
    } catch (error) {
      console.error("Error al crear el control de calidad:", error);
      message.error("Error al crear el control de calidad");
    } finally {
      setLoading(false); // Asegúrate de desactivar el estado de carga
    }
  };

  const updateControlCalidad = async (form: FormData) => {
    try {
      const res = await axiosInstance.put(`/api/ControlCalidad/`, form);
      if (res.status === 200) {
        message.success("Control de calidad actualizado exitosamente");
        await getControlesCalidad(usuario.idUsuario);
        setIsUpdateModalVisible(false);
        setCurrentControlCalidad(null);
      } else {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
    } catch (error) {
      console.error("Error al actualizar el control de calidad:", error);
      message.error("Error al actualizar el control de calidad");
    } finally {
      setLoading(false); // Asegúrate de desactivar el estado de carga
    }
  };

  const handleDelete = async (idControlCalidad: number) => {
    try {
      const res = await axiosInstance.delete(
        `/api/ControlCalidad/${idControlCalidad}`
      );
      if (res.status === 200) {
        message.success("Control de calidad eliminado correctamente");
        getControlesCalidad(usuario.idUsuario);
      } else {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
    } catch (error) {
      console.error("Error eliminando Control de calidad", error);
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

    const fechaControl = values.fechaControl;
    if (moment(fechaControl).isValid()) {
      form.append("FechaControl", fechaControl.format("YYYY-MM-DD"));
    } else {
      console.error("Fecha de registro no válida");
      setLoading(false);
      return;
    }

    form.append("IdResiduo", values.idResiduo);
    form.append("IdMetodoControl", values.idMetodoControl);
    form.append("Observaciones", values.observaciones);

    try {
      await createControlCalidad(form);
      setCurrentControlCalidad(null); // Limpia currentResiduo después de actualizar
      formInstance.resetFields(); // Restablece los campos del formulario
    } catch (err) {
      console.error("Error creando Control de calidad:", err);
      message.error("No fue posible manejar tu control de calidad");
      setLoading(false);
    }
  };

  const onFinishUpdate = async (values: any) => {
    if (!usuario || !currentControlCalidad) return;

    setLoading(true);
    const form: FormData = new FormData();
    form.append(
      "IdUsuario",
      usuario.idUsuario ? usuario.idUsuario.toString() : ""
    );

    const fechaControl = values.fechaControl;
    if (moment(fechaControl).isValid()) {
      form.append("FechaControl", fechaControl.format("YYYY-MM-DD"));
    } else {
      console.error("Fecha de registro no válida");
      setLoading(false);
      return;
    }

    form.append("IdResiduo", values.idResiduo);
    form.append("IdMetodoControl", values.idMetodoControl);
    form.append("Observaciones", values.observaciones);

    try {
      if (currentControlCalidad.idControlCalidad) {
        form.append(
          "IdControlCalidad",
          currentControlCalidad.idControlCalidad.toString()
        );
      } else {
        console.error(
          "currentControlCalidad.idControlCalidad es inválido:",
          currentControlCalidad.idResiduo
        );
        setLoading(false);
        return;
      }
      await updateControlCalidad(form);
    } catch (err) {
      console.error("Error actualizando control de calidad:", err);
      message.error("No fue posible actualizar el control de calidad");
      setLoading(false);
    }
  };

  const handleEdit = (control: any) => {
    setCurrentControlCalidad({
      ...control,
      fechaControl: moment(control.fechaControl), // Ensure fechaControl is a moment object
    });
    form.setFieldsValue({
      ...control,
      fechaControl: moment(control.fechaControl), // Set form values
    });
    setSelectedMetodoControl(control.idMetodoControl); // Set the selected method to display its description
    setIsUpdateModalVisible(true);
  };

  const handleCreate = () => {
    setCurrentControlCalidad(null);
    form.resetFields();
    setSelectedMetodoControl(null); // Clear the selected method when creating
    setIsModalVisible(true);
  };

  const handleMetodoControlChange = (value: string) => {
    setSelectedMetodoControl(value);
  };

  useEffect(() => {
    const usuarioCookie = Cookies.get("usuario");
    if (usuarioCookie) {
      const parsedUsuario = JSON.parse(usuarioCookie);
      setUsuario(parsedUsuario);
      if (parsedUsuario) {
        getResiduos();
        getMetodosControl();
        getControlesCalidad(parsedUsuario.idUsuario);
      }
    }
  }, []);

  return (
    <div className="flex items-center overflow-y-auto">
      <div className="p-3 h-screen box-border">
        <h2 className="text-green text-3xl lg:text-3xl font-extrabold p-3">
          {usuario ? "🛠️ Control de Calidad" : <Skeleton.Input block active />}
        </h2>
        <div className="mt-4 text-gray text-sm lg:text-base">
          {usuario && (
            <>
              Aquí puedes registrar y gestionar todos los controles de calidad
              de los residuos generados en tu finca. Esta información nos
              permitirá asegurar que los residuos sean manejados de manera
              efectiva y segura, contribuyendo a un entorno más saludable y
              sostenible.
              <p className="mt-2 text-green">
                <b>
                  Puedes editar o agregar más controles de calidad en cualquier
                  momento.
                </b>
              </p>
            </>
          )}
        </div>
        <Button type="primary" onClick={handleCreate} className="mt-4 ml-auto">
          <FontAwesomeIcon icon={faPlus} className="mr-2" /> Agregar Control de
          Calidad
        </Button>
        <div
          className="mt-8 overflow-auto"
          style={{ width: "100%", height: "100%" }}
        >
          <Row gutter={[16, 16]}>
            {controlesCalidad.length > 0 ? (
              controlesCalidad
                .filter((control) => control.idUsuario === usuario.idUsuario)
                .map((control) => (
                  <Col xs={24} sm={12} md={8} lg={12} key={control.idResiduo}>
                    <Card
                      title={
                        <span style={{ color: "green" }}>
                          Control de calidad:{" "}
                          <p>
                            {control.residuo
                              ? control.residuo.nombreResiduo
                              : "No se ha asignado un nombre"}
                          </p>
                        </span>
                      }
                      bordered={true}
                      style={{ borderColor: "#8AC942" }}
                    >
                      <p style={{ color: "green" }}>
                        <strong>🌱 Residuo:</strong>{" "}
                        <span style={{ color: "#000" }}>
                          {control.residuo
                            ? control.residuo.nombreResiduo
                            : "No se ha asignado un nombre"}
                        </span>
                      </p>
                      <p style={{ color: "green" }}>
                        <strong>📅 Fecha de Control:</strong>{" "}
                        <span style={{ color: "#000" }}>
                          {control.fechaControl}
                        </span>
                      </p>
                      <p style={{ color: "green" }}>
                        <strong>🔍 Método Control:</strong>{" "}
                        <span style={{ color: "#000" }}>
                          {control.metodoControl
                            ? control.metodoControl.nombreMetodoControl
                            : "No se ha asignado un nombre"}
                        </span>
                      </p>
                      <p style={{ color: "green" }}>
                        <strong>📖 Observaciones:</strong>{" "}
                        <span style={{ color: "#000" }}>
                          {control.observaciones}
                        </span>
                      </p>

                      <Modal
                        title="Crear Control de Calidad"
                        visible={isModalVisible}
                        onCancel={() => setIsModalVisible(false)}
                        footer={null}
                      >
                        <Form
                          name="createControlCalidad"
                          layout="vertical"
                          onFinish={onFinishCreate}
                          form={formInstance}
                        >
                          {/*Residuo*/}
                          <Form.Item
                            label="Residuo"
                            name="idResiduo"
                            rules={[
                              {
                                required: true,
                                message:
                                  "Por favor selecciona el estado el residuo",
                              },
                            ]}
                          >
                            <Select>
                              {residuos.map((residuo) => (
                                <Select.Option
                                  key={residuo.idResiduo}
                                  value={residuo.idResiduo}
                                >
                                  {residuo.nombreResiduo}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                          {/*Fecha*/}

                          <Form.Item
                            label="Fecha de Control"
                            name="fechaControl"
                            rules={[
                              {
                                required: true,
                                message:
                                  "Por favor ingresa la fecha de control",
                              },
                            ]}
                          >
                            <DatePicker />
                          </Form.Item>
                          {/*MetodoControl*/}
                          <Form.Item
                            label="MetodoControl"
                            name="idMetodoControl"
                            rules={[
                              {
                                required: true,
                                message:
                                  "Por favor selecciona el metodo de control",
                              },
                            ]}
                          >
                            <Select onChange={handleMetodoControlChange}>
                              {metodosControl.map((metodo) => (
                                <Select.Option
                                  key={metodo.idMetodoControl}
                                  value={metodo.idMetodoControl}
                                >
                                  {metodo.nombreMetodoControl}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                          {/* Descripción del Método de Control */}
                          {selectedMetodoControl && (
                            <Form.Item label="Descripción del Método de Control">
                              <p>
                                {
                                  metodosControl.find(
                                    (metodo) =>
                                      metodo.idMetodoControl ===
                                      selectedMetodoControl
                                  )?.descripcionMetodoControl
                                }
                              </p>
                            </Form.Item>
                          )}
                          {/*Observaciones*/}
                          <Form.Item name="observaciones" label="Observaciones">
                            <Input.TextArea style={{ height: "200px" }} />
                          </Form.Item>
                          <Form.Item>
                            <Button
                              type="primary"
                              htmlType="submit"
                              loading={loading}
                              block
                            >
                              Registrar
                            </Button>
                          </Form.Item>
                        </Form>
                      </Modal>

                      <div className="flex justify-between mt-3">
                        <Button
                          onClick={() => handleEdit(control)}
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
                          onConfirm={() =>
                            handleDelete(control.idControlCalidad)
                          }
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

        {/* Modal para Modificar Control de Calidad */}
        <Modal
          title="Modificar Control de Calidad"
          visible={isUpdateModalVisible}
          onCancel={() => setIsUpdateModalVisible(false)}
          footer={null}
        >
          <Form
            name="updateControlCalidad"
            layout="vertical"
            onFinish={onFinishUpdate}
            form={form}
          >
            {/*Residuo*/}
            <Form.Item
              label="Residuo"
              name="idResiduo"
              rules={[
                {
                  required: true,
                  message: "Por favor selecciona el estado el residuo",
                },
              ]}
            >
              <Select>
                {residuos.map((residuo) => (
                  <Select.Option
                    key={residuo.idResiduo}
                    value={residuo.idResiduo}
                  >
                    {residuo.nombreResiduo}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            {/*Fecha*/}

            <Form.Item
              label="Fecha de Control"
              name="fechaControl"
              rules={[
                {
                  required: true,
                  message: "Por favor ingresa la fecha de control",
                },
              ]}
            >
              <DatePicker />
            </Form.Item>
            {/*MetodoControl*/}
            <Form.Item
              label="MetodoControl"
              name="idMetodoControl"
              rules={[
                {
                  required: true,
                  message: "Por favor selecciona el metodo de control",
                },
              ]}
            >
              <Select onChange={handleMetodoControlChange}>
                {metodosControl.map((metodo) => (
                  <Select.Option
                    key={metodo.idMetodoControl}
                    value={metodo.idMetodoControl}
                  >
                    {metodo.nombreMetodoControl}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            {/* Descripción del Método de Control */}
            {selectedMetodoControl && (
              <Form.Item label="Descripción del Método de Control">
                <p>
                  {
                    metodosControl.find(
                      (metodo) =>
                        metodo.idMetodoControl === selectedMetodoControl
                    )?.descripcionMetodoControl
                  }
                </p>
              </Form.Item>
            )}
            {/*Observaciones*/}
            <Form.Item name="observaciones" label="Observaciones">
              <Input.TextArea style={{ height: "200px" }} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                Actualizar
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}

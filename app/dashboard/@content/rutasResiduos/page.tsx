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

export default function RutaResiduoPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [usuario, setUsuario] = useState<any>(null);
  const [residuos, setResiduos] = useState<any[]>([]);
  const [estadoRuta, setEstadoRuta] = useState<any[]>([]);
  const [vehiculo, setVehiculo] = useState<any[]>([]);
  const [rutasResiduo, setRutasResiduo] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] =
    useState<boolean>(false);
  const [currentRutaResiduo, setCurrentRutaResiduo] = useState<any>(null);
  const [form] = Form.useForm();
  const [formInstance] = Form.useForm();
  const [selectedRutaResiduo, setSelectedRutaResiduo] = useState<string | null>(
    null
  );

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

  const getEstadosRuta = async () => {
    try {
      const res = await axiosInstance.get("/api/EstadoRuta");
      if (res.status === 200) {
        setEstadoRuta(res.data);
        console.log("EstadoRuta data:", res.data); // Log the metodos control data
      } else {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
    } catch (error) {
      console.error("Error al obtener los estados de ruta:", error);
      message.error("Error al obtener los estados de ruta");
    }
  };

  const getVehiculos = async () => {
    try {
      const res = await axiosInstance.get("/api/Vehiculo");
      if (res.status === 200) {
        setVehiculo(res.data);
        console.log("Vehiculo data:", res.data); // Log the metodos control data
      } else {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
    } catch (error) {
      console.error("Error al obtener los vehiculos:", error);
      message.error("Error al obtener el vehiculo");
    }
  };

  const getRutasRecolecta = async (idUsuario: number) => {
    try {
      const res = await axiosInstance.get("/api/RutaRecoleta");
      if (res.status === 200) {
      console.log("coleta "+res.data);
        const filteredData = res.data.filter(
          (ruta: any) => ruta.idUsuario === idUsuario
        );
        setRutasResiduo(filteredData);
        console.log("Filtered RutaResiduo data:", filteredData); // Log the filtered controles calidad data
      } else {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
    } catch (error) {
      console.error("Error al obtener las rutas de recolecta:", error);
      message.error("Error al obtener las rutas de recolecta ");
    }
  };

  const createRutaResiduo = async (form: FormData) => {
    try {
      const res = await axiosInstance.post("/api/RutaRecoleta", form);
      if (res.status === 201) {
        message.success("Ruta de residuos creada exitosamente");
        getRutasRecolecta(usuario.idUsuario);
        setIsModalVisible(false);
      } else {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
    } catch (error) {
      console.error("Error al crear la ruta de residuos:", error);
      message.error("Error al crear la ruta de residuos");
    } finally {
      setLoading(false); // Asegúrate de desactivar el estado de carga
    }
  };

  const updateRutaResiduo = async (form: FormData) => {
    try {
      const res = await axiosInstance.put(`/api/RutaRecoleta/`, form);
      if (res.status === 200) {
        message.success("Control de calidad actualizado exitosamente");
        await getRutasRecolecta(usuario.idUsuario);
        setIsUpdateModalVisible(false);
        setCurrentRutaResiduo(null);
      } else {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
    } catch (error) {
      console.error("Error al actualizar la ruta de residuos:", error);
      message.error("Error al actualizar la ruta de residuos");
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
        message.success("Ruta de residuos eliminada correctamente");
        getRutasRecolecta(usuario.idUsuario);
      } else {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
    } catch (error) {
      console.error("Error eliminando Ruta de residuos eliminada", error);
      message.error("No fue posible eliminar la ruta de residuos");
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

    form.append("PuntoInicio", values.PuntoInicio);
    form.append("PuntoFin", values.PuntoFin);
    form.append("IdResiduo", values.IdResiduo);
    form.append("IdEstadoRuta", values.idEstadoRuta);
    form.append("IdVehiculo", values.IdVehiculo);

    const fechaRecoleccion = values.fechaRecoleccion;
    if (moment(fechaRecoleccion).isValid()) {
      form.append("FechaControl", fechaRecoleccion.format("YYYY-MM-DD"));
    } else {
      console.error("Fecha de registro no válida");
      setLoading(false);
      return;
    }

    try {
      await createRutaResiduo(form);
      setCurrentRutaResiduo(null); // Limpia currentResiduo después de actualizar
      formInstance.resetFields(); // Restablece los campos del formulario
    } catch (err) {
      console.error("Error creando Control de calidad:", err);
      message.error("No fue posible manejar tu control de calidad");
      setLoading(false);
    }
  };

  const onFinishUpdate = async (values: any) => {
    if (!usuario || !currentRutaResiduo) return;

    setLoading(true);
    const form: FormData = new FormData();
    form.append(
      "IdUsuario",
      usuario.idUsuario ? usuario.idUsuario.toString() : ""
    );

    form.append("PuntoInicio", values.PuntoInicio);
    form.append("PuntoFinal", values.PuntoFinal);
    form.append("IdResiduo", values.IdResiduo);
    form.append("IdEstadoRuta", values.idEstadoRuta);
    form.append("IdVehiculo", values.IdVehiculo);

    const fechaRecoleccion = values.fechaRecoleccion;
    if (moment(fechaRecoleccion).isValid()) {
      form.append("FechaControl", fechaRecoleccion.format("YYYY-MM-DD"));
    } else {
      console.error("Fecha de registro no válida");
      setLoading(false);
      return;
    }

    try {
      if (currentRutaResiduo.idRutaResiduo) {
        form.append(
          "IdRutaResiduo",
          currentRutaResiduo.idRutaResiduo.toString()
        );
      } else {
        console.error(
          "currentRutaResiduo.idRutaResiduo es inválido:",
          currentRutaResiduo.idResiduo
        );
        setLoading(false);
        return;
      }
      await updateRutaResiduo(form);
    } catch (err) {
      console.error("Error actualizando control de calidad:", err);
      message.error("No fue posible actualizar el control de calidad");
      setLoading(false);
    }
  };

  const handleEdit = (ruta: any) => {
    setCurrentRutaResiduo({
      ...ruta,
      fechaRecoleccion: moment(ruta.fechaRecoleccion), // Ensure fechaControl is a moment object
    });
    form.setFieldsValue({
      ...ruta,
      fechaRecoleccion: moment(ruta.fechaRecoleccion), // Set form values
    });
    setSelectedRutaResiduo(ruta.idRutaResiduo); // Set the selected method to display its description
    setIsUpdateModalVisible(true);
  };

  const handleCreate = () => {
    setCurrentRutaResiduo(null);
    form.resetFields();
    setSelectedRutaResiduo(null); // Clear the selected method when creating
    setIsModalVisible(true);
  };

  const handleRutaResiduoChange = (value: string) => {
    setSelectedRutaResiduo(value);
  };

  useEffect(() => {
    const usuarioCookie = Cookies.get("usuario");
    if (usuarioCookie) {
      const parsedUsuario = JSON.parse(usuarioCookie);
      setUsuario(parsedUsuario);
      if (parsedUsuario) {
        getResiduos();
        getEstadosRuta();
        getVehiculos();
        getRutasRecolecta(parsedUsuario.idUsuario);
      }
    }
  }, []);

  // (Código de importación y hooks iniciales no mostrado para brevedad)

return (
  <div className="flex items-center overflow-y-auto">
    <div className="p-3 h-screen box-border">
      <h2 className="text-green text-3xl lg:text-3xl font-extrabold p-3">
        {usuario ? (
          "🚜 Gestión de Rutas de Recolección de Residuos"
        ) : (
          <Skeleton.Input block active />
        )}
      </h2>
      <div className="mt-4 text-gray text-sm lg:text-base">
        {usuario && (
          <>
            Registra y gestiona las rutas de recolección de residuos de tu
            finca. Con esta información, optimizaremos la logística de
            recolección, contribuyendo a un entorno más limpio y sostenible.
            Recuerda, cada acción cuenta para un futuro más verde.
            <p className="mt-2 text-green">
              <b>
                Puedes editar o agregar más rutas de calidad en cualquier
                momento.
              </b>
            </p>
          </>
        )}
      </div>
      <Button type="primary" onClick={handleCreate} className="mt-4 ml-auto">
        <FontAwesomeIcon icon={faPlus} className="mr-2" /> Agregar Ruta de Residuo
      </Button>
      <div
        className="mt-8 overflow-auto"
        style={{ width: "100%", height: "100%" }}
      >
        <Row gutter={[16, 16]}>
          {rutasResiduo.length > 0 ? (
            rutasResiduo
              .filter((ruta) => ruta.idUsuario === usuario.idUsuario)
              .map((ruta) => (
                <Col xs={24} sm={12} md={8} lg={12} key={ruta.idResiduo}>
                  <Card
                    title={
                      <span style={{ color: "green" }}>
                        Ruta de recolección:{" "}
                        <p>
                          {ruta.residuos
                            ? ruta.residuos.nombreResiduo
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
                        {ruta.residuos
                          ? ruta.residuos.nombreResiduo
                          : "No se ha asignado un nombre"}
                      </span>
                    </p>
                    <p style={{ color: "green" }}>
                      <strong>📅 Fecha de Recolección:</strong>{" "}
                      <span style={{ color: "#000" }}>
                        {ruta.fechaRecoleccion}
                      </span>
                    </p>
                    <p style={{ color: "green" }}>
                      <strong>🟢 Punto de Inicio:</strong>{" "}
                      <span style={{ color: "#000" }}>
                        {ruta.puntoInicio}
                      </span>
                    </p>
                    <p style={{ color: "green" }}>
                      <strong>🔴 Punto de Finalización:</strong>{" "}
                      <span style={{ color: "#000" }}>
                        {ruta.puntoFinalizacion}
                      </span>
                    </p>
                    <p style={{ color: "green" }}>
                      <strong>👁️ Estado de la ruta:</strong>{" "}
                      <span style={{ color: "#000" }}>
                        {ruta.estadoRuta
                          ? ruta.estadoRuta.nombreEstadoRuta
                          : "No se ha asignado un nombre"}
                      </span>
                    </p>
                    <p style={{ color: "green" }}>
                      <strong>🚜 Placa Vehículo:</strong>{" "}
                      <span style={{ color: "#000" }}>
                        {ruta.vehiculo
                          ? ruta.vehiculo.placaVehiculo
                          : "No se ha asignado un nombre"}
                      </span>
                    </p>
                    <p style={{ color: "green" }}>
                      <strong>🆎 Tipo Vehículo:</strong>{" "}
                      <span style={{ color: "#000" }}>
                        {ruta.vehiculo && ruta.vehiculo.tipoVehiculo.nombreTipoVehiculo
                          ? ruta.vehiculo.tipoVehiculo.nombreTipoVehiculo
                          : "No se ha asignado un nombre"}
                      </span>
                    </p>
                    
                      {/* Modal para crear ruta de residuos*/}
                      
                      {/* Modal para actualizar ruta de residuos*/}
                      
                      
                      
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    <div className="flex justify-between mt-3">
                      <Button
                        onClick={() => handleEdit(ruta)}
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
                        onConfirm={() => handleDelete(ruta.idRutaResiduo)}
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
            <p>No hay Rutas de Recolecta.</p>
          )}
        </Row>
      </div>
    </div>
  </div>
);

}

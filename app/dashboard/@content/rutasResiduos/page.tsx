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
  
  export default function RutaResiduoPage() {
    const [loading, setLoading] = useState<boolean>(false);
    const [estadoRuta, setEstadoRuta] = useState<any[]>([]); // estados de tuta
    const [usuario, setUsuario] = useState<any>(null);
    const [vehiculo, setVehiculo] = useState<any[]>([]); // vehiculos
    const [residuo, setResiduo] = useState<any[]>([]); // residos
    const [rutaRecolecta, setRutaRecolecta] = useState<any[]>([]); // rutas recolecta
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [isUpdateModalVisible, setIsUpdateModalVisible] =
      useState<boolean>(false);
    const [currentRuta, setCurrentRuta] = useState<any>(null);
    const [form] = Form.useForm();
    const [formInstance] = Form.useForm();
  
    //API METHODS
  
    const getEstadosRuta = async () => {
      try {
        const res = await axiosInstance.get("/api/EstadoRuta");
        if (res.status === 200) {
          setEstadoRuta(res.data);
        }
      } catch (error) {
        console.log("Error getting estadoRuta", error);
      }
    };
  
    const getVehiculos = async () => {
      try {
        const res = await axiosInstance.get("/api/Vehiculo");
        if (res.status === 200) {
          setVehiculo(res.data);
        }
      } catch (error) {
        console.log("Error getting vehiculos", error);
      }
    };
  
    const getResiduos = async () => {
      try {
        const res = await axiosInstance.get("/api/Residuos");
        if (res.status === 200) {
          setResiduo(res.data);
        }
      } catch (error) {
        console.log("Error getting residuos", error);
      }
    };
  
    const getRutasRecolecta = async () => {
      try {
        const res = await axiosInstance.get("/api/RutaRecolecta");
        if (res.status === 200) {
          console.log("Rutas recolecta data:", res.data);
          setRutaRecolecta(res.data);
        }
      } catch (error) {
        console.error("Error fetching rutasRecolecta:", error);
      }
    };
  
    const createRutaRecolecta = async (form: FormData) => {
      try {
        const res = await axiosInstance.post("/api/RutaRecolecta", form);
        if (res.status === 201) {
          message.success("Tus rutas fueron creadas");
          await getRutasRecolecta(); // Asegúrate de obtener las rutas actualizadas
          setIsModalVisible(false); // Cierra el modal después de la creación
        }
      } catch (error) {
        console.error("Error creating rutaRecolecta", error);
        message.error("No fue posible crear la ruta");
      } finally {
        setLoading(false); // Asegúrate de desactivar el estado de carga
      }
    };
  
    const updateRutaRecolecta = async (form: FormData) => {
      try {
        const res = await axiosInstance.put(`/api/RutaRecolecta/`, form);
        if (res.status === 200) {
          message.success("Ruta actualizada correctamente");
          await getRutasRecolecta(); // Asegúrate de obtener las rutas actualizadas
          setIsUpdateModalVisible(false); // Cierra el modal después de la actualización
          setCurrentRuta(null);
        }
      } catch (error) {
        console.log("Error Actualizando residuo: ", error);
        message.error("No fue posible actualizar la ruta");
      } finally {
        setLoading(false); // Asegúrate de desactivar el estado de carga
      }
    };
  
    const handleDelete = async (idRutaRecolecta: number) => {
      try {
        await axiosInstance.delete(`/api/RutaRecolecta/${idRutaRecolecta}`);
        message.success("Ruta eliminada correctamente");
        getRutasRecolecta();
      } catch (error) {
        console.error("Error eliminando ruta:", error);
        message.error("No fue posible eliminar la ruta");
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
  
      form.append("PuntoInicio", values.puntoInicio);
      form.append("PuntoFinal", values.puntoFin);
      form.append("IdEstadoRuta", values.idEstadoRuta);
      form.append("IdVehiculo", values.idVehiculo);
      form.append("IdResiduo", values.idResiduo);
  
      const fechaRecoleccion = values.fechaRecoleccion;
      if (moment(fechaRecoleccion).isValid()) {
        form.append("FechaRecoleccion", fechaRecoleccion.format("YYYY-MM-DD"));
      } else {
        console.error("Fecha de recoleccion no válida");
        setLoading(false);
        return;
      }
  
      try {
        await createRutaRecolecta(form);
        setCurrentRuta(null); // Limpia currentResiduo después de actualizar
        formInstance.resetFields(); // Restablece los campos del formulario
      } catch (err) {
        console.error("Error creando ruta:", err);
        message.error("No fue posible manejar tu ruta");
        setLoading(false);
      }
    };
  
    const onFinishUpdate = async (values: any) => {
      if (!usuario || !currentRuta) return;
  
      setLoading(true);
      const form: FormData = new FormData();
      form.append("PuntoInicio", values.puntoInicio);
      form.append("PuntoFinal", values.puntoFin);
      form.append("IdEstadoRuta", values.idEstadoRuta);
      form.append("IdVehiculo", values.idVehiculo);
      form.append("IdResiduo", values.idResiduo);
  
      const fechaRecoleccion = values.fechaRecoleccion;
      if (moment(fechaRecoleccion).isValid()) {
        form.append("FechaRecoleccion", fechaRecoleccion.format("YYYY-MM-DD"));
      } else {
        console.error("Fecha de recoleccion no válida");
        setLoading(false);
        return;
      }
  
      try {
        if (currentRuta.idRutaRecolecta) {
          form.append("IdRutaRecolecta", currentRuta.idRutaRecolecta.toString());
        } else {
          console.error(
            "currentResiduo.idRutaRecolecta es inválido:",
            currentRuta.idRutaRecolecta
          );
          setLoading(false);
          return;
        }
        await updateRutaRecolecta(form);
      } catch (err) {
        console.error("Error actualizando ruta:", err);
        message.error("No fue posible actualizar tu ruta");
        setLoading(false);
      }
    };
  
    const handleEdit = (ruta: any) => {
      setCurrentRuta({
        ...ruta,
        fechaRecoleccion: moment(ruta.fechaRecoleccion), // Ensure fechaRegistro is a moment object
      });
      form.setFieldsValue({
        ...ruta,
        fechaRecoleccion: moment(ruta.fechaRecoleccion), // Set form values
      });
      setIsUpdateModalVisible(true);
    };
  
    const handleCreate = () => {
      setCurrentRuta(null);
      form.resetFields();
      setIsModalVisible(true);
    };
  
    useEffect(() => {
      const usuarioCookie = Cookies.get("usuario");
      if (usuarioCookie) setUsuario(JSON.parse(usuarioCookie));
      getEstadosRuta();
      getVehiculos();
      getResiduos();
      getRutasRecolecta();
    }, []);
  
    useEffect(() => {
      if (usuario) {
        getRutasRecolecta();
      }
    }, [usuario]);
  
    return (
      <div className="flex items-center overflow-y-auto">
        <div className="p-3 h-screen box-border">
          <h2 className="text-green text-3xl lg:text-3xl font-extrabold p-3">
            {usuario ? (
              "🛣️📋 ¡Bienvenido a la gestión del registro de recolección de tus residuos! "
            ) : (
              <Skeleton.Input block active />
            )}
          </h2>
          <div className="mt-4 text-gray text-sm lg:text-base">
            {usuario && (
              <>
                Completa la información requerida para registrar una nueva ruta de
                recolección de residuos. Esta información nos ayudará a planificar
                y optimizar el proceso de recolección.
                <p className="mt-2 text-green">
                  {" "}
                  <b>Puedes editar o agregar más rutas en cualquier momento.</b>
                </p>
              </>
            )}
          </div>
          <Button type="primary" onClick={handleCreate} className="mt-4 ml-auto">
            <FontAwesomeIcon icon={faPlus} className="mr-2" /> Crear Ruta de Recolección
          </Button>
          <div
            className="mt-8 overflow-auto"
            style={{ width: "100%", height: "100%" }}
          >
            <Row gutter={[16, 16]}>
              {rutaRecolecta.length > 0 ? (
                rutaRecolecta
                  .filter((rutaRecolecta) => rutaRecolecta.idUsuario === usuario.idUsuario)
                  .map((rutaRecolecta) => (
                    <Col xs={24} sm={12} md={8} lg={8} key={rutaRecolecta.idRutaRecolecta}>
                      
                    </Col>
                  ))
              ) : (
                <p>No hay residuos registrados.</p>
              )}
            </Row>
          </div>
          
          
          
        </div>
      </div>
    );
  }
  
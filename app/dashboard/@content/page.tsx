'use client'

import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export default function ContentPage() {
    const [userInfo, setUserInfo] = useState({ firstName: "", lastName: "" });

    useEffect(() => {
        const usuarioCookie = Cookies.get("usuario");
        if (usuarioCookie) {
            const usuario = JSON.parse(usuarioCookie);
            setUserInfo({ firstName: usuario.nombresUsuario, lastName: usuario.apellidosUsuario });
        }
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-full text-green">
            <h1 className="text-4xl font-bold mb-4">
                ¡Hola! {userInfo.firstName} {userInfo.lastName}!
            </h1>
            <p className="text-lg">¡Bienvenido a la página de inicio</p>
        </div>
    );
}
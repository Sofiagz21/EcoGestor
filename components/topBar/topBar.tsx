'use client'

import Cookies from 'js-cookie';
import { useEffect, useState } from "react";

// Images
import axiosInstance from '@/axiosInterceptor';
import Logo from '@/public/img/tabi-logo.svg';
import { DownOne, User } from '@icon-park/react';
import type { MenuProps } from 'antd';
import { Avatar, Dropdown } from 'antd';
import { AxiosResponse } from 'axios';


export default function TopBar() {

    // User state
    const [usuario, setUsuario] = useState<AuthResponse | null>(null);

    const [partidas, setPartidas] = useState<PartidaResponse[] | null>([]);


    //=== API Methods ===//
    const getPartidas = async () => {
        try {
            const res: AxiosResponse<PartidaResponse[]> = await axiosInstance.get("/api/Partida?Filters=IdUsuario%3D%3D" + usuario?.idUsuario);
            console.log(res.data);
            setPartidas(res.data);
            if (res.data.length > 0 && !Cookies.get('current_partida_id'))
                Cookies.set("current_partida_id", res.data[0].idPartida.toString());
        } catch (err) {
            console.log(err);
        }
    }

    const setCurrentPartida = (idPartida: number) => {
        Cookies.set("current_partida_id", idPartida.toString());
    }

    const logout = () => {
        Cookies.remove("token");
        Cookies.remove("usuario");
        window.location.href = "/login";
    }


    //=== UseEffects ===//
    useEffect(() => {
        // Set user cookies
        const usuarioCookie = Cookies.get("usuario");
        if (usuarioCookie) setUsuario(JSON.parse(usuarioCookie));
    }, []);

    useEffect(() => {
        console.log('From TopBar', usuario);
        if (usuario) getPartidas();
    }, [usuario]);


    // Dropdown menu items
    const items: MenuProps['items'] = [
        {
            key: '0',
            label: 'Perfil',
            onClick: () => console.log('Profile')
        },
        {
            key: '1',
            label: 'Cerrar sesión',
            onClick: () => logout()
        }
    ];


    return (
        <header className="sticky top-0 z-1 w-full flex justify-between items-center px-8 py-4 bg-green-300 lg:bg-white text-brown border border-b border-brown/15  ">
            <div>
                hola
            </div>

            <div>
                <Dropdown menu={{ items }} trigger={['click']}>
                    <button className="flex items-center justify-between gap-2 p-2 px-4 rounded-lg border-0 hover:bg-brown/10  ">
                        <div className='flex items-center gap-2'>
                            <Avatar style={
                                {
                                    backgroundColor: '#ADE679',
                                    verticalAlign: 'middle',
                                    padding: '1.1rem',
                                }
                            }
                            >
                                <User theme="outline" size="1.25rem" fill="#412F26" />
                            </Avatar>
                            <span className='font-extrabold'>{usuario?.nombresUsuario}</span>
                            <DownOne theme='filled' size="1rem" fill="#412F26" />
                        </div>


                    </button>
                </Dropdown>
            </div>

        </header>
    )
}
//@ts-nocheck
"use client";
import { Button } from 'primereact/button';
import { useEffect, useState } from "react";
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import React, { useRef } from 'react';
import { io } from "socket.io-client";
import { ListBox } from 'primereact/listbox';


export default function ChatComponent() {
    const [isConnected, setIsConnected] = useState(false);
    const [transport, setTransport] = useState("N/A");
    const [visible, setVisible] = useState(false);
    const [value, setValue] = useState('');
    const [selectedSala, setSelectedSala] = useState(null);
    const [socket, setSocket] = useState(null);
    const [usuarioSelec, setUsuarioSelec] = useState(null)

    const Salas = [
        { name: 'Indemnizaciones' },
        { name: 'Danilo' }
    ];

    const cities = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ];


    const toast = useRef(null);
    useEffect(() => {
        if (socket) {

            if (socket.connected) {
                onConnect();
            }

            function onConnect() {
                setIsConnected(true);
                setTransport(socket.io.engine.transport.name);

                socket.io.engine.on("upgrade", (transport) => {
                    setTransport(transport.name);
                });
            }

            function onDisconnect() {
                setIsConnected(false);
                setTransport("N/A");
            }

            socket.on("connect", onConnect);
            socket.on("disconnect", onDisconnect);
            socket.on("unido", (data) => {
                if (toast) {
                    toast.current.show({ severity: 'info', summary: 'Info', detail: data });
                }
            })
            socket.on("evaluando", (data) => {
                if (toast) {
                    toast.current.show({ severity: 'info', summary: 'info', detail: data });
                }
            })


            return () => {
                socket.off("connect", onConnect);
                socket.off("disconnect", onDisconnect);
            };
        }

        /* const prueba = (io) => {
            io.emit("evaluando",`Evaluando`)
            console.log("evaluamdo")
          } */
    }, []);


    return (
        <div className='flex w-full justify-content-between '>
            <div>
            <Toast ref={toast} position="bottom-center" />
            <p>Status: {isConnected ? "connected" : "disconnected"}</p>
            <p>Transport: {transport}</p>

            <Button label="Show" icon="pi pi-external-link" onClick={() => setVisible(true)} />
            <Dialog header="Seleccion:" visible={visible} onHide={() => {
                if (!visible) return;
                setSelectedSala(null)
                setVisible(false)
            }}>
                <div className="flex flex-column gap-2">
                    <InputText value={value} onChange={(e) => setValue(e.target.value)} className='w-full' />
                    <Dropdown value={selectedSala} onChange={(e) => setSelectedSala(e.value)} options={Salas} optionLabel="name"
                        placeholder="Select a Sala" className="w-full " />
                    <Button label="Submit" className='w-full' onClick={async () => {
                        if (!socket) {
                            const socket_ = await io(`http://8.20.0.5:3003`)


                            if (socket_) {
                                setSocket(socket_)
                                socket_.emit("unirse", {
                                    "usuario": value,
                                    "cuarto": selectedSala.name
                                })

                                setIsConnected(true)
                                setTransport(socket_.io.engine.transport.name)
                            }

                        }

                    }} />
                </div>
            
            </Dialog>
            </div>
            
            <div className='flex w-3 '>
                <ListBox value={usuarioSelec} onChange={(e) => setUsuarioSelec(e.value)} options={cities} optionLabel="name" className="w-full h-screen" />
            </div>
        </div>
    );
}
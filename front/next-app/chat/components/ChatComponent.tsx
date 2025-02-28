//@ts-nocheck
"use client";
import { Button } from 'primereact/button';
import { useContext, useEffect, useState } from "react";
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import React, { useRef } from 'react';
import { io } from "socket.io-client";
import { ListBox } from 'primereact/listbox';
import { AplicacionContext } from '@/context/AppContext';


interface ChatComponentProps {
    salas: any
}



export default function ChatComponent({
    salas
}) {
    const {socket,setSocket}=useContext(AplicacionContext)
    const [isConnected, setIsConnected] = useState(false);
    const [transport, setTransport] = useState("N/A");
    const [visible, setVisible] = useState(false);
    const [value, setValue] = useState('');
    const [selectedSala, setSelectedSala] = useState(null);
    // const [socket, setSocket] = useState(null);
    const [usuarioSelec, setUsuarioSelec] = useState(null);
    const [salasServidor, setSalasServidor] = useState(null);
    const toast = useRef(null);
    const [lastMesseg, setLastMesseg] = useState(null);
    useEffect(() => {
        if (!salasServidor) {
            setSalasServidor(salas)
        }

    }, [])

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
                console.log("data",data)

                if (toast) {
                    toast.current.show({ severity: 'info', summary: 'Info', detail: JSON.stringify(socket) + JSON.stringify(data) });
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




    }, [lastMesseg]);


    return (
        <div className='flex w-full justify-content-between '>
            <div>
                <Toast ref={toast} position="bottom-center" />
                <p>Status: {isConnected ? "connected" : "disconnected"}</p>
                <p>Transport: {transport}</p>
                <p>Ultimo mensaje: {lastMesseg}</p>

                <Button label="Show" icon="pi pi-external-link" onClick={() => setVisible(true)} />
                <Dialog header="Seleccion:" visible={visible} onHide={() => {
                    if (!visible) return;
                    setSelectedSala(null)
                    setVisible(false)
                }}>
                    <div className="flex flex-column gap-2">
                        <InputText value={value} onChange={(e) => setValue(e.target.value)} className='w-full' />
                        <Dropdown value={selectedSala} onChange={(e) => setSelectedSala(e.value)} options={salasServidor}
                            placeholder="Select a Sala" className="w-full "
                            optionLabel='nombre'
                        
                            />
                        <Button label="Submit" className='w-full' onClick={async () => {
                            if (!socket) {
                                const socket_ = await io(`http://8.20.0.5:3003`)
                                setSocket(socket_)
                            }
                            if (socket && value && selectedSala) {

                                socket.emit("unirse", {
                                    "usuario": value,
                                    "cuarto": selectedSala.nombre
                                })
                                setLastMesseg(new Date().toLocaleString("ES-CO")) 
                                setIsConnected(true)
                                setTransport(socket.io.engine.transport.name)
                            }
                            else {
                                toast.current.show({ severity: 'error', summary: 'error', detail: 'Faltan datos' });
                            }

                        }} />
                    </div>

                </Dialog>
            </div>

            <div className='flex w-3' >
                <ListBox value={usuarioSelec} onChange={(e) => setUsuarioSelec(e.value)} options={[]} optionLabel="name" className="w-full h-screen " />
            </div>


        </div>
    );
}
//@ts-nocheck
"use client"
import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Prisma } from "@prisma/client";
import { io, Socket } from "socket.io-client";

export default function FormularioComponent() {
    const [sala, setSala] = useState('');
    const [socket, setSocket] = useState(null);
    const [usuario, setUsuario] = useState(null);
    return (


        <div style={{ backgroundColor: "var(--surface-200)", height: "100vh", width: "100vw" }}>
            <div className="card w-24rem p-4 flex justify-content-center">
                <Card title="Sala">
                    <div className="card flex flex-column gap-3" >
                        <InputText value={sala} onChange={(e) => setSala(e.target.value)} placeholder="Ingresar Sala" />
                        <Button label="Enviar" onClick={async () => {
                            if (!socket) {
                                const socket = await io('http://8.20.0.5:3003')
                                setSocket(socket)


                            }
                            if (socket) {
                                socket.emit("creacion-sala", sala)


                            }

                        }} />
                    </div>
                </Card>
            </div>

            <div>
                <div className="card w-24rem p-4 flex justify-content-center">
                    <Card title="Usuario ">
                        <div className="card flex flex-column gap-3" >
                            <InputText value={usuario ? usuario : ''} onChange={(e) => setUsuario(e.target.value)} placeholder="Ingresa Usuario" />
                            <Button label="Enviar" onClick={ async () => {
                                if (!socket) {
                                    const socket = await io('http://8.20.0.5:3003')
                                        setSocket(socket)
                                        
                                    
                                }
                                if (socket) {
                                    socket.emit("creacion-usuario",usuario)
                                }

                            }} />
                        </div>
                    </Card>
                </div>


            </div>
        </div>
    )


}
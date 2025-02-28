//@ts-nocheck
"use client"

import { Card } from 'primereact/card';
import React, { useContext, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from 'primereact/button';
import { Socket } from 'socket.io-client';
import { AplicacionContext } from '@/context/AppContext';


export default function AutenticadoComponent() {

    const { socket, setSocket } = useContext(AplicacionContext)

    const [value, setValue] = useState('');


    return (
        <div>
            <div className="card w-28rem">
                <Card title="Mensaje">
                    <div className='p-2 border-1' style={{ backgroundColor: "var(--surface-200)", borderRadius: "0.5rem" }}>
                        <p className='p-1 w-10rem h-2rem' style={{ borderRadius: "0.5rem" }}>
                            nombre
                        </p>
                        <p className='p-1 w-10rem h-2rem ' style={{ borderRadius: "0.5rem" }}>
                            Mensaje
                        </p>
                    </div>
                    <div className='flex w-full gap-2 justify-content-center '>
                        <InputText className=' mt-2 ' placeholder='Texto' value={value} onChange={(e) => setValue(e.target.value)} />
                        <Button className='mt-2' icon="pi pi-send" tooltip='Enviar' onClick={() => {
                            socket.emit("GuardarChat", {

                            })

                        }} />
                    </div>

                </Card>
            </div>
        </div>
    )

}
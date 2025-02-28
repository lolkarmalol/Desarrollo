// server/index.ts
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { config } from './config';
import moment from 'moment-timezone';
moment.locale('es-CO');
moment.tz.setDefault('America/Bogota');
import { PrismaClient } from '@prisma/client'

// Configuración de polling para Socket.IO

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    },
});


io.on('connection', async (socket) => {



    console.log("Se ha conectado un nuevo usuario")

    socket.on("unirse", (data) => {
        console.log("data", data);
        socket.join(data.cuarto);
        io.to(data.cuarto).emit("unido", `Hola, Se ha unido, ${data.usuario} al chat de ${data.cuarto}.`)

    })
});


const prueba = (io: Server) => {
    io.emit("evaluando", `Evaluando`)
    console.log("evaluamdo")
}

setInterval(() => {
    prueba(io)
}, 5000)

setInterval(() => {

}

)




// ...existing code...

// Iniciar servidor
httpServer.listen(config.port, config.host, () => {
    console.log(`Servidor WebSocket escuchando en ${config.host}:${config.port}`);
});


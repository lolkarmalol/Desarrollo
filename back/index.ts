// server/index.ts
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { config } from './config';
import moment from 'moment-timezone';
moment.locale('es-CO');
moment.tz.setDefault('America/Bogota');
import { PrismaClient } from '@prisma/client'
import { Socket } from 'dgram';
import { emit } from 'process';

// Configuración de polling para Socket.IO

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    },
});

app.get('/api/salas', async (req, res) => {
    try {
        const salas = await prisma.room.findMany();
        res.json(salas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las salas' });
    }
});

const prisma = new PrismaClient()


io.on('connection', async (socket) => {



    console.log("Se ha conectado un nuevo usuario")



    socket.on("unirse", async (data) => {
        console.log("data", data);

        const user = await prisma.user.findUnique({
            where: {
                name: data.usuario
            }
        })

        if (user) {
            socket.join(data.cuarto);
            io.to(data.cuarto).emit("unido", `Hola, Se ha unido, ${data.usuario} al chat de ${data.cuarto}.`)
            return
        }
        socket.emit("unido", {
            status: "Error"
        })
        

    })


    socket.on("creacion-sala", async (data) => {
        console.log("sala", data);
        const sala = await prisma.room.create({
            data: {
                nombre: data,
                userActivos: {},
                chat: {
                    create: {

                    }
                }
            },
        })

    })

    socket.on("creacion-usuario", async (data) => {
        console.log("usuario", data);
        const usuario = await prisma.user.create({
            data: {
                name: data

            }

        })
    }
    )



});



const prueba = (io: Server) => {
    io.emit("evaluando", `Evaluando`)
    console.log("evaluamdo")
}

setInterval(() => {
    prueba(io)
}, 60 * 1000)

setInterval(() => {

}

)




// ...existing code...

// Iniciar servidor
httpServer.listen(config.port, config.host, () => {
    console.log(`Servidor WebSocket escuchando en ${config.host}:${config.port}`);
});


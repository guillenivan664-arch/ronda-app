const io = require('socket.io')(process.env.PORT || 3000, {
    cors: { origin: "*" } // Permite que se conecten desde cualquier lado
});

let salas = {};

io.on('connection', (socket) => {
    socket.on('crear-sala', (salaID) => {
        socket.join(salaID);
        salas[salaID] = { jugadores: [socket.id], mazo: [], mesa: [] };
        console.log(`Sala ${salaID} creada`);
    });

    socket.on('unirse-sala', (salaID) => {
        if (salas[salaID]) {
            socket.join(salaID);
            salas[salaID].jugadores.push(socket.id);
            io.to(salaID).emit('jugador-conectado', salas[salaID].jugadores.length);
        }
    });

    socket.on('accion-juego', (datos) => {
        // Reenvía la jugada (carta tirada, canto, etc.) a todos en la sala
        socket.to(datos.salaID).emit('actualizar-juego', datos);
    });
});

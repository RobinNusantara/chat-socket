const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer);

const users = [
    {
        "id": 1,
        "name": "Robin",
        "type": "Employee"
    },
    {
        "id": 2,
        "name": "Vito",
        "type": "Employee"
    },
];


io.on("connection", (socket) => {
    console.log(socket.id);
    console.log("Connected to socket");

    socket.on("sendMessage", (payload) => {
        const user = {
            id: payload.id,
            name: payload.name,
        };

        users.push(user);
        socket.join(user.id);
        io.to(user.id).emit("sendMessage", user);
        io.emit("getMessages", users);
    });

    socket.on("getMessages", (payload) => {
        console.log(payload.user.id);
        const values = users.filter((user) => user.type === payload.user.type);

        io.to(socket.id).emit("getMessages", values);
    })

    io.on("disconnect", (reason) => {
        const message = `Socket ${socket.id} disconnected due to ${reason}`;
        console.error(message)
    });
});

httpServer.listen(3000);

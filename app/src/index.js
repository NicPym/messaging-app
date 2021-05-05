import { io } from 'socket.io-client';

let socket = io('http://localhost:8080', {
    auth: {
        token: "BBDMESSAGING12341"
    }
});

if (socket)
    socket.on("connect_error", (err) => {
        console.log(err.message);
    });

    socket.emit('send message', { message: "Hello, World!" });

document.getElementById("testButton").onclick = test;

function test() {
    console.log("Hello, World!");
};
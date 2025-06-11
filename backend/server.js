import { Socket, Server } from "socket.io";
import http from "http";
import { app } from "./app.js";
import { config } from "dotenv";
import { MongoDbConnection } from "./config.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "./config.js";


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

config({
  path: "./config.env",
});

io.on("connection", (socket) => {
  socket.on("joinRoom",(room)=>{
    socket.join(room)
  })
  socket.on("updateBalance",(token,roomNo,balance)=>{
    jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
      if (decoded){
        console.log("updatingData")
        socket.to(roomNo).emit("bidAmount",balance)
      }
    })
  })
});



server.listen(8000, () => {
  console.log("Server is running on port 8000");
});

await mongoose.connect(MongoDbConnection,{
  bufferCommands: false, // Disable command buffering
}).then(
  ()=>console.log("Connected to MongoDB"),
).catch(
  (error)=>console.log("failed to connect " + error)
);

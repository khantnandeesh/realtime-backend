const { WebSocketServer } = require("ws");

const wss2 = new WebSocketServer({ port: process.env.PORT });
// const wss2 = new WebSocketServer({ port: 8090 });
let obj = [];
let msg = {};
let obj2 = [];

// wss.on("connection", (socket) => {
//   console.log("connection");

//   socket.on("message", (e) => {
//     let parseObj = JSON.parse(e.toString());

//     if (parseObj.type == "join") {
//       let elem = {
//         name: parseObj.payload.name,
//         socket,
//         roomId: parseObj.payload.roomId,
//       };
//       obj.push(elem);
//       let room = parseObj.payload.roomId;
//       room = room.toString();

//       let resObj = { data: msg[room] };

//       console.log(resObj);
//       console.log(msg);

//       socket.send(JSON.stringify(resObj));
//     }

//     if (parseObj.type == "msg") {
//       let obj1 = "";
//       obj.forEach((SOCKET) => {
//         SOCKET.socket == socket ? (obj1 = SOCKET) : null;
//       });
//       let { name, roomId } = obj1;
//       let time = new Date();
//       let chat = parseObj.payload.chat;
//       let elem = { name, msg: chat, time };
//       console.log(msg);

//       if (!msg[roomId]) {
//         msg[roomId] = [elem];
//       } else {
//         console.log("cache hit!");

//         msg[roomId].push(elem);
//       }

//       console.log(obj);
//       console.log(roomId);
//       console.log(msg);
//       obj.forEach((bigSocket) => {
//         if (bigSocket.roomId == roomId) {
//           bigSocket.socket.send(JSON.stringify(elem));
//         }
//       });
//     }
//   });
// });

wss2.on("connection", (socket) => {
  socket.on("message", (e) => {

    let parseObj;
    
    
    try{
        parseObj=JSON.parse(e.toString());
    }
    catch(err){console.log("audio buffer reaching quick!");
    }
    if (parseObj&&parseObj.type == "join") {
      let elem = {
        name: parseObj.payload.name,
        socket,
        roomId: parseObj.payload.roomId,
      };
      obj2.push(elem);
      console.log("AUDIO STREAM SUCCESS!");
      
      
    } else {
        let arrayBuffer = e;
        console.log(arrayBuffer);
        
        let roomId;
        obj2.map((BIGSOCKET) => {
            if (BIGSOCKET.socket == socket) {
            BIGSOCKET.roomId = roomId;
            }
        });
        let arr = msg[roomId];
        obj2.map((BIGSOCKET) => {
        if (BIGSOCKET.roomId == roomId && BIGSOCKET.socket != socket) {
          BIGSOCKET.socket.send(arrayBuffer);
        }
      });
    }
  });
});

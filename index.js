const { WebSocketServer } = require("ws");

// const wss = new WebSocketServer({ port:8080});
const wss2 = new WebSocketServer({  port: process.env.PORT});
let obj = [];
let msg = {};


// wss.on("connection", (socket) => {


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

// wss2.on("connection", (socket) => {
//   socket.on("message", (e) => {

//     let parseObj;
    
    
//     try{
//         parseObj=JSON.parse(e.toString());
//     }
//     catch(err){console.log("audio buffer reaching quick!");
//     }
//     if (parseObj&&parseObj.type == "join") {
//       let elem = {
//         name: parseObj.payload.name,
//         socket,
//         roomId: parseObj.payload.roomId,
//       };
//       obj2.push(elem);
//       console.log("AUDIO STREAM SUCCESS!");
      
      
//     } else {
//         let arrayBuffer = e;
//         console.log(arrayBuffer);
        
//         let roomId;
//         obj2.map((BIGSOCKET) => {
//             if (BIGSOCKET.socket == socket) {
//             BIGSOCKET.roomId = roomId;
//             }
//         });
//         let arr = msg[roomId];
//         obj2.map((BIGSOCKET) => {
//         if (BIGSOCKET.roomId == roomId && BIGSOCKET.socket != socket) {
//           BIGSOCKET.socket.send(arrayBuffer);
//         }
//       });
//     }
//   });
// });


let emailTosocket=new Map();
let socketToemail=new Map();

let joined = []
let done=false
wss2.on("connection",(socket)=>{
    if(joined.length==2){
        joined=[];
        emailTosocket=new Map();
        socketToemail=new Map();
        
    }
    console.log("connecting!");
    
    socket.on("message",(e)=>{

            
        let obj=JSON.parse(e.toString());
        let {type}=obj
        if(type=='del' && !done){
            done=true;
            joined=[];
            emailTosocket=new Map();
            socketToemail=new Map();

        }
        if(type=="joined"){
            let {email,roomId}=obj.payload;
            emailTosocket.set(email,socket)
            socketToemail.set(socket,email)
            if(joined.length<2){
                joined.push(socket)
            }

            if(joined.length==2){
                let newObj={
                    type:"new-user",
                    payload:{
                        email
                    }
                   
                }
                joined.forEach((SOCKET)=>{
                    if(SOCKET != socket){
                        SOCKET.send(JSON.stringify(newObj))
                    }
                })
            }

          


        }
        

        if(type=='offer'){
            let {offer,senderEmail}=obj.payload;
            
            let newObj={
                type:'offer-conform',
                payload:{
                    offer
                }

            }

            joined.forEach((SOCKET)=>{
                if(socket!=SOCKET){
                    SOCKET.send(JSON.stringify(newObj))
                }
            })
            
        }

        if(type=='answer'){
            let {answer}=obj.payload
            let newObj={
                type:'answer-verify',
                payload:{   
                    email:socketToemail.get(socket),
                    answer
                }
            }
            
            joined.forEach((SOCKET)=>{
                if(SOCKET!=socket){
                    SOCKET.send(JSON.stringify(newObj))
                }
            })
           
        }
        

        if(type=='success'){
            let newObj={type:'success'}
            joined.forEach((SOCKET)=>{
                if(SOCKET!=socket){
                    SOCKET.send(JSON.stringify(newObj))
                }
            })
        }


    })
})




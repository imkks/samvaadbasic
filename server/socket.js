import WebSocket from 'websocket'
const WebSocketServer=WebSocket.server
// I'm maintaining all active connections in this object
var connections = {};
var connectionIDCounter = 0;
export function initialize(server)
{

    const websocket=new WebSocketServer({"httpServer":server})
    websocket.on("request",request=>{
        //request.key
        let userid=request.key;
    console.log((new Date()) + ' Recieved a new connection from origin ' + request.origin + '.');
  // You can rewrite this part of the code to accept only the requests from allowed origin
  //const connection = request.accept(null, request.origin);
    let myconnection=request.accept(null,request.origin);
    myconnection.id= connectionIDCounter++;
    connections[myconnection.id]=myconnection
    console.log((new Date()) + ' Connection ID ' + myconnection.id + ' accepted.');
    myconnection.on("close",function(reasonCode, description) 
    {
        
        console.log((new Date()) + ' Peer ' + myconnection.remoteAddress + ' disconnected.');
        delete connections[myconnection.id];
        broadcast(JSON.stringify({msg:myconnection.user,code:-1}))
    });
    myconnection.on("message",(message)=>
    {
        if (message.type === 'utf8')
         {
            console.log('Received Message: ' + message.utf8Data);
            let ms=JSON.parse(message.utf8Data)
            if(ms.code==0)
                {
                    myconnection.user=ms.msg;
            groupMessage(myconnection,message.utf8Data)

                }
            else
            {
                groupMessage(myconnection,JSON.stringify({msg:ms.msg,code:1,user:myconnection.user}))
            }
            //myconnection.sendUTF(JSON.stringify(Object.getOwnPropertyNames(clients)));
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            myconnection.sendBytes(message.binaryData);
        }   
    })


})
}
// Broadcast to all open connections
function broadcast(data) {
    Object.keys(connections).forEach(function(key) {
        var connection = connections[key];
        if (connection.connected) {
            connection.send(data);
        }
    });
}
function groupMessage(myconn,data)
{
    Object.values(connections).forEach(function(conn)
    {
        if (conn!=myconn && conn.connected) {
            conn.send(data);
        }
        
    })
}
// Send a message to a connection by its connectionID
function sendToConnectionId(connectionID, data) {
    var connection = connections[connectionID];
    if (connection && connection.connected) {
        connection.send(data);
    }
}
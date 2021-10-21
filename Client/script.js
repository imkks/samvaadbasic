//Create WebSocket connection.
$(window).on('load', function() {
    $('#myModal').modal('show');
});
function initialize()
{


const socket = new WebSocket('ws://192.168.1.130:8888');

// Connection opened
socket.addEventListener('open', function (event) {
    let user=document.forms["login"]["email"].value

    socket.send(JSON.stringify({msg:user,code:0}));
});
socket.addEventListener('close',function(event){
    socket.send('User left the chat')
})
// Listen for messages
socket.addEventListener('message', function (event) {
    let data=JSON.parse(event.data)
    console.log('Message from server ', data);
    var li=document.createElement('li');
    let node;
    if(data.code==-1)
    {
    li.classList.add("w-25","bg-danger","mx-auto","text-center");
    node=document.createTextNode(data.msg+" has left the chat");

    }
    else if(data.code==0)
    {
    li.classList.add("w-25","bg-success","mx-auto","text-center");
    node=document.createTextNode(data.msg+" has joined the chat");
        
    }
    else if(data.code==1)
    {   var messagetext=document.createTextNode(data.msg)
        var h2=document.createElement("h2");
        h2.appendChild(messagetext);
        li.appendChild(h2);
        node=document.createTextNode(" from "+data.user);

    li.classList.add("bg-secondary","text-white","mr-5");

    }
    li.classList.add("list-group-item")

    li.appendChild(node);
   // li.setAttribute("class","list-group-item bg-warning text-dark")

    var ul= document.getElementById('msgchat');
    ul.appendChild(li);
});
function sendMessage(msg)
{
    socket.send(JSON.stringify({msg,code:1}));
}
document.getElementById("mysendbutton").addEventListener("click",()=>{
    let textarea=document.getElementById("messageinput");
    let text=textarea.value
    textarea.value=''
    console.log(text);
    sendMessage(text);
    var node=document.createTextNode(text);
    var div=document.createElement('div');
    div.classList.add("float-right")
    div.appendChild(node);
    var li=document.createElement('li');
    li.classList.add("list-group-item","bg-light","text-dark","ml-5","text-right")

   // li.class="list-group-item bg-primary text-white float-right"
    li.appendChild(div);
    var ul= document.getElementById('msgchat');
    ul.appendChild(li);
});
return false;

}
//initialize()

document.getElementById("getusername").onclick=initialize


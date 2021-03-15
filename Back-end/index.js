// const mainRouter=require("./routers/mainRouter");
// const bodyparser=require("body-parser");


const app=require("express")();

const server=app.listen(4000);

const io=require("socket.io")(server);


// app.use(bodyparser.urlencoded({extended:true}));
// app.use(mainRouter);


io.on('connection', socket => {
    console.log("client has connected");
    socket.on('message', ({ name, message }) => {
        io.emit('message', { name, message })
    })

    socket.on("messageSent",(data)=>{
        console.log(data);
        io.emit("messageSent",data);
        
    })

    socket.on("change-room",({roomToJoin,roomToQuit})=>{
        
        if(roomToQuit){
            socket.leave(roomToQuit);
        }
        if(roomToJoin){
            socket.join(roomToJoin);
        }
        
        console.log("user just changed rooms to ",roomToJoin);
    })
})


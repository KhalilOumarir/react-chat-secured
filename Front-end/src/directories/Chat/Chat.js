import React,{useEffect,useRef,useState,useContext} from "react";
import './Chat.css';
import {Redirect} from "react-router-dom";
import speechBubble from "../../images/icons&illustrations/speech-bubble.svg";
import InputField from "./InputField";
import OnlineCount from "./OnlineCount";
import ChatRoom from "./ChatRoom";
import io from "socket.io-client";
import {UsernameContext} from "../../contexts/userData.context";
import axios from "axios";
import CircularProgress from '@material-ui/core/CircularProgress';
import MessageContainer from "./MessagesContainer";

var connectionOptions =  {
    "force new connection" : true,
    "reconnectionAttempts": "Infinity", 
    "timeout" : 10000,                  
    "transports" : ["websocket"],
    "query":{
        "authToken":window.localStorage.getItem("authToken")
    }
};



const socket=io.connect('http://localhost:4000',connectionOptions);
const Chat = (props) => {

    
   
    const [messagesDisplay,setMessagesDisplay]=useState([]);
    const [loading,setLoading]=useState(true);
    
    const [JwtTokenError,setJwtTokenError]=useState("");
    const value=(useContext(UsernameContext));
    const socketRef=useRef(socket);
    const [messageSent,setMessageSent]=useState();
    
    useEffect(async()=>{
        
        try {
            const result=await axios.get("http://localhost:4000/chat",{
                headers:{
                    "authToken":`Bearer ${window.localStorage.getItem("authToken") || ""}`
                }
            })
             //assign the username result to the username context so we can show it in the message displayed in the front-end user
             value[0].setUsername(result.data.username)
             //also set the the avatarImage context so we use it to send messages , instead of fetching the avatar data everytime
             value[3].setAvatarImage(result.data.avatarImage.toString("base64"));
        } catch (err) {
            if(err){
                if(err.response){
                     // go to the sign in page  
                    setJwtTokenError(err.response.data);
                }
             
            }
        }
       

        return ()=>{
            socketRef.current.emit("disconnect");
            socketRef.current.off();
        }
        
    },[props.history])
    
    
    useEffect(()=>{
      
        //confirms the message has been successfully sent , so make the text returns to its solid form
        // socketRef.current.on("")

       
        socketRef.current.on("previous-messages",(data)=>{
            //remove all the messages displayed and assign it new ones 
            
            setMessagesDisplay([...data])
            
            
        })
        socketRef.current.on("bitch",(data)=>console.log(data));
        
        
    },[])

    const [avatarImages,setAvatarImages]=useState(1);
    useEffect(()=>{
        socketRef.current.on("messageSent",(data)=>{
            console.log("message received");
            setMessagesDisplay(messagesDisplay=>[...messagesDisplay,{message:data.message,username:data.username,avatarImage:data.avatarImage}]);
            setMessageSent(false);
        })
    },[])
  
   


    const addMessageToChat=(data)=>{
        //when user submits a message,add it to his front-end with the fading effect
        // const temp={message:data.message,username:value[0].username,fading:data.fading,avatarImage:value[3].avatarImage}
        // setMessagesDisplay([...messagesDisplay,temp])
        socketRef.current.emit("messageSent",{message:data.message,avatarImage:value[3].avatarImage});
        setMessageSent(true);
    }
    
    


  

    return (
        // this is the container that holds all the elements in the chat page
        <>
        
         <div className="Chat" >
            {JwtTokenError.length ? <Redirect to={{
                pathname:"/sign-in",
                state:{
                    JwtTokenError
                }
            }}  /> : null}
            <div className="Chat-options">
                {/* this is the container that will hold the UI/UX for rooms,messages etc */}
                <img className="Chat-icons" src={speechBubble} alt="" />
            </div>
            <div className="Chat-container" >
                {/* This is the container that holds the all the rooms available in the application and the chat field and chat history , this part will have the flex display */}
                <section className="Chat-rooms" >
                    {/* this is where the rooms are going to show up */}
                    <ChatRoom socket={socketRef} />
                </section>

                <section className="Chat-chat" >
                    {/* this is where the chat components are gonna be at */}
                    <div>
                        {/* this is where the amount of people that are online gonna be displayed */}
                        <OnlineCount socket={socketRef} />
                    </div>
                    
                    <MessageContainer messagesDisplay={messagesDisplay} socketRef={socketRef} />
                    <InputField messageSent={messageSent} socket={socketRef} addMessageToChat={addMessageToChat} />
                    
                </section>

            </div>
        </div>
        </>
    )
}


export default Chat;
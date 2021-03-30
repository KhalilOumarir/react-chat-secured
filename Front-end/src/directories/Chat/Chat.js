import React,{useEffect,useRef,useState,useContext} from "react";
import './Chat.css';
import {Redirect} from "react-router-dom";
import speechBubble from "../../images/icons&illustrations/speech-bubble.svg";
import InputField from "./InputField";
import Message from "./Message";
import OnlineCount from "./OnlineCount";
import ChatRoom from "./ChatRoom";
import io from "socket.io-client";
import {UsernameContext} from "../../contexts/userData.context";
import axios from "axios";



var connectionOptions =  {
    "force new connection" : true,
    "reconnectionAttempts": "Infinity", 
    "timeout" : 10000,                  
    "transports" : ["websocket"]
};


const socket=io.connect('http://localhost:4000',connectionOptions);

const Chat = (props) => {

    
   
    const [messagesDisplay,setMessagesDisplay]=useState([]);
    
    const socketRef=useRef(socket);
    const [JwtTokenError,setJwtTokenError]=useState("");
    const value=(useContext(UsernameContext));
    

    useEffect(()=>{
        console.log(value);
        axios.get("http://localhost:4000/chat",{
            headers:{
                "authToken":`Bearer ${window.localStorage.getItem("authToken") || ""}`
            }
        }).then(()=>{
            console.log("sent");
        })
        .catch((err)=>{
            // go to the sign in page  
            setJwtTokenError(err.response.data);
        })

    },[])


    useEffect(()=>{
      

        socketRef.current.on("messageSent",(msg)=>{
            setMessagesDisplay([...messagesDisplay,msg]);
        })
        
        
    },[messagesDisplay])

    
    



    const displayMessages=()=>{
        return (
            messagesDisplay.map((message)=>{
                return (<Message message={message} />)
            })
        )
    }
  
  

    return (
        // this is the container that holds all the elements in the chat page
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
                        <OnlineCount />
                    </div>
                    
                    <div className="Chat-chat-whatever" >
                        {/* this is where the messages gonna be displayed */}
                        {displayMessages()}

                    </div>
                    <InputField  socket={socketRef} />
                    
                </section>

            </div>
        </div>
    )
}


export default Chat;
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
    "transports" : ["websocket"],
    "query":{
        "authToken":window.localStorage.getItem("authToken")
    }
};



const socket=io.connect('http://localhost:4000',connectionOptions);
const Chat = (props) => {

    
   
    const [messagesDisplay,setMessagesDisplay]=useState([]);
    
    
    const [JwtTokenError,setJwtTokenError]=useState("");
    const value=(useContext(UsernameContext));
    const socketRef=useRef(socket);
    
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
            if(err){
                if(err.response){
                     // go to the sign in page  
                    setJwtTokenError(err.response.data);
                }
             
            }
        })
        
    },[])
    
    
    useEffect(()=>{
      

        socketRef.current.on("messageSent",(data)=>{
            
            setMessagesDisplay([...messagesDisplay,data]);
        })
        
        socketRef.current.on("previous-messages",(data)=>{
            //remove all the messages displayed and assign it new ones 
            
            setMessagesDisplay([...data])
            
            
        })
        
    },[messagesDisplay])

    
    



    const displayMessages=()=>{
        
        return (
            messagesDisplay.map((data)=>{
                return (<Message message={data.message} username={data.username} />)
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
                        <OnlineCount socket={socketRef} />
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
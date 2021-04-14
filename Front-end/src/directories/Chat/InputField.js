import React,{useState,useContext,useEffect} from 'react';
import UserPicture from "../../images/Avatar-imgs/American.png";
import SubmitIcon from "../../images/icons&illustrations/right-arrow.svg";
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import "./css/InputField.css"
import {UsernameContext} from "../../contexts/userData.context";
import axios from "axios";



const InputField = (props) => {

    

    const {socket,addMessageToChat,messageSent}=props;

    const [messageInput,setMessageInput]=useState("");
    const value=useContext(UsernameContext);
    const [typingUsernames,setTypingUsernames]=useState([]);
    const imageData=value[3].avatarImage;
    useEffect(()=>{
        //this hook will initialise the listeners
        socket.current.on("user-has-typed", (usernames) => {
            
            setTypingUsernames(usernames);
        })
        socket.current.on("user-stopped-typing",(usernames)=>{
            console.log(usernames);
            setTypingUsernames(usernames);
        })
    },[])

    const handleInputChange=(evt)=>{
        setMessageInput(evt.target.value);
        
        if(evt.target.value.length){
            //make the username dynamic because on listen , the server filters only to the names that don't exist
            //in the array of people who are typing
            socket.current.emit("user-is-typing",{usernameToken:window.localStorage.getItem("authToken")});
        }else{
            socket.current.emit("user-stopped-typing", {usernameToken:window.localStorage.getItem("authToken")});
        }
    }

    
    const handleFormSubmit=async(evt)=>{
        evt.preventDefault();
        
        
        const message=messageInput;
        setMessageInput("");
        
        addMessageToChat({message:message,fading:true});

        //notify that the user has stopped typing
        socket.current.emit("user-stopped-typing", {usernameToken:window.localStorage.getItem("authToken")});
        
        
    }

    

    const displayTypingUsers=()=>{
        
        return (
            <p className="InputField-typingUsers" > {typingUsernames.length ? typingUsernames.toString() + " is typing... "  : null } </p>
        )
    }

    return (
        <form  onSubmit={handleFormSubmit}  className="InputField-form" >
            <div className="InputField" >
                
                <Avatar  alt="user-picture" src={imageData ? `data:image/jpeg;base64,${imageData}`:null} >
                    {imageData ? null : value[0].username[0]}
                </Avatar>
                <div>
                <input  value={messageInput} onChange={handleInputChange} className="Chat-chat-input" type="text" placeholder="Write a reply" />
                <button  className="Chat-chat-input-submit" ><img className="Chat-chat-input-sendIcon" src={SubmitIcon} alt="" /></button>
                </div>
                
            </div>
            {displayTypingUsers()}
        </form>
    )
}


export default InputField;
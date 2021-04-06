import React,{useState,useContext,useEffect} from 'react';
import UserPicture from "../../images/Avatar-imgs/American.png";
import SubmitIcon from "../../images/icons&illustrations/right-arrow.svg";
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import "./css/InputField.css"
import {UsernameContext} from "../../contexts/userData.context";
import axios from "axios";



const InputField = (props) => {

    

    const {socket}=props;

    const [messageInput,setMessageInput]=useState("");
    const value=useContext(UsernameContext);
    const [typingUsernames,setTypingUsernames]=useState([]);

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
        
        socket.current.emit("messageSent",messageInput);
        const message=messageInput;
        setMessageInput("");
        
        axios.post("http://localhost:4000/chat",{message:message,roomJoined:value[1].roomJoined,fromUser:window.localStorage.getItem("authToken")},{timeout:6000}).then(()=>console.log("posted a message in the Database"));
        
    }

    

    const displayTypingUsers=()=>{
        
        return (
            <p className="InputField-typingUsers" > {typingUsernames.length ? typingUsernames.map((typingUser)=>(`${typingUser},`))  : null } is typing... </p>
        )
    }

    return (
        <form onSubmit={handleFormSubmit}  className="InputField-form" >
            <div className="InputField" >
                <Avatar  alt="user-picture" src={UserPicture} />
                <div>
                <input  value={messageInput} onChange={handleInputChange} className="Chat-chat-input" type="text" placeholder="Write a reply" />
                <button className="Chat-chat-input-submit" ><img className="Chat-chat-input-sendIcon" src={SubmitIcon} alt="" /></button>
                </div>
                
            </div>
            {displayTypingUsers()}
        </form>
    )
}


export default InputField;
import React,{useState,useContext} from 'react';
import UserPicture from "../../images/Avatar-imgs/American.png";
import SubmitIcon from "../../images/icons&illustrations/right-arrow.svg";
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import "./css/InputField.css"
import {UsernameContext} from "../../contexts/userData.context";


const InputField = (props) => {

    const {socket}=props;

    const [messageInput,setMessageInput]=useState("");
    const {roomJoined,setRoomJoined}=useContext(UsernameContext);

    const handleInputChange=(evt)=>{
        
        setMessageInput(evt.target.value);
    }

    const handleFormSubmit=(evt)=>{
        evt.preventDefault();
        
        socket.current.to(roomJoined).emit("messageSent",messageInput);

        setMessageInput("");
    }

    return (
        <form onSubmit={handleFormSubmit}  className="InputField-form" >
            <div className="InputField" >
                <Avatar alt="user-picture" src={UserPicture} />
                <div>
                <input value={messageInput} onChange={handleInputChange} className="Chat-chat-input" type="text" placeholder="Write a reply" />
                <button className="Chat-chat-input-submit" ><img className="Chat-chat-input-sendIcon" src={SubmitIcon} alt="" /></button>
                </div>
                
            </div>
            <p className="InputField-typingUsers" >Somebody is typing...</p>
        </form>
    )
}


export default InputField;
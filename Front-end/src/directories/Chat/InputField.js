import React,{useState,useContext,useEffect} from 'react';
import SubmitIcon from "../../images/icons&illustrations/right-arrow.svg";
import Avatar from '@material-ui/core/Avatar';
import "./css/InputField.css"
import {UsernameContext} from "../../contexts/userData.context";
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import IconButton from '@material-ui/core/IconButton';
import {makeStyles} from '@material-ui/styles'
import Badge from '@material-ui/core/Badge';




const useStyles=makeStyles({
    icon:{
        color:"red",
    }
})


const InputField = (props) => {

    const classes=useStyles();

    const {socket,addMessageToChat,setMessageSent,messageSent,messagesCounter}=props;

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
        if(!messageSent){
  
            const message=messageInput;
            setMessageInput("");
            
            addMessageToChat({message:message,fading:true});
            
            //notify that the user has stopped typing
            socket.current.emit("user-stopped-typing", {usernameToken:window.localStorage.getItem("authToken")});
        }
      
        
        
    }

    

    const displayTypingUsers=()=>{
        
        return (
            <p className="InputField-typingUsers" > {typingUsernames.length ? typingUsernames.toString() + " is typing... "  : null } </p>
        )
    }

    const handleToBottomClick=()=>{
        setMessageSent(true);
    }

    return (
        <form  onSubmit={handleFormSubmit}  className="InputField-form" >
            <div className="InputField" >
                
                <Avatar  alt="user-picture" src={imageData ? `data:image/jpeg;base64,${imageData}`:null} >
                    {imageData ? null : value[0].username[0]}
                </Avatar>
                <div>
                <input  value={messageInput} onChange={handleInputChange} className="Chat-chat-input" type="text" placeholder="Write a reply" />
                <button  className="Chat-chat-input-submit"><img className="Chat-chat-input-sendIcon" src={SubmitIcon} alt="" /></button>
                </div>
                
                <Badge color="secondary" badgeContent={messagesCounter}>
                    <IconButton onClick={handleToBottomClick} >
                    <KeyboardArrowDownIcon className={classes.icon} />
                    </IconButton>
                </Badge>
                
            </div>
            
            {displayTypingUsers()}
        </form>
    )
}


export default InputField;
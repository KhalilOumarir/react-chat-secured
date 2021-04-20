import React,{useEffect,useState} from "react";
import Avatar from '@material-ui/core/Avatar';
import "./css/Message.css";
import {makeStyles} from "@material-ui/styles";


const useStyles=makeStyles({
    fade:{
        opacity:"0.5"
    },
    solid:{
        opacity:"1"
    }
})



const Message = (props) => {

    const {message,username,socket}=props;
    const [faded,setFaded]=useState(props.fading);
    const classes=useStyles();

    useEffect(()=>{
        socket.current.on("message-successfully-sent",(data)=>{
            setFaded(data);
        })
        
        
    },[])

    const displayMessages=()=>{
        if(username){
            return (
                <section className={faded ? classes.fade : classes.solid} >
                    <hr className="Message-hr"/>
                    <div className="Message" >
                        
                    <Avatar className="Message-avatar" src={props.avatarImage ? `data:image/jpeg;base64,${(props.avatarImage)}`:null} alt="" >
                            {props.avatarImage ?null:username[0]}</Avatar>
                        <p className="Message-message" >{username}: {message}</p>
                    </div>
                </section>
        
            )
        }
        else{
            return (
                <section className={faded ? classes.fade : classes.solid} >
                    <div className="Message" >
                        <p className="Message-message sameUser" > {message}</p>
                    </div>
                </section>
        
            )
        }
    }

    return (
        displayMessages()
    )
}

export default Message;
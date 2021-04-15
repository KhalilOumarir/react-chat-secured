import React,{useState,useEffect} from "react";
import {v4 as uuid} from "uuid";
import Message from "./Message";





const MessageContainer=(props)=>{
    const {setMessageSent,messageSent}=props;
    const scrollRef = React.useRef(null);
    
  
    
    const {messagesDisplay,socketRef}=props;
    //checks who is the username who sent the last message 
    const scrollToBottom=()=>{
        scrollRef.current.scrollTop=scrollRef.current.scrollHeight;
        
    }
    useEffect(()=>{
        if(messageSent){
            scrollToBottom()
            setMessageSent(false)
        }
        
    },[messageSent])
    
    useEffect(()=>{
        if(scrollRef.current.scrollTop!==scrollRef.current.scrollHeight){
            console.log("show icon");
        }
    },[messagesDisplay])

    const displayMessages=()=>{
        
        
        
        return (
            messagesDisplay.map((data,index)=>{
                let lastMsgUsername="";
                if(index-1>=0){
                    lastMsgUsername=messagesDisplay[index-1].username;
                }
                if(data.username==lastMsgUsername){
                    
                    return (<Message  key={uuid()} message={data.message} username={null} socket={socketRef}  fading={data.fading ? true:false}
                    avatarImage={data.avatarImage ? data.avatarImage : ""}/>
                    )
                }
                else{
                    
                    return (<Message  key={uuid()} message={data.message} username={data.username} socket={socketRef}  fading={data.fading ? true:false}
                    avatarImage={data.avatarImage ? data.avatarImage : ""}/>)
                }
               
            })
        )
    }


   

    return(
        <div className="Chat-chat-whatever"  ref={scrollRef}>
            {/* this is where the messages gonna be displayed */}
            
            
            {displayMessages()}
            
            

        </div>
    )

} 



export default MessageContainer;
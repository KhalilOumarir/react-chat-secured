import React,{useEffect} from "react";
import {v4 as uuid} from "uuid";
import Message from "./Message";





const MessageContainer=(props)=>{
    
    const scrollRef = React.useRef(null);
    
  
    
    const {messagesDisplay,socketRef,messagesCounter,setMessagesCounter,setMessageSent,messageSent}=props;
    //checks who is the username who sent the last message 
    const scrollToBottom=()=>{
        scrollRef.current.scrollTop=scrollRef.current.scrollHeight;
        setMessagesCounter(0);
    }
    useEffect(()=>{
        if(messageSent){
            scrollToBottom()
            setMessageSent(false)
        }
        
    },[messageSent])
    
    useEffect(()=>{
        if(scrollRef.current.scrollTop!==scrollRef.current.scrollHeight){
            setMessagesCounter(messagesCounter+1);
        }
        
    },[messagesDisplay])

    const displayMessages=()=>{
        
        return (
            messagesDisplay.map((data,index)=>{
                let lastMsgUsername="";
                if(index-1>=0){
                    lastMsgUsername=messagesDisplay[index-1].username;
                }
                if(data.username===lastMsgUsername){
                    
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


    const handleOnScroll=(evt)=>{
        //fix this so it works
        if(scrollRef.current.scrollTop===scrollRef.current.scrollHeight){
            console.log("what")
        }
    }

    return(
        <div className="Chat-chat-whatever" onScroll={handleOnScroll}  ref={scrollRef}>
            {/* this is where the messages gonna be displayed */}
            {displayMessages()}
        </div>
    )

} 



export default MessageContainer;
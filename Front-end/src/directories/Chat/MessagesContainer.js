import React,{useState} from "react";
import {v4 as uuid} from "uuid";
import Message from "./Message";

const MessageContainer=(props)=>{


 
    const {messagesDisplay,socketRef}=props;
    //checks who is the username who sent the last message 
   

    const displayMessages=()=>{
        
        
        
        return (
            messagesDisplay.map((data,index)=>{
                let lastMsgUsername="";
                if(index-1>=0){
                    lastMsgUsername=messagesDisplay[index-1].username;
                }
                if(data.username==lastMsgUsername){
                    console.log("same username");
                    return (<Message  key={uuid()} message={data.message} username={null} socket={socketRef}  fading={data.fading ? true:false}
                avatarImage={data.avatarImage ? data.avatarImage : ""}/>)
                }
                else{
                    console.log("not the same username");
                    return (<Message  key={uuid()} message={data.message} username={data.username} socket={socketRef}  fading={data.fading ? true:false}
                    avatarImage={data.avatarImage ? data.avatarImage : ""}/>)
                }
               
            })
        )
    }



  
    return(
        <div className="Chat-chat-whatever"   >
            {/* this is where the messages gonna be displayed */}
            
            
            {displayMessages()}
            
           

        </div>
    )

} 



export default MessageContainer;
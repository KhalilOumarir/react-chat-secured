import React,{useState,useContext} from "react";
import "./css/ChatRoom.css";
import {UsernameContext} from "../../contexts/userData.context";



const ChatRoom=(props)=>{
    const {socket}=props;

    const value=useContext(UsernameContext);
  
    const [rooms,setRooms]=useState(["GeneralChat","Requests","News"])
    


    const handleChangeRoomClick=(evt)=>{
        console.log(value[1]);
        const roomJoined=value[1].roomJoined;
        
        socket.current.emit("change-room",{roomToJoin:evt.target.outerText,roomToQuit:roomJoined});
        value[1].setRoomJoined(evt.target.outerText);
    }


    const displayRooms=()=>{
        return (
            rooms.map((room)=>{
                return <li><button onClick={handleChangeRoomClick} className="ChatRoom-roomsLists-room" >{room}</button></li>
            })
        )
    }



    return (
        <div className="ChatRoom">
            <h4 className="ChatRoom-namespace" >General Discussion</h4>
            <ul className="ChatRoom-roomsLists">
               {displayRooms()}
                
            </ul>
        </div>
    )
}

export default ChatRoom;
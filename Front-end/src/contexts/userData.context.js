import React,{createContext,useState} from "react";


export const UsernameContext=createContext();

const UsernameProvider=(props)=>{

    const [username,setUsername]=useState("name");
    const [roomJoined,setRoomJoined]=useState("");

    return (
        <UsernameContext.Provider value={[{username,setUsername},{roomJoined,setRoomJoined}]} >
            {props.children}
        </UsernameContext.Provider>
    )
}

export default UsernameProvider;
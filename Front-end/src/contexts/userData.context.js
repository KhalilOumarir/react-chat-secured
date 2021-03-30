import React,{createContext,useState} from "react";


export const UsernameContext=createContext();

const UsernameProvider=(props)=>{

    const [username,setUsername]=useState("name");
    const [roomJoined,setRoomJoined]=useState("");
    const [authToken,setAuthToken]=useState("");

    return (
        <UsernameContext.Provider value={[{username,setUsername},{roomJoined,setRoomJoined},{authToken,setAuthToken}]} >
            {props.children}
        </UsernameContext.Provider>
    )
}

export default UsernameProvider;
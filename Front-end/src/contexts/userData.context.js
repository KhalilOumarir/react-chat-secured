import React,{createContext,useState} from "react";


export const UsernameContext=createContext();

const UsernameProvider=(props)=>{

    const [username,setUsername]=useState("");
    const [roomJoined,setRoomJoined]=useState("");
    const [authToken,setAuthToken]=useState("");
    const [avatarImage,setAvatarImage]=useState("");

    return (
        <UsernameContext.Provider value={[{username,setUsername},{roomJoined,setRoomJoined},{authToken,setAuthToken},{avatarImage,setAvatarImage}]} >
            {props.children}
        </UsernameContext.Provider>
    )
}

export default UsernameProvider;
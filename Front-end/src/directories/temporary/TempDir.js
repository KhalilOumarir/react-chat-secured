import React,{useState,useContext} from "react";
import {UsernameContext} from "../../contexts/userData.context";
import axios from "axios";

const TempDir=(props)=>{

    const {history}=props;
    
    const [username,setUsername]=useState("");

    const value=useContext(UsernameContext);

    const handluserInput=(evt)=>{
        setUsername(evt.target.value);
    }

    const handleFormSubmit=(evt)=>{
        evt.preventDefault();
        value.setUsername(username);
        history.push("/chat");
        
    }

    const showValue=()=>{
        console.log(value);
    }

return(
    <>
    <form action="" onSubmit={handleFormSubmit} >
        <input type="text" onChange={handluserInput}/>
        <button>Submit</button>
        
    </form>
    <button onClick={showValue} >show value</button>
    </>
)
}


export default TempDir;
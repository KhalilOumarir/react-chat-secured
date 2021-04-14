import React,{useState,useEffect,useContext} from 'react';
import PeopleCountIcon from "../../images/icons&illustrations/User-friends.svg";
import "./css/OnlineCount.css";
import {UsernameContext} from "../../contexts/userData.context";

const OnlineCount = (props) => {

    const value=useContext(UsernameContext);
    const [count,setCount]=useState(0);
    const [onlineUsers,setOnlineUsers]=useState([]);
    useEffect(()=>{
        props.socket.current.on("random-online-users",(data)=>{
            setOnlineUsers([...data]);
        })
    },[])
    useEffect(()=>{
        console.log(value[1].roomJoined);
        props.socket.current.on(`users-online-${value[1].roomJoined}`,(number)=>{
            
            setCount(number);
        })

       
    },[value[1].roomJoined])


    return (
        <div className="OnlineCount" >
            <section>
                <img src={PeopleCountIcon} alt="" className="OnlineCount-users-online-icon" />
                <p className="OnlineCount-users-online-count" >{count}</p>
            </section>
            <section className="OnlineCount-users-online-names" >
                <p>Online: </p>
                <p>{onlineUsers.toString()}</p>
            </section>
        </div>
    )
}

export default OnlineCount;
import React from "react";
import Avatar from '@material-ui/core/Avatar';
import UserPicture from "../../images/Avatar-imgs/American.png";
import "./css/Message.css";



const Message = (props) => {

    const {message,username}=props;

    return (
        <>
            <hr className="Message-hr"/>
            <div className="Message" >

                <Avatar className="Message-avatar" src={UserPicture} alt="" />
                <p className="Message-message" >{username}: {message}</p>
            </div>
        </>

    )
}

export default Message;
import React from 'react';
import PeopleCountIcon from "../../images/icons&illustrations/User-friends.svg";
import "./css/OnlineCount.css";


const OnlineCount = () => {
    return (
        <div className="OnlineCount" >
            <section>
                <img src={PeopleCountIcon} alt="" className="OnlineCount-users-online-icon" />
                <p className="OnlineCount-users-online-count" >2</p>
            </section>
            <section className="OnlineCount-users-online-names" >
                <p>Online:</p>
                <p>Mackenzie,Heinrich,Tomislava,Jūratė... </p>
            </section>
        </div>
    )
}

export default OnlineCount;
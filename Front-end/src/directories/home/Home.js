import React from 'react';
import "./Home.css";
import HomeIllustration from "../../images/icons&illustrations/Phone.svg";




const Home=(props)=>{

    

    const goToSignUpPage=()=>{
        props.history.push("/sign-up");
    }

    return(
        <div className="Home" >
            <div className="Home-home" >
                <section className="Home-introduction" >
                    <h1 className="Home-title" >Talkative</h1>
                    <p>Talk with your friends and strangers privately</p>
                    <button onClick={goToSignUpPage} >Join Now</button>
                </section>
                <section className="Home-MessagingIcon" >
                    <img src={HomeIllustration} alt=""/>
                </section>
            </div>
        </div>
    )
}


export default Home;
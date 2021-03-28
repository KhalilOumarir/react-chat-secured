import React,{useEffect,useState} from "react";
import "./Sign-up.css";
import {createMuiTheme} from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import { withStyles,makeStyles } from "@material-ui/styles";
import SignUpIllustration from "../../images/icons&illustrations/Sign-up-illustration.png";
import axios from 'axios';


const useStyles=makeStyles({
    inputFields: {
        marginLeft: "30px",
        backgroundColor:"#E5EDFB"
    },
    fields:{
        backgroundColor:"#E5EDFB"
    },
    passwordField: {
        width: "450px",
        backgroundColor:"#E5EDFB"
    },
    title: {
        margin: "0px"
    }
});

const SignUp = (props) => {
    const classes=useStyles();

    const [username,setUsername]=useState("");
    const [password,setPassword]=useState("");
    const [email,setEmail]=useState("");



    const handleSignUpSubmit=async(evt)=>{
        evt.preventDefault();
        const result=await axios.post("http://localhost:4000/sign-up",{username,password,email},{timeout:6000});
        setUsername("");
        setPassword("");
        setEmail("");
    }

    
    const handleUsernameValue=(evt)=>{
        setUsername(evt.target.value);
    }
    const handlePasswordValue=(evt)=>{
        setPassword(evt.target.value);
    }
    const handleEmailValue=(evt)=>{
        setEmail(evt.target.value);
    }


    return (
        <div className="Sign-Up" >
            <div className="Sign-Up-container" >

                <section className="Sign-Up-Title" >
                    
                </section>
                <h1 className="Sign-Up-Title" >Sign Up</h1>
                <p  className="Sign-Up-Title">Already have an account ? <a href="#">Login In.</a> </p>
                <section  >
                    <form className="Sign-Up-form" onSubmit={handleSignUpSubmit} >
                        <div className="Sign-Up-details" >
                            <TextField className={classes.fields} value={username} onChange={handleUsernameValue}  id="filled-basic" label="Name" variant="filled" />
                            <TextField className={classes.inputFields} value={email} onChange={handleEmailValue} id="filled-email" label="Email" variant="filled" type="email" />
                        </div>
                        <div>
                            <TextField className={classes.passwordField} value={password} onChange={handlePasswordValue}  id="filled-password" label="Password" variant="filled" type="password" />
                        </div>
                        <div className="Sign-Up-form-buttonDiv">
                            <button className="Sign-Up-form-button" >Create an account</button>
                        </div>
                    </form>
                </section>


            </div>
            <section>
                <img src={SignUpIllustration} alt="" />
            </section>
        </div>
    )
}


export default SignUp;
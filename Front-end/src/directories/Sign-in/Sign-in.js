import React,{useState,useEffect} from 'react';
import "../Sign-up/Sign-up.css";
import TextField from '@material-ui/core/TextField';
import { makeStyles } from "@material-ui/styles";
import LoginIllustration from "../../images/icons&illustrations/Login-illustration.svg";
import axios from 'axios';
import {NavLink} from "react-router-dom";





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

const SignIn=()=>{

    const classes=useStyles();

    
    const [password,setPassword]=useState("");
    const [email,setEmail]=useState("");
    const [errors,setErrors]=useState("");

    const handleSignUpSubmit=async(evt)=>{
        evt.preventDefault();
        const pass=password;
        const mail=email;
        setPassword("");
        setEmail("");
        const result=await axios.post("http://localhost:4000/sign-in",{password:pass,email:mail},{timeout:6000});
        
    }

    
   
    const handlePasswordValue=(evt)=>{
        setPassword(evt.target.value);
        //error checking in the password
        if((evt.target.value.length>=4 && evt.target.value.length<=50) ){
            
            setErrors("");
        }else{
            setErrors("Password must be from 5 to 50 characters");
        }
    }
    const handleEmailValue=(evt)=>{
        setEmail(evt.target.value);
    }


    return (
        <div className="Sign-Up" >
            <div className="Sign-Up-container" >

                <section className="Sign-Up-Title" >
                    
                </section>
                <h1 className="Sign-Up-Title">Login</h1>
                <p  className="Sign-Up-Title">Create an account <NavLink to="/sign-up">Here.</NavLink> </p>
                <section  >
                    <form className="Sign-Up-form" onSubmit={handleSignUpSubmit} >
                        <div className="Sign-Up-details" >
                            <TextField className={classes.passwordField} value={email} onChange={handleEmailValue} id="filled-email" label="Email" variant="filled" type="email" />
                        </div>
                        <div>
                            <TextField className={classes.passwordField} value={password} onChange={handlePasswordValue}  id="filled-password" label="Password" variant="filled" error={errors.length ? true:false} type="password" helperText={errors}/>
                        </div>
                        <div  className="Sign-Up-form-buttonDiv">
                            <button disabled={errors.length ? true:false} className="Sign-Up-form-button" >Log in</button>
                        </div>
                    </form>
                </section>


            </div>
            <section>
                <img src={LoginIllustration} alt="" />
            </section>
        </div>
    )
}


export default SignIn;
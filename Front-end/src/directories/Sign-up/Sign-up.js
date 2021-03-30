import React,{useEffect,useState} from "react";
import "./Sign-up.css";
import {createMuiTheme} from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import { withStyles,makeStyles } from "@material-ui/styles";
import SignUpIllustration from "../../images/icons&illustrations/Sign-up-illustration.png";
import axios from 'axios';
import {NavLink,Redirect} from 'react-router-dom';
import validator from "validator";
import ValidationSnackbar from "./validation-error-snackbar";

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
    const [errors,setErrors]=useState({passError:"",emailError:"",usernameError:"",other:""});
    const [successfulRegistration,setSuccessfulRegistration]=useState("");

    const handleSignUpSubmit=(evt)=>{
        evt.preventDefault();
        const usernameValue=username;
        const passwordValue=password;
        const emailValue=email;
        setUsername("");
        setPassword("");
        setEmail("");
        setErrors({...errors,other:""});
        axios.post("http://localhost:4000/sign-up",{username:usernameValue
        ,password:passwordValue,email:emailValue},{timeout:6000})
        .then((result)=>{
            setSuccessfulRegistration(result.data);
        })
        .catch((err)=>{
            
            if(err){
                if(err.reponse){
                    const {password,email,username,other}=err.response.data;
                    setErrors({...errors,passError:password ? password:"", 
                    emailError:email ? email:"",
                    usernameError:username ? username:"" ,
                    other:other ? other:""});
                }
            }
        })
       
       
    }

    
    const handleUsernameValue=(evt)=>{
        setUsername(evt.target.value);
        if((evt.target.value.length>=3 && evt.target.value.length<=20) ){
            setErrors({...errors,usernameError:""});
        }else{
            setErrors({...errors,usernameError:"Username must be from 3 to 20 characters"});
        }
    }
    const handlePasswordValue=(evt)=>{
        setPassword(evt.target.value);
        if((evt.target.value.length>=5 && evt.target.value.length<=50) ){
            setErrors({...errors,passError:""});
        }else{
            setErrors({...errors,passError:"Password must be from 5 to 50 characters"});
        }
    }
    const handleEmailValue=(evt)=>{
        setEmail(evt.target.value);
        if(!validator.isEmail(evt.target.value)){
            setErrors({...errors,emailError:"Must be a valid email"});
        }else{
            setErrors({...errors,emailError:""});
        }
    }




    return (
        <div className="Sign-Up" >
            
            <div className="Sign-Up-container" >
            {successfulRegistration.length ? <Redirect to={{pathname:"/sign-in",state:{successfulRegistration}}} />:null}
                {errors.other.length ? <ValidationSnackbar msg={errors.other} type={"error"} /> : null}
                <section className="Sign-Up-Title" >
                    
                </section>
                <h1 className="Sign-Up-Title" >Sign Up</h1>
                <p  className="Sign-Up-Title">Already have an account ? <NavLink to="/Sign-in" >Login In.</NavLink> </p>
                <section  >
                    <form className="Sign-Up-form" onSubmit={handleSignUpSubmit} >
                        <div className="Sign-Up-details" >
                            <TextField className={classes.passwordField} value={username} onChange={handleUsernameValue}  id="filled-basic" label="Name" variant="filled" 
                            error={errors.usernameError.length ? true:false}
                            helperText={errors.usernameError}
                            />
                           
                        </div>
                        <div>
                        <TextField className={classes.passwordField} value={email} onChange={handleEmailValue} id="filled-email" label="Email" variant="filled" type="email"
                             error={errors.emailError.length ? true:false}
                             helperText={errors.emailError}
                            />
                        </div>
                        <div>
                            <TextField className={classes.passwordField} value={password} onChange={handlePasswordValue}  id="filled-password" label="Password" variant="filled" type="password"
                              error={errors.passError.length ? true:false}
                              helperText={errors.passError}
                            />
                        </div>
                        <div className="Sign-Up-form-buttonDiv">
                            <button 
                            disabled={errors.passError.length || errors.emailError.length || errors.usernameError.length ? true:false} className="Sign-Up-form-button" >Create an account</button>
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
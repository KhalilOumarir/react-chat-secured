import React from "react";
import "./Sign-up.css";
import {createMuiTheme} from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import { withStyles,makeStyles } from "@material-ui/styles";
import SignUpIllustration from "../../images/icons&illustrations/Sign-up-illustration.png";

const styles = {
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
    
}

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

    return (
        <div className="Sign-Up" >
            <div className="Sign-Up-container" >

                <section className="Sign-Up-Title" >
                    
                </section>
                <h1 className="Sign-Up-Title" >Sign Up</h1>
                <p  className="Sign-Up-Title">Already have an account ? <a href="#">Login In.</a> </p>
                <section  >
                    <form action="" className="Sign-Up-form">
                        <div className="Sign-Up-details" >
                            <TextField className={classes.fields}  id="filled-basic" label="Name" variant="filled" />
                            <TextField className={classes.inputFields} id="filled-email" label="Email" variant="filled" type="email" />
                        </div>
                        <div>
                            <TextField className={classes.passwordField}  id="filled-password" label="Password" variant="filled" type="password" />
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
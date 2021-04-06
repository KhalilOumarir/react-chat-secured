import React,{useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import {makeStyles} from "@material-ui/styles";
import TextField from '@material-ui/core/TextField';
import axios from "axios";



const useStyles=makeStyles({
    Avatar:{
        width:"200px",
        height:"200px",
        fontSize:"4em"
    },
    
});

const UserEdit=()=>{

    const classes=useStyles();
    const displayAvatar=()=>{
        //if the user has an avatar display the avatar with the image source
        //else display the first letter of the username
        return (
            <Avatar className={classes.Avatar} >H</Avatar>
        )
    }


    const [file,setFile]=useState(null);

    const handleOnSubmit=(evt)=>{
        evt.preventDefault();
        const formData = new FormData();
        formData.append('avatarImage',file);
        formData.append("authToken",window.localStorage.getItem("authToken"));
        axios.post("http://localhost:4000/edit-user",formData,{timeout:6000,headers:{
            "content-type":"multipart/form-data"
        }}).then((res)=>{
            console.log(res);
        })
    }

    const handleFileOnChange=(evt)=>{
        
        setFile(evt.target.files[0]);
    }


    return(
        <div>
            <form onSubmit={handleOnSubmit}  >
                <input type="file" name="avatarImage" onChange={handleFileOnChange} />
                <button>submit</button>
            </form>
        </div>
    )
}


export default UserEdit;
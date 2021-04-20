import React,{useState} from 'react';

import axios from "axios";





const UserEdit=()=>{

    const [file,setFile]=useState(null);

    const handleOnSubmit=(evt)=>{
        evt.preventDefault();
        const formData = new FormData();
        formData.append('avatarImage',file);
        formData.append("authToken",window.localStorage.getItem("authToken"));
        axios.post("/api/edit-user",formData,{timeout:6000,headers:{
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
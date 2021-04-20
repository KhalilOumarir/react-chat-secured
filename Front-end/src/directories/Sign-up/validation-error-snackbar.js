import React, {  useState } from "react";

import Snackbar from "@material-ui/core/Snackbar";

import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }



const ValidationSnackbar = (props) => {
  const [open, setOpen] = useState(true);

    


  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <div>
      <Snackbar open={open}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
           autoHideDuration={4000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={props.type}>
          {props.msg}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ValidationSnackbar;

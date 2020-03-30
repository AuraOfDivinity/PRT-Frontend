import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import './ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    width: '800px'
  },
  heading: {
    fontFamily: 'Inter'
  }
}));

export default function AttachFileModal(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [file, setFile] = React.useState(null);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    props.getData();
  };

  const onFormSubmit = e => {
    e.preventDefault();
    fileUpload(file);
  };

  const onChange = e => {
    setFile(e.target.files[0]);
  };

  const fileUpload = file => {
    const url = 'https://prtbackend.herokuapp.com/proposal/attach';
    const method = 'POST';
    const formData = new FormData();
    formData.append('file', file);
    formData.append('proposalId', props.proposalId);
    const headers = {
      Authorization: 'Bearer ' + props.token
    };

    fetch(url, {
      method: method,
      body: formData,
      headers: headers
    })
      .then(res => {
        console.log('response received');
        toast.success('File upload successful');
      })
      .catch(err => {
        toast.error('File upload failed');
      });
  };

  return (
    <div>
      <Button
        variant='contained'
        color='primary'
        style={{ fontFamily: 'Inter', margin: '10px', order: 1 }}
        onClick={handleOpen}
      >
        Add Attachments
      </Button>
      <Modal
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <h2 id='transition-modal-title' className={classes.heading}>
              New Attachment
            </h2>
            <form onSubmit={onFormSubmit}>
              <input
                type='file'
                onChange={onChange}
                style={{ display: 'block', width: '100%' }}
              />
              <Button
                variant='contained'
                color='primary'
                style={{ fontFamily: 'Inter', marginTop: '10px' }}
                type='submit'
              >
                Upload
              </Button>
            </form>
            <ToastContainer />
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

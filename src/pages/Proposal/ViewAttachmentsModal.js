import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';

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

export default function ViewAttachmentsModal(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
    console.log(props.attachments);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        variant='contained'
        color='primary'
        style={{ fontFamily: 'Inter', margin: '10px', order: 1 }}
        onClick={handleOpen}
      >
        View Attachments
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
              Attachments
            </h2>
            {props.attachments.length > 0 ? (
              props.attachments.map((attachment, i) => {
                return (
                  <div key={i}>
                    <a
                      href={attachment.fileLink}
                      target='_blank'
                      rel='noopener noreferrer'
                      style={{ fontFamily: 'inter' }}
                    >
                      {attachment.s3_key}
                    </a>
                  </div>
                );
              })
            ) : (
              <p id='transition-modal-description'>
                You haven't attached any files. Please try attaching new files
                using add attachments button.
              </p>
            )}
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

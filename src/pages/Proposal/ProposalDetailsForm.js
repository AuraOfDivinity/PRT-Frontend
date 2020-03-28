import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';

import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

export default function ProposalDetailsForm(props) {
  const classes = useStyles();

  const [title, setTitle] = useState();
  const [organization, setOrganization] = useState();

  const handleChange = event => {
    if (event.target.name === 'title') {
      setTitle(event.target.value);
    } else if (event.target.name === 'organization') {
      setOrganization(event.target.value);
    }
  };

  const handleClick = () => {
    console.log(props.token);
    fetch('http://localhost:8080/proposal/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + props.token
      },
      body: JSON.stringify({
        title: title,
        organization: organization,
        userId: props.userId
      })
    })
      .then(res => {
        return res.json();
      })
      .then(resData => {
        props.displayEditor(resData.proposal._id);
      });
    // if (res.status !== 200 && res.status !== 201) {
    //   throw new Error('Creating or editing a post failed!');
    // }
  };

  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <div className={classes.paper}>
        <h1 style={{ fontFamily: 'Qanelas' }}>Create a new proposal</h1>
        <form
          className={classes.form}
          noValidate
          style={{ fontFamily: 'Inter' }}
        >
          <TextField
            margin='normal'
            required
            fullWidth
            id='title'
            label='Proposal Title'
            name='title'
            autoFocus
            onChange={handleChange}
          />
          <TextField
            margin='normal'
            required
            fullWidth
            name='organization'
            label='Organization'
            id='organization'
            onChange={handleChange}
          />
          <Button
            fullWidth
            variant='contained'
            color='primary'
            className={classes.submit}
            onClick={handleClick}
            style={{ fontFamily: 'Inter' }}
          >
            Continue to proposal editor
          </Button>
        </form>
      </div>
    </Container>
  );
}

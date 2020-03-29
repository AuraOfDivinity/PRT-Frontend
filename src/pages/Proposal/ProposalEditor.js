// import react, react-markdown-editor-lite, and a markdown parser you like
import * as React from 'react';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import Chip from '@material-ui/core/Chip';
import BeatLoader from 'react-spinners/BeatLoader';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import AttachFileModal from './AttachFileModal';
import ViewAttachmentsModal from './ViewAttachmentsModal';
import './index.css';

const mdParser = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
});

class ProposalEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      attachments: [],
      proposalId: this.props.proposalId,
      currentText: '',
      token: this.props.token,
      idVar: '',
      isSaving: false,
      lastSaved: new Date().toTimeString().substring(0, 8),
      markdownString: '',
      draftEnabled: false
    };
  }

  handleEditorChange = ({ html, text }) => {
    this.setState({
      draftEnabled: true,
      currentText: html
    });
  };

  componentDidMount() {
    let proposalId;

    if (this.props.proposalId) {
      proposalId = this.props.proposalId;
    } else {
      proposalId = this.props.match.params.proposalId;
    }
    this.setState({ proposalId: proposalId }, () => {
      this.getData();
      let idVar = setInterval(this.saveData, 20000);
      this.setState({
        idVar: idVar
      });
    });
  }

  getData = () => {
    console.log('get data called');
    fetch('http://localhost:8080/proposal/getbyid', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.props.token
      },
      body: JSON.stringify({
        proposalId: this.state.proposalId
      })
    })
      .then(res => {
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        this.setState({
          title: resData.title,
          org: resData.organization,
          status: resData.proposalStatus.toUpperCase(),
          attachments: resData.attachments,
          markdownString: resData.content
        });
      });
  };

  saveData = () => {
    this.setState({ isSaving: true });
    setTimeout(() => {
      fetch('http://localhost:8080/proposal/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.props.token
        },
        body: JSON.stringify({
          proposalId: this.state.proposalId,
          text: this.state.currentText
        })
      })
        .then(res => {
          return res.json();
        })
        .then(resData => {
          this.setState({
            isSaving: false,
            lastSaved: new Date().toTimeString().substring(0, 8)
          });
        });
    }, 2000);
  };

  updateStatus = () => {
    fetch(
      'http://localhost:8080/proposal/updatestatus/' + this.state.proposalId,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.props.token
        },
        body: JSON.stringify({
          status: this.state.status,
          userId: this.props.userId
        })
      }
    ).then(res => {
      this.props.history.push({
        pathname: '/'
      });
    });
  };

  handleDraftClick = () => {
    this.saveData();
    this.props.history.push({
      pathname: '/'
    });
  };

  handleSubmitClick = () => {
    this.updateStatus();
  };

  componentWillUnmount() {
    clearInterval(this.state.idVar);
  }

  render() {
    const { isSaving, lastSaved } = this.state;
    return (
      <React.Fragment>
        <Card style={{ margin: '10px', fontFamily: 'Inter' }}>
          <CardContent>
            <h2>
              {this.state.title} - {this.state.org}
            </h2>
            <Chip
              label={this.state.status}
              style={{ fontFamily: 'Inter' }}
              color='secondary'
            />
          </CardContent>
        </Card>
        <MdEditor
          style={{ height: '30rem', width: '100%', margin: '2px' }}
          value={this.state.markdownString}
          renderHTML={text => mdParser.render(text)}
          onChange={this.handleEditorChange}
        />
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          {isSaving ? (
            <div style={{ order: 4 }}>
              <div style={{ display: 'inline-block', margin: '10px' }}>
                <BeatLoader
                  size={10}
                  color={'#123abc'}
                  loading={this.state.isSaving}
                ></BeatLoader>
              </div>
              <div
                style={{
                  margin: '10px',
                  fontFamily: 'Inter',
                  fontSize: '12px',
                  fontWeight: '400',
                  display: 'inline-block'
                }}
              >
                Saving
              </div>
            </div>
          ) : (
            <div
              style={{
                margin: '10px',
                order: 4,
                fontFamily: 'Inter',
                fontSize: '12px',
                fontWeight: '400',
                display: 'inline-block'
              }}
            >
              Last saved at {lastSaved}
            </div>
          )}
          <ViewAttachmentsModal attachments={this.state.attachments} />
          <AttachFileModal
            token={this.state.token}
            proposalId={this.state.proposalId}
            getData={this.getData}
          />
          {this.state.draftEnabled ? (
            <Button
              variant='contained'
              color='primary'
              style={{ fontFamily: 'Inter', margin: '10px', order: 2 }}
              onClick={this.handleDraftClick}
            >
              Save Proposal
            </Button>
          ) : (
            <Button
              variant='contained'
              color='primary'
              style={{ fontFamily: 'Inter', margin: '10px', order: 2 }}
              disabled='true'
            >
              Save Proposal
            </Button>
          )}

          {this.state.status === 'DRAFT' ? (
            <Button
              variant='contained'
              color='Secondary'
              style={{ fontFamily: 'Inter', margin: '10px', order: 3 }}
              onClick={this.handleSubmitClick}
            >
              Submit Proposal
            </Button>
          ) : (
            <div></div>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default ProposalEditor;

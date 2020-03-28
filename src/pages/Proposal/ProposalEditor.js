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

// import style manually
import './index.css';

// Register plugins if required
// MdEditor.use(YOUR_PLUGINS_HERE);

// Initialize a markdown parser
const mdParser = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
});

// Finish!

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
      lastSaved: new Date().toTimeString().substring(0, 8)
    };
  }

  handleEditorChange = ({ html, text }) => {
    this.setState({
      currentText: html
    });
  };

  componentDidMount() {
    this.getData();
    let idVar = setInterval(this.saveData, 20000);
    this.setState({
      idVar: idVar
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
        proposalId: this.props.proposalId
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
          attachments: resData.attachments
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
          proposalId: this.props.proposalId,
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
              style={{ backgroundColor: '#ffff2d', fontFamily: 'Inter' }}
            />
          </CardContent>
        </Card>
        <MdEditor
          style={{ height: '30rem', width: '100%', margin: '2px' }}
          value={'# Header here'}
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
          <Button
            variant='contained'
            color='primary'
            style={{ fontFamily: 'Inter', margin: '10px', order: 2 }}
          >
            Draft Proposal
          </Button>
          <Button
            variant='contained'
            color='Secondary'
            style={{ fontFamily: 'Inter', margin: '10px', order: 3 }}
          >
            Submit Proposal
          </Button>
        </div>
      </React.Fragment>
    );
  }
}

export default ProposalEditor;

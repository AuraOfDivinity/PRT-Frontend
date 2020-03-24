// import react, react-markdown-editor-lite, and a markdown parser you like
import * as React from 'react';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import BounceLoader from 'react-spinners/BounceLoader';
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
    let idVar = setInterval(this.saveData, 20000);
    this.setState({
      idVar: idVar
    });
  }

  saveData = () => {
    this.setState({ isSaving: true });
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
  };

  componentWillUnmount() {
    clearInterval(this.state.idVar);
  }

  render() {
    const { isSaving, lastSaved } = this.state;
    return (
      <React.Fragment>
        <MdEditor
          style={{ height: '40rem', width: '100%', margin: '20px' }}
          value={'# Header here'}
          renderHTML={text => mdParser.render(text)}
          onChange={this.handleEditorChange}
        />
        {isSaving ? (
          <div>
            <div style={{ display: 'inline-block', marginRight: '5px' }}>
              <BounceLoader
                size={25}
                color={'#123abc'}
                loading={this.state.isSaving}
              ></BounceLoader>
            </div>
            <div
              style={{
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
              fontFamily: 'Inter',
              fontSize: '12px',
              fontWeight: '400',
              display: 'inline-block'
            }}
          >
            Last saved at {lastSaved}
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default ProposalEditor;

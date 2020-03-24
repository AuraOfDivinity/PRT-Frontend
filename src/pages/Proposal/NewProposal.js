import React, { Component } from 'react';
import ProposalDetailsForm from './ProposalDetailsForm';
import ProposalEditor from './ProposalEditor';

class NewProposal extends Component {
  constructor(props) {
    super(props);
    this.state = { display: false };
  }

  displayEditor = id => {
    this.setState({
      display: true,
      proposalId: id
    });
  };

  render() {
    const display = this.state.display;
    return (
      <React.Fragment>
        {!display ? (
          <ProposalDetailsForm
            token={this.props.token}
            displayEditor={this.displayEditor}
          />
        ) : (
          <React.Fragment>
            <h2 style={{ fontFamily: 'Qanelas' }}>Proposal Editor</h2>
            <ProposalEditor
              proposalId={this.state.proposalId}
              token={this.props.token}
            />
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default NewProposal;

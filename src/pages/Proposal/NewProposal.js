import React, { Component } from 'react';
import ProposalDetailsForm from './ProposalDetailsForm';
import ProposalEditor from './ProposalEditor';

class NewProposal extends Component {
  constructor(props) {
    super(props);
    this.state = { display: false };
  }

  displayEditor = proposalId => {
    this.setState({
      display: true,
      proposalId: proposalId
      // title: proposal.title
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
            userId={this.props.userId}
          />
        ) : (
          <React.Fragment>
            <ProposalEditor
              proposalId={this.state.proposalId}
              token={this.props.token}
              title={this.state.title}
              userId={this.props.userId}
            />
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default NewProposal;

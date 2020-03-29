import React, { Component, Fragment } from 'react';
import Button from '../../components/Button/Button';
import ErrorHandler from '../../components/ErrorHandler/ErrorHandler';
import './Feed.css';
import { Link } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Chip from '@material-ui/core/Chip';
import CardActions from '@material-ui/core/CardActions';
import '../Proposal/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Tooltip from '@material-ui/core/Tooltip';

class Feed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      proposals: [],
      isLoading: false,
      currentPage: 0,
      dataLoaded: false
    };
  }

  componentDidMount() {
    this.getUserProposals();
  }

  getUserProposals = () => {
    fetch('http://localhost:8080/proposal/getbyuserid', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.props.token
      },
      body: JSON.stringify({
        userId: this.props.userId
      })
    })
      .then(res => {
        return res.json();
      })
      .then(resData => {
        this.setState({
          proposals: resData,
          dataLoaded: true
        });
      });
  };

  handleProposalDelete = proposalId => {
    fetch('http://localhost:8080/proposal/delete/' + proposalId, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.props.token
      }
    }).then(() => {
      this.getUserProposals();
      toast.success('Proposal Deleted Successfully!');
    });
  };

  handleDiscussClick = () => {
    toast.success('Discuss function is not implemented yet');
  };

  render() {
    return (
      <Fragment>
        <ErrorHandler error={this.state.error} onHandle={this.errorHandler} />

        <section className='feed__control'>
          <Link to='/newproposal'>
            <Button mode='raised' design='accent' onClick={this.newPostHandler}>
              New Proposal
            </Button>
          </Link>
        </section>
        <section className='feed'>
          {this.state.proposals.length > 0 ? (
            this.state.proposals.map((proposal, index) => {
              return (
                <div className='cardHolder' key={index}>
                  <Card className='cardElement'>
                    <CardContent>
                      <div className='cardHeader'>{proposal.title}</div>
                      <div className='cardOrganization'>
                        {proposal.organization}
                      </div>
                    </CardContent>
                    <Tooltip
                      title={
                        proposal.proposalStatus.toUpperCase() === 'DRAFT'
                          ? 'Draft proposals cannot be viewed by admins. Make your neccessary changes in the proposal editor and submit the proposal to get it reviwed'
                          : 'Your proposal is currently under review'
                      }
                    >
                      <Chip
                        label={proposal.proposalStatus.toUpperCase()}
                        // style={{ fontFamily: 'inter', margin: '10px' }}
                        className='chip'
                        color='primary'
                        style={
                          proposal.proposalStatus.toUpperCase() === 'DRAFT'
                            ? { backgroundColor: '#3D2E62' }
                            : { backgroundColor: '#fab83f' }
                        }
                      ></Chip>
                    </Tooltip>
                    <CardActions>
                      <Link to={'/' + proposal._id}>
                        <Button size='small'>Edit Proposal</Button>
                      </Link>
                      {proposal.proposalStatus === 'SUBMITTED' ? (
                        <Tooltip title='Hello World!'>
                          <Button
                            design='primary'
                            onClick={this.handleDiscussClick}
                          >
                            Discuss
                          </Button>
                        </Tooltip>
                      ) : (
                        <div></div>
                      )}

                      <Button
                        design='danger'
                        onClick={() => this.handleProposalDelete(proposal._id)}
                      >
                        Delete Proposal
                      </Button>
                    </CardActions>
                  </Card>
                </div>
              );
            })
          ) : (
            <div className='cardHolder'>
              <Card className='noResultcardElement'>
                <CardContent className='noResults'>
                  <div className='noResultscardHeader'>
                    We couldn't find any proposals you made earlier. Try
                    creating a new proposal
                  </div>
                  <img src='/noresults.png' className='noResultsImage'></img>
                </CardContent>
              </Card>
            </div>
          )}
        </section>
        <ToastContainer />
      </Fragment>
    );
  }
}

export default Feed;

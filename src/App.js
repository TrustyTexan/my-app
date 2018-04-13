// @flow

import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Nav from './components/Nav';
import { CircularProgress } from 'material-ui/Progress';
import { withStyles } from 'material-ui/styles';
import { getExchangesPositions } from './api/exchange';
import Button from "material-ui/Button";
import Typography from 'material-ui/Typography';

const styles = () => ({
  progress: {
    margin: "50px auto",
    display: "block"
  },
  errorState: {
    marginTop: 50,
    textAlign: "center"
  },
  tryAgainButton: {
    marginTop: 5
  }
});

type State = {
  loading: boolean
};

class App extends Component {

  state: State = { loading: false, showError: false }

  componentDidMount () {
    this.fetchData();
  }

  async fetchData() {
    this.setState({ loading: true, showError: false });

    try {
      const data = await getExchangesPositions();
      console.log(data);

    } catch (e) {
      this.setState({ showError: true });
    } finally {
      this.setState({ loading: false });
    }
  }

  onTryAgainClick = () => {
    this.fetchData();
  }

  render() {
    const { classes } = this.props;
    const { showError, loading } = this.state;

    return (
      <div>
        <Router>
          <Nav />
        </Router>
        {loading && <CircularProgress size={50} className={classes.progress} />}
        {showError && <div className={classes.errorState}>
          <Typography variant="display1">Error Loading Results</Typography>
          <Button onClick={this.onTryAgainClick} className={classes.tryAgainButton} color="primary">TRY AGAIN</Button>
        </div>}
      </div>
    );
  }
}

export default withStyles(styles)(App);

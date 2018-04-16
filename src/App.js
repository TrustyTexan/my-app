import React, { Component, Fragment } from "react";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import Nav from "./components/Nav";
import { CircularProgress } from "material-ui/Progress";
import { withStyles } from "material-ui/styles";
import { getExchangesPositions } from "./api/exchange";
import Button from "material-ui/Button";
import Typography from "material-ui/Typography";
import { transformExchangeData, convertToCurrentData, convertToHistoric } from "./utils/dataConverters";
import CurrentView from "./components/CurrentView";
import HistoricView from "./components/HistoricView";
import CssBaseline from "material-ui/CssBaseline";

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
  },
  appContainer: {
    paddingTop: 80
  }
});

class App extends Component {

  static displayName = "App";

  state = { loading: false, showError: false, data: null }

  componentDidMount () {
    this.fetchData();
  }

  async fetchData() {
    this.setState({ loading: true, showError: false });

    try {
      const data = await getExchangesPositions();
      const transformedData = transformExchangeData(data);
      this.setState({ data: transformedData });

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
    const { showError, loading, data } = this.state;
    const currentData = convertToCurrentData(data);
    const historicData = convertToHistoric(data);

    return (
      <Fragment>
        <CssBaseline />
        <Router>
          <div className={classes.appContainer}>
            <Nav />
            <Switch>
              <Route path="/current" render={props => {
                return <CurrentView data={currentData} />
              }} />
              <Route path="/historic" render={props => {
                return <HistoricView data={historicData} />
              }} />
              <Redirect from="/" to="/current" />
            </Switch>

          </div>
        </Router>
        {loading && <CircularProgress size={50} className={classes.progress} />}
        {showError && <div className={classes.errorState}>
          <Typography variant="display1">Error Loading Results</Typography>
          <Button onClick={this.onTryAgainClick} className={classes.tryAgainButton} color="primary">TRY AGAIN</Button>
        </div>}
      </Fragment>
    );
  }
}

export default withStyles(styles)(App);

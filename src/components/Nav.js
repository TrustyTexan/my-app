// @flow
import React, { Component } from 'react';
import Tabs, { Tab } from 'material-ui/Tabs';
import AppBar from 'material-ui/AppBar';
import { withRouter } from 'react-router-dom';

const navList: Array<string> = ["/current", "/historic"];

class Nav extends Component {
    onNavChange = (event, value: number) => {
        this.props.history.push(navList[value]);
    };

    render() {
        return (
            <AppBar position="static">
                <Tabs onChange={this.onNavChange} value={navList.indexOf(this.props.location.pathname)}>
                    <Tab label="Current" />
                    <Tab label="Historic" />
                </Tabs>
            </AppBar>
        );
    }
}

export default withRouter(Nav);

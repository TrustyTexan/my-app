// @flow
import React, { Component } from "react";
import Tabs, { Tab } from "material-ui/Tabs";
import AppBar from "material-ui/AppBar";
import { withRouter } from "react-router-dom";

const navList: Array<string> = ["/current", "/historic"];

class Nav extends Component {
    onNavChange = (event, value: number) => {
        this.props.history.push(navList[value]);
    };

    render() {
        const tabIndex = navList.indexOf(this.props.location.pathname);
        return (
            <AppBar>
                <Tabs onChange={this.onNavChange} value={tabIndex === -1 ? 0 : tabIndex}>
                    <Tab label="Current" />
                    <Tab label="Historic" />
                </Tabs>
            </AppBar>
        );
    }
}

export default withRouter(Nav);

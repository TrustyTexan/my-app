import React  from "react";
import CurrentView from "./components/CurrentView";
import HistoricView from "./components/HistoricView";
import { convertToCurrentData, convertToHistoric } from "./utils/dataConverters";
import { Route, Redirect, Switch } from "react-router-dom";

export default function ({ data }) {
    return (
        <Switch>
            <Route path="/current" render={props => {
                return <CurrentView data={convertToCurrentData(data)} />
            }} />
            <Route path="/historic" render={props => {
                return <HistoricView data={convertToHistoric(data)} />
            }} />
            <Redirect from="/" to="/current" />
        </Switch>
    );
};

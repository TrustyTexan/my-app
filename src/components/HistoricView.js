// @flow

import React, { Component } from "react";
import { LineChart, CartesianGrid, XAxis, YAxis, Legend, Line, ResponsiveContainer } from "recharts";
import { withStyles, withTheme } from "material-ui/styles";
import Paper from "material-ui/Paper";
import Typography from "material-ui/Typography";
import Select from "material-ui/Select";
import { MenuItem } from "material-ui/Menu";
import { ExchangesColorMap, ExchangesMap } from "../constants/Exchanges";

const styles = (theme) => ({
    container: {
        padding: "0 100px"
    },
    chartContainer: {
        padding: "20px 30px 20px 0",
        marginBottom: 50
    },
    selectContainer: {
        marginBottom: 20
    }
});

class HistoricView extends Component {
    static displayName = "HistoricView";

    state = { selectedCurrency: "" };

    componentWillMount() {
        const { data } = this.props;
        this.setState({ selectedCurrency: data ? Object.keys(data)[0] : "" })
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.data) {
            this.setState({ selectedCurrency: Object.keys(nextProps.data)[0] })
        }
    }

    onChangeSelectedCurrency = event => {
        this.setState({ selectedCurrency: event.target.value });
    };

    renderPositionChart (currencyPositionData) {
        const { classes, theme } = this.props;
        const exchanges = Object.keys(currencyPositionData);
        if (exchanges.length === 0) return null;

        return (
            <Paper className={classes.chartContainer}>
                <Typography align="center" gutterBottom variant="subheading">Positions</Typography>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            tickFormatter={d => (new Date(d)).toLocaleTimeString() }
                            scale="utcTime"
                            dataKey="last_update_time"
                            tickMargin={8}
                            height={50}
                            allowDuplicatedCategory={false}
                            tick={{
                                fontFamily: theme.typography.fontFamily,
                                fontSize: theme.typography.caption.fontSize
                            }}
                        />
                        <YAxis
                            dataKey="current"
                            tick={{
                                fontFamily: theme.typography.fontFamily,
                                fontSize: theme.typography.caption.fontSize
                            }}
                        />
                        {exchanges.map(exchange => {
                            return ([
                                <Line
                                    dot={false}
                                    dataKey="current"
                                    data={currencyPositionData[exchange]}
                                    name={`${ExchangesMap[exchange]} Current`}
                                    key={`${exchange}_current`}
                                    stroke={ExchangesColorMap[exchange]}
                                />,
                                <Line
                                    dot={false}
                                    dataKey="locked"
                                    data={currencyPositionData[exchange]}
                                    name={`${ExchangesMap[exchange]} Locked`}
                                    key={`${exchange}_locked`}
                                    stroke={ExchangesColorMap[exchange]}
                                    strokeDasharray="4 4"
                                />
                            ]);
                        })}
                        <Legend wrapperStyle={{
                            fontFamily: theme.typography.fontFamily,
                            fontSize: theme.typography.body1.fontSize,
                        }} />
                    </LineChart>
                </ResponsiveContainer>
            </Paper>
        )
    }

    renderFeeChart(currencyFeeData) {
        const { classes, theme } = this.props;
        const exchanges = Object.keys(currencyFeeData);
        if (exchanges.length === 0) return null;

        return (
            <Paper className={classes.chartContainer}>
                <Typography align="center" gutterBottom variant="subheading">Fees</Typography>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            tickFormatter={d => (new Date(d)).toLocaleTimeString()}
                            internval={30}
                            dataKey="last_update_time"
                            tickMargin={8}
                            height={50}
                            tick={{
                                fontFamily: theme.typography.fontFamily,
                                fontSize: theme.typography.caption.fontSize
                            }}
                            type="number"
                            domain={["dataMin", "dataMax"]}
                        />
                        <YAxis
                            dataKey="fee"
                            tick={{
                                fontFamily: theme.typography.fontFamily,
                                fontSize: theme.typography.caption.fontSize
                            }}
                        />
                        {exchanges.map(exchange => {
                            return (
                                <Line
                                    dot={false}
                                    dataKey="fee"
                                    data={currencyFeeData[exchange]}
                                    name={`${ExchangesMap[exchange]}`}
                                    stroke={ExchangesColorMap[exchange]}
                                    key={`${exchange}_fee`}
                                />
                            );
                        })}
                        <Legend wrapperStyle={{
                            fontFamily: theme.typography.fontFamily,
                            fontSize: theme.typography.body1.fontSize,
                        }} />
                    </LineChart>
                </ResponsiveContainer>
            </Paper>
        )
    }

    render () {
        const { data, classes } = this.props;
        const { selectedCurrency } = this.state;

        if (!data) {
            return null;

        } else {
            const currencies = Object.keys(data);

            return (
                <div className={classes.container}>
                    <div className={classes.selectContainer}>
                        <Select value={selectedCurrency} onChange={this.onChangeSelectedCurrency}>
                            {currencies.map(currency => {
                                return <MenuItem key={currency} value={currency}>{currency}</MenuItem>
                            })}
                        </Select>
                    </div>
                    {this.renderPositionChart(data[selectedCurrency].positions)}
                    {this.renderFeeChart(data[selectedCurrency].fees)}
                </div>
            );
        }
    }   
}
export default withTheme()(withStyles(styles)(HistoricView));

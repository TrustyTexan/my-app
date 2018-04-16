import React, { Component } from "react";
import Table, { TableBody, TableCell, TableHead, TableRow } from "material-ui/Table";
import Paper from "material-ui/Paper";
import Typography from "material-ui/Typography";
import { withStyles } from "material-ui/styles";
import { ExchangesMap } from "../constants/Exchanges";

const styles = (theme) => ({
    tableContainer: {
        marginBottom: 40
    },
    container: {
        padding: "0 100px"
    },
    tableHeaderRow: {
        height: 35
    }
});

const CustomTableCell = withStyles(theme => {
    return {
        head: {
            backgroundColor: theme.palette.grey["500"],
            color: theme.palette.common.white,
            fontWeight: "bold"
        },
        body: {
            fontSize: 14,
        }
    };
})(TableCell);

const formatNumber = num => {
    if (typeof num !== "number") {
        return "-";

    } else {
        return num.toFixed(4);
    }
};

class CurrentView extends Component {

    static displayName = "CurrentView";

    renderTable (currencyData) {
        const { classes } = this.props;

        return (
            <Paper className={classes.tableContainer}>
                <Table>
                    <TableHead>
                        <TableRow className={classes.tableHeaderRow}>
                            <CustomTableCell width="100">Exchange</CustomTableCell>
                            <CustomTableCell width="150" numeric>Current</CustomTableCell>
                            <CustomTableCell width="150" numeric>Locked</CustomTableCell>
                            <CustomTableCell width="150" numeric>Available</CustomTableCell>
                            <CustomTableCell width="150" numeric>Fee</CustomTableCell>
                            <CustomTableCell>Last Updated</CustomTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currencyData.map(exchangeData => {
                            const date = exchangeData.last_update_time;
                            const current = exchangeData.current;
                            const locked = exchangeData.locked;
                            const available = (typeof current !== "number" || typeof locked !== "number") ?
                                "-" :
                                formatNumber(exchangeData.current - exchangeData.locked);

                            return (
                                <TableRow key={exchangeData.exchange}>
                                    <TableCell>{ExchangesMap[exchangeData.exchange]}</TableCell>
                                    <TableCell numeric>{formatNumber(current)}</TableCell>
                                    <TableCell numeric>{formatNumber(locked)}</TableCell>
                                    <TableCell numeric>{available}</TableCell>
                                    <TableCell numeric>{formatNumber(exchangeData.fee)}</TableCell>
                                    <TableCell>{date ? new Date(date).toLocaleString() : "-"}</TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </Paper>
        );
    }

    render () {
        const { data, classes } = this.props;

        if (!data) {
            return null;

        } else {
            return (
                <div className={classes.container}>
                    {Object.keys(data).map(currency => {
                        return (
                            <div key={currency}>
                                <Typography color="textSecondary" gutterBottom variant="headline">{currency}</Typography>
                                {this.renderTable(data[currency])}
                            </div>
                        );
                    })}
                </div>
            );
        }
    }
}
export default withStyles(styles)(CurrentView);

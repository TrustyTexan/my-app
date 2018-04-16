import { findIndex }  from "lodash/array";

const applyVariance = (value: number) => {
    const directionFactor = Math.random() > 0.5 ? -1 : 1;
    const varianceFactor = 1 + (Math.random() * 0.02 * directionFactor)
    const val = value === 0 ? 1 : value;
    return val * varianceFactor;
};

export const transformExchangeData = (data) => {
    const response = {};
    Object.keys(data.positions).forEach(exchange => {
        if (!response[exchange]) {
            response[exchange] = { positions: {}, fees: {} };
        }
        const exchangePositions = data.positions[exchange];

        Object.keys(exchangePositions).forEach(currency => {
            let lastPositionData = {
                current: exchangePositions[currency].current,
                locked: exchangePositions[currency].locked,
                last_update_time: (new Date(exchangePositions[currency].last_udpate_time)).getTime()
            };
            response[exchange].positions[currency] = [lastPositionData];
            for (let i = 0; i < 287; ++i) {
                var newCurrent = applyVariance(lastPositionData.current);
                var newLocked = applyVariance(lastPositionData.locked);
                if (newCurrent < newLocked) {
                    newCurrent = lastPositionData.locked * 1.02;
                }

                lastPositionData = {
                    current: newCurrent,
                    locked: newLocked,
                    last_update_time: lastPositionData.last_update_time + 5 * 60 * 1000
                }
                response[exchange].positions[currency].push(lastPositionData);
            }
        });
    });

    Object.keys(data.fees).forEach(exchange => {
        if (!response[exchange]) {
            response[exchange] = { positions: {}, fees: {} };
        }
        const exchangeFees = data.fees[exchange];

        Object.keys(exchangeFees).forEach(currency => {
            let lastFeeData = {
                fee: exchangeFees[currency].fee,
                type: exchangeFees[currency].type,
                last_update_time: (new Date(exchangeFees[currency].last_update_time)).getTime()
            };
            response[exchange].fees[currency] = [lastFeeData];
            for (let i = 0; i < 287; ++i) {
                lastFeeData = {
                    fee: applyVariance(lastFeeData.fee),
                    type: lastFeeData.type,
                    last_update_time: lastFeeData.last_update_time + 5 * 60 * 1000
                }
                response[exchange].fees[currency].push(lastFeeData);
            }
        });
    });
    return response;
}

export const convertToCurrentData = exchangeData => {
    const result = {};
    if (!exchangeData) return null;

    Object.keys(exchangeData).forEach(exchange => {
        const exchangePositions = exchangeData[exchange].positions;
        Object.keys(exchangePositions).forEach(currency => {
            if (!result[currency]) {
                result[currency] = [];
            }
            const currentPos = exchangePositions[currency][exchangePositions[currency].length - 1];
            result[currency].push({ ...currentPos, exchange });
        });

        const exchangeFees = exchangeData[exchange].fees;
        Object.keys(exchangeFees).forEach(currency => {
            if (!result[currency]) {
                result[currency] = [];
            }
            const exchangeCurrencyDataIndex = findIndex(result[currency], currencyData => currencyData.exchange === exchange);
            const feeData = exchangeFees[currency][exchangeFees[currency].length - 1];
            const fee = feeData.fee;
            if (exchangeCurrencyDataIndex > -1) {
                result[currency][exchangeCurrencyDataIndex].fee = fee;

            } else {
                result[currency].push({ fee, exchange, last_update_time: feeData.last_update_time });
            }
        });
    });
    return result;
};

export type HistoricData = {
    [string]: {
        fees: { [string]: Array<{ fee: number, type: string, last_udpate_time: number }> },
        position: { [string]: Array<{ current: number, locked: number, last_udpate_time: number }> }
    };
};

export function convertToHistoric(exchangeData): HistoricData {
    const result = {};
    if (!exchangeData) return null;

    Object.keys(exchangeData).forEach(exchange => {
        const exchangePositions = exchangeData[exchange].positions;
        Object.keys(exchangePositions).forEach(currency => {
            if (!result[currency]) {
                result[currency] = { fees: {}, positions: { [exchange]: exchangePositions[currency] } };

            } else {
                result[currency].positions[exchange] = exchangePositions[currency];
            }
        });

        const exchangeFees = exchangeData[exchange].fees;
        Object.keys(exchangeFees).forEach(currency => {
            if (!result[currency]) {
                result[currency] = { fees: { [exchange]: exchangeFees[currency] }, positions: {} };

            } else {
                result[currency].fees[exchange] = exchangeFees[currency];
            }
        });
    });
    return result;
};

// @flow

// type PositionData = {
//     current: number,
//     locked: number,
//     last_update_time: string
// };
// type FeeData = {
//     fee: number,
//     last_update_time: string,
//     type: string 
// };
// type ExchangePositionData = {
//     bat?: PositionData,
//     bcd?: PositionData,
//     bcpt?: PositionData,
//     bnb?: PositionData,
//     btc?: PositionData,
//     etc?: PositionData,
//     etf?: PositionData,
//     eth?: PositionData,
//     gas?: PositionData,
//     nano?: PositionData,
//     neo?: PositionData,
//     ont?: PositionData
// }
// type ExchangeFeeData = {
//     bat?: FeeData,
//     bcd?: FeeData,
//     bcpt?: FeeData,
//     bnb?: FeeData,
//     btc?: FeeData,
//     etc?: FeeData,
//     etf?: FeeData,
//     eth?: FeeData,
//     gas?: FeeData,
//     nano?: FeeData,
//     neo?: FeeData,
//     ont?: FeeData
// }
// type ContriveExchangeDataInput = {
//     positions: {
//         binance: ExchangePositionData, 
//         bittrex: ExchangePositionData,
//         bridge: ExchangePositionData,
//         coinbase: ExchangePositionData
//     },
//     fees: {
//         binance: ExchangeFeeData,
//         coinbase: ExchangeFeeData
//     }
// };

const applyVariance = (value: number) => {
    const directionFactor = Math.random() > 0.5 ? -1 : 1;
    const varianceFactor = 1 + (Math.random() * 0.02 * directionFactor)
    const val = value === 0 ? 1 : value;
    return val * varianceFactor;
};

export const transformExchangeData = (data) => {
    const response = {};
    Object.keys(data.positions).forEach(exchange => {
        if (!response.exchange) {
            response[exchange] = { positions: {}, fees: {} };
        }
        const exchangePositions = data.positions[exchange];

        Object.keys(exchangePositions).forEach(currency => {
            let lastPositionData = {
                current: exchangePositions[currency].current,
                locked: exchangePositions[currency].locked,
                last_update_time: (new Date(exchangePositions[currency].last_udpate_time)).getTime()
            };;
            response[exchange].positions[currency] = [lastPositionData];
            for (let i = 0; i < 287; ++i) {
                lastPositionData = {
                    current: applyVariance(lastPositionData.current),
                    locked: applyVariance(lastPositionData.locked),
                    last_update_time: lastPositionData.last_update_time + 5 * 60 * 1000
                }
                response[exchange].positions[currency].push(lastPositionData);
            }
        });
    });

    Object.keys(data.fees).forEach(exchange => {
        if (!response.exchange) {
            response[exchange] = { positions: {}, fees: {} };
        }
        const exchangeFees = data.fees[exchange];

        Object.keys(exchangeFees).forEach(currency => {
            let lastFeeData = {
                fee: exchangeFees[currency].fee,
                type: exchangeFees[currency].type,
                last_update_time: (new Date(exchangeFees[currency].last_update_time)).getTime()
            };;
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

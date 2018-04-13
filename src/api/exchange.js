// @flow
import request from 'superagent';

export const getExchangesPositions = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            request
                .get("https://my-json-server.typicode.com/kitsunelabs/dummyjson/db")
                .end((err, res) => {
                    const showError = Math.random() < 0.3;
                    if (err || showError) {
                        // Log error to sentry
                        return reject(err);
                    }
                    return resolve(res.body || res.text);
                });
        }, Math.random() * 3000)
    });
}

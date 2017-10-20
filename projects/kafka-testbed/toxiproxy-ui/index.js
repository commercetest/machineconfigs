const request = require('request-promise-native');
const toxiproxyClient = require("toxiproxy-node-client");
const IP = require('ip').address();

return new Promise(async (resolve, reject) => {
    const toxiproxy = new toxiproxyClient.Toxiproxy(`http://${IP}:8474`);
    await toxiproxy.reset();

    const proxyBody = {
        listen: `${IP}:1337`,
        name: "kafka_test",
        upstream: `cleanroom-2:9092` //TODO: make configurable
    };
    return toxiproxy.createProxy(proxyBody)
        .then((proxy) => {
            const toxicBody = {
                attributes: {
                    rate: 1000
                },
                toxicity: 100,
                type: "bandwidth"
            };
            let toxic = new toxiproxyClient.Toxic(proxy, toxicBody);

            proxy.addToxic(toxic);

            const express = require('express');
            const app = express();

            app.use(function (req, res, next) {
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                next();
            });

            app.post('/bandwidth/:rate', async function (req, res) {
                const { rate } = req.params;

                toxicBody.attributes.rate = Number(rate);
                try {
                    await request({
                        method: 'POST',
                        json: true,
                        uri: `http://${IP}:8474/proxies/kafka_test/toxics/bandwidth_downstream`,
                        body: toxicBody
                    });
                } catch (e) {
                    console.error(e);
                    return res.status(500).send(e);
                }

                console.info(`Updated speed to ${rate}`);

                res.send(rate);
            });

            app.get('/bandwidth', (req, res) => {
                res.send(rate);
            });

            app.listen(1338);
        });
})
    .then((toxic) => console.log(toxic.toJson()))
    .catch(console.error);
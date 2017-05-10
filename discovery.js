'use strict';

let request = require('request-promise-native');
let Rx = require('rxjs/Rx');
let dgram = require('dgram');
let _ = require('lodash');

function getCloudData(user, password) {
    let subject = new Rx.Subject(),
        cloud = request.defaults({
            headers: { 'User-Agent': 'Plum/2.3.0 (iPhone; iOS 9.2.1; Scale/2.00)' },
            auth: { user: user, pass: password },
            json: true
        });

    cloud.get('https://production.plum.technology/v2/getHouses').then((houses) => {
        houses.forEach((houseId) => {
            cloud.post({
                url: 'https://production.plum.technology/v2/getHouse',
                json: { "hid": houseId }
            }).then((house) => {
                house.rids.forEach((roomId) => {
                    cloud.post({
                        url: 'https://production.plum.technology/v2/getRoom',
                        json: { "rid": roomId }
                    }).then((room) => {
                        room.llids.forEach((logicalLoadId) => {
                            cloud.post({
                                url: 'https://production.plum.technology/v2/getLogicalLoad',
                                json: { "llid": logicalLoadId }
                            }).then((logicalLoad) => {
                                logicalLoad.lpids.forEach((lightpadId) => {
                                    cloud.post({
                                        url: 'https://production.plum.technology/v2/getLightpad',
                                        json: { "lpid": lightpadId }
                                    }).then((lightpad) => {
                                        lightpad.houseId = house.hid,
                                        lightpad.houseName = house.house_name,
                                        lightpad.houseAccessToken = house.house_access_token;
                                        lightpad.roomId = room.rid;
                                        lightpad.roomName = room.room_name;
                                        lightpad.logicalLoadName = logicalLoad.logical_load_name;
                                        subject.next(lightpad);
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    }).catch((err) => {
        console.error(err);
    });

    return subject.asObservable();
};

function findLocalLightpads() {
    let subject = new Rx.Subject(),
        socket = dgram.createSocket('udp4');

    socket.on('message', (data, responderInfo) => {
        let responseData = String(data).match(/PLUM\ (\d+)\ ([a-f0-9\-]+)\ (\d+)/);
        subject.next({
            id: responseData[2],
            address: responderInfo.address,
            controlPort: parseInt(responseData[3]),
            eventPort: 2708
        });
    });

    socket.on('close', () => {
        subject.complete();
    })

    socket.bind(() => {
        socket.setBroadcast(true);
        socket.send('PLUM', 0, 4, 43770, "255.255.255.255");
        setTimeout(() => socket.close(), 5000);
    });

    return subject.asObservable();
};

/**
 * @param {string} user username for online plum account
 * @param {string=} password password for online plum account
 */
module.exports = {
    getCloudData: getCloudData,
    findLocalLightpads: findLocalLightpads
};
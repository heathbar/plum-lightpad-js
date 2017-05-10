'use strict'

let Rx = require('rxjs/Rx');
let net = require('net');

module.exports = function PlumLightpad(cloudData, localData) {
    // copy all properties from cloudData and localData to this instance
    Object.assign(Object.assign(this, cloudData), localData);

    let events = new Rx.Subject();
    this.events = events.asObservable();

    let socket = net.createConnection(2708, '10.1.1.34', () => {

        // Turn the data events into an Observable sequence
        let connections = Rx.Observable.fromEvent(socket, 'data');

        connections.subscribe((data) => {
            let messages = data.toString('UTF-8').split('.\n').filter(String);
            messages.forEach((message) => {
                try {
                    events.next(JSON.parse(message));
                } catch (err) {
                    console.error(err);
                }
            });
        });
    });

    this.getLevel = () => {

    }


    function post(url, data) {
        
    }
}

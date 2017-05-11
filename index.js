'use strict';

let request = require('request-promise-native');
let Rx = require('rxjs/Rx');
let _ = require('lodash');
let discovery = require('./discovery');
let PlumLightpad = require('./lightpad');

/**
 * Merge the data structures from a cloud/local lightpad
 */
function mergeLightpads(cloud, local) {
    return Object.assign(Object.assign({}, cloud), local);
}


/**
 * @param {string} user username for online plum account
 * @param {string=} password password for online plum account
 */
module.exports = class Plum {

    static discover(user, password) {
        let subject = new Rx.Subject(),
        cloudDevices = [],
        localDevices = [];

        discovery.getCloudData(user, password).subscribe((cloudDevice) => {
            cloudDevices.push(cloudDevice);
            
            // check for matching local device
            let localDevice = _.find(localDevices, {id: cloudDevice.lpid});
            if (localDevice) {
                subject.next(new PlumLightpad(cloudDevice, localDevice));
            }
        });

        discovery.findLocalLightpads().subscribe((localDevice) => {
            localDevices.push(localDevice);
            
            // check for matching cloud device
            let cloudDevice = _.find(cloudDevices, {lpid: localDevice.id});
            if (cloudDevice) {
                subject.next(new PlumLightpad(cloudDevice, localDevice));
            }
        });

        return subject.asObservable();
    }
}

import { Observable } from 'rxjs';
import { FullResponse } from 'request-promise-native';

export = Plum;

declare class Plum {
    static discover(user: string, password: string): Observable<Plum.Lightpad>;
}

/*~ If you want to expose types from your module as well, you can
 *~ place them in this block.
 */
declare namespace Plum {
    export interface Lightpad {
        getLevel(): Promise<LogicalLoadMetrics>;
        getMetrics(): Promise<LogicalLoadMetrics>;
        setLevel(level: number): Promise<void>;
        post(): Promise<FullResponse>;
        config: LightpadConfig;
        is_provisioned: boolean;
        llid: string;
        custom_gestures: number;
        lightpad_name: string;
        lpid: string;
        houseId: string;
        houseName: string;
        houseAccessToken: string;
        roomId: string;
        roomName: string;
        logicalLoadName: string;
        id: string;
        address: string;
        controlPort: number;
        eventPort: number;
        events: Observable<any>
    }

    export interface LogicalLoadMetrics {
        level: number;
        lightpad_metrics: LightpadMetrics[];
        power: number;
    }

    export interface LightpadMetrics {
        lpid: string;
        level: number;
        power: number;
    }

    export interface LightpadConfig {
        slowFadeTime: number;
        touchRate: number;
        cluster: string;
        uuid: string;
        logRemote: boolean;
        forceGlow: boolean;
        occupancyAction: string;
        occupancyTimeout: number;
        fadeOffTime: number;
        glowIntensity: number;
        name: string;
        fadeOnTime: number;
        defaultLevel: number;
        glowTracksDimmer: boolean;
        dimEnabled: boolean;
        glowFade: number;
        amqpEnabled: boolean;
        trackingSpeed: number;
        minimumLevel: number;
        versionLocked: boolean;
        glowTimeout: number;
        rememberLastDimLevel: boolean;
        serialNumber: string;
        pirSensitivity: number
        glowEnabled: boolean;
        glowColor: LightpadGlowColor;
        maxWattage: number;
    }

    export interface LightpadGlowColor {
        white: number;
        red: number;
        green: number;
        blue: number;
    }
}
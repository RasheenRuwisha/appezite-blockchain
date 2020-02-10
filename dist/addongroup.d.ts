import { Addon } from "./addons";
export declare class AddonGroup {
    name: string;
    isAddonMandatory: boolean;
    maximimCount: number;
    addons: Array<Addon>;
}

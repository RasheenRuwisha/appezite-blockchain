import { Addon } from "./addons";

export class AddonGroup{
    public name: string;
    public isAddonMandatory: boolean;
    public maximimCount: number;
    public addons: Array<Addon>
}
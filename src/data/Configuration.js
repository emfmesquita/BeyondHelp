import Data from "./Data";
import Opt from "../Options";

const defaultFalseOptions = [
    Opt.ExtraMapRefsDrawingBundle
];

class Configuration extends Data {
    constructor(storageId: string) {
        super(storageId);
        this.activeEncounterId = null;

        Opt.AllOptions.forEach(opt => this[opt] = Configuration.initialValue(opt));

        this.scrollyoffset = 0;
        this.scrollpageheight = 0;
    }

    static initialValue(configKey: string) {
        if (configKey === Opt.Changelog) return [];
        return defaultFalseOptions.indexOf(configKey) === -1 ? true : "";
    }
}

export default Configuration;
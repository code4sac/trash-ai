import sha256 from "crypto-js/sha256";
import md5 from "crypto-js/md5";

export default ({}, inject) => {
    inject("sha256", {
        obj: (obj) => {
            let hash = sha256(JSON.stringify(obj));
            return hash.toString();
        },
        str: (str) => {
            let hash = sha256(str);
            return hash.toString();
        },
    });
    inject("md5", {
        obj: (obj) => {
            let hash = md5(JSON.stringify(obj));
            return hash.toString();
        },
        str: (str) => {
            return md5(str).toString();
        },
    });
};

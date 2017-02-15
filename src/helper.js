import {ArrayPrototypes, ObjectPrototypes} from "js-prototypes";
ArrayPrototypes.equals();
ObjectPrototypes.equals();

function equals(a, b) {
    if(Array.isArray(a))
        return a.equals(b);

    if(typeof a === "object" && a != null)
        return Object.equals(a, b);

    return a == b;
}

function isURL(str) {
    let pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return pattern.test(str);
}

export {equals, isURL};
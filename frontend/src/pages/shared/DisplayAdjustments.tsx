import * as KeyConstraints1 from './KeyConstraints1';
import * as KeyConstraints2 from './KeyConstraints2';

export function removeUnder(keyName: string) {
    return keyName.replace("_modified", "").split('_').join(' ');
}

export function keyConstraints1(key: string, modelName: string) {
    switch (modelName) {
        case "Cities":
            return KeyConstraints1.cities(key);
        case "Commutes":
            return KeyConstraints1.commutes(key);
        case "Homes":
            return KeyConstraints1.homes(key);
        default:
            throw new Error("entered bad case: " + modelName);
    }
}

export function keyConstraints2(key: string, modelName: string) {
    switch (modelName) {
        case "Cities":
            return KeyConstraints2.cities(key);
        case "Commutes":
            return KeyConstraints2.commutes(key);
        case "Homes":
            return KeyConstraints2.homes(key);
        default:
            throw new Error("entered bad case: " + modelName);
    }
}

export function reformatString(camelString: string) {
    return camelString.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) {
        return str.toUpperCase();
    })
}
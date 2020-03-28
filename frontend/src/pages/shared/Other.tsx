export function clearArray(array) {
    while (array.length) {
        array.pop();
    }
}

export function clearDict(dict) {
    for (var ele in dict) {
        if (dict.hasOwnProperty(ele)) {
            delete dict[ele];
        }
    }
}
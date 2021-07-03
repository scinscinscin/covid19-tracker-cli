// this file contains stuff to help manipulate strings
// https://stackoverflow.com/questions/7225407/convert-camelcasetext-to-sentence-case-text
export const camelToSentenceCase = (camel: string): string => {
    let result = camel.replace(/([A-Z])/g, " $1");
    var finalResult = result.charAt(0).toUpperCase() + result.slice(1);
    return finalResult;
};

// prettier-ignore
export const capitalizeFirstLetter = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);

// prettier-ignore
// sorting function that sorts based on the length of the number such that the longest strings are the first elements
export const sortBasedOnLength = (a: string, b: string): number => a.length === b.length ? 0 : a.length > b.length ? -1 : 1;

// removes any ansi escape codes
export const removeANSI: (str: string) => string = (str) => {
    while (str.includes("\x1B")) {
        str = str.replace(/\u001b[^m]*?m/g, "");
    }
    return str;
};

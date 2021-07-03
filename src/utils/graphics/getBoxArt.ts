import colors from "colors";

const regularBoxArt = {
    topLeft: "╔",
    topRight: "╗",
    bottomLeft: "╚",
    bottomRight: "╝",
    vertical: "║",
    horizontal: "═",
    verticallyMergeRight: "╠",
    verticallyMergeLeft: "╣",
    horizontallyMergeUp: "╩",
    horizontallyMergeDown: "╦",
    horizontallyMergeSingleUp: "╧",
    intersection: "╬",
    singleVertical: "│",
    singleHorizontal: "─",
    singleIntersection: "┼",
    singleVerticallyMergeRight: "╟",
    singleVerticallyMergeLeft: "╢",
    singleHorizontallyMergeUp: "╧",
    singleHorizontallyMergeDown: "╤",
};

export type BoxArt = typeof regularBoxArt;

/**
 *
 * @param color is a string that can be used by the colors library to color-ify strings
 * @returns An object containing colored box art pieces
 */
export const getBoxArt: (color: keyof colors.Color) => BoxArt = (color) => {
    let keys = Object.keys(regularBoxArt) as unknown as (keyof BoxArt)[];

    let coloredPieces = Object.values(regularBoxArt).map((piece) => {
        return colors[color](piece);
    });

    let response = {} as BoxArt;
    keys.forEach((key, index) => {
        response[key] = coloredPieces[index];
    });
    return response;
};


export const COLS = 10;
export const ROWS = 10;
export const CELL_SIZE = 30;
export const FLASH_DURATION = 150;
export const INITIAL_SHUFFLES = 3;

export const COLORS = [
    '#66b2ff', '#ff8585', '#66ff99', '#ffcc66', '#a366ff', '#4dffc0', '#ff66b2', '#8c95ff'
];

export const DETONABLE_COLOR = '#ffea00';

export const PIECES = [
    // 1x1 block
    [[1]],
    // 1x2 and 2x1 rectangles
    [[1, 1]],
    [[1], [1]],
    // 1x3 and 3x1 rectangles
    [[1, 1, 1]],
    [[1], [1], [1]],
    // 1x4 and 4x1 rectangles
    [[1, 1, 1, 1]],
    [[1], [1], [1], [1]],
    // 2x2 square
    [[1, 1], [1, 1]],
    // 3x3 square
    [[1, 1, 1], [1, 1, 1], [1, 1, 1]],
    // L-shapes
    [[1, 0], [1, 0], [1, 1]],
    [[1, 1, 1], [1, 0, 0]],
    [[0, 1], [0, 1], [1, 1]],
    [[1, 1, 1], [0, 0, 1]],
    // J-shapes (mirrored L)
    [[0, 1], [0, 1], [1, 1]],
    [[1, 1, 1], [0, 0, 1]],
    [[1, 0], [1, 0], [1, 1]],
    [[1, 1, 1], [1, 0, 0]],
    // T-shapes
    [[0, 1, 0], [1, 1, 1]],
    [[1, 0], [1, 1], [1, 0]],
    [[1, 1, 1], [0, 1, 0]],
    [[0, 1], [1, 1], [0, 1]],
    // S-shape
    [[0, 1, 1], [1, 1, 0]],
    // Z-shape
    [[1, 1, 0], [0, 1, 1]],
];

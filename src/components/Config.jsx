import * as d3 from 'd3';

// Original color scheme
const colorScheme = [
    "#db3d2f",
    "#EF2917",
    "#EF5A17",
    "#EF8A17",
    "#DBA515",
    "#C6C013",
    "#63A12E",
    "#008148",
    "#007541",
    "#006A3B"
];

// Function to create the extended color scheme
const createExtendedColorScheme = (colors, length = 1000) => {
    const scale = d3.scaleLinear()
        .domain(colors.map((_, i) => i / (colors.length - 1)))
        .range(colors)
        .interpolate(d3.interpolateRgb);
    // reverse the scale to go from 0 to 1
    return Array.from({ length }, (_, i) => scale(i / (length - 1)));
};

const extendedColorScheme = createExtendedColorScheme(colorScheme, 101);

const getColor = (value, min = 0, max = 100) => {
    if (value === null || value === undefined) return "#ccc";
    // Adjust the index calculation to use the length of the extended color scheme
    const index = Math.floor(((value - min) / (max - min)) * (extendedColorScheme.length - 1));
    return extendedColorScheme[Math.min(index, extendedColorScheme.length - 1)];
};

export { colorScheme, getColor, extendedColorScheme };
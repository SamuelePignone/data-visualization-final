import * as d3 from 'd3';

// Original color scheme
const colorScheme = [
    "#fff5f0",
    "#fee0d2",
    "#fcbba1",
    "#fc9272",
    "#fb6a4a",
    "#ef3b2c",
    "#cb181d",
    "#a50f15",
    "#67000d",
];

// Function to create the extended color scheme
const createExtendedColorScheme = (colors, length = 1000) => {
    const scale = d3.scaleLinear()
        .domain(colors.map((_, i) => i / (colors.length - 1)))
        .range(colors)
        .interpolate(d3.interpolateRgb);
    return Array.from({length}, (_, i) => scale(i / (length - 1)));
};

const extendedColorScheme = createExtendedColorScheme(colorScheme, 101);

const getColor = (value, min = 0, max = 100) => {
    if (value === null || value === undefined) return "#ccc";
    // Adjust the index calculation to use the length of the extended color scheme
    const index = Math.floor(((value - min) / (max - min)) * (extendedColorScheme.length - 1));
    return extendedColorScheme[Math.min(index, extendedColorScheme.length - 1)];
};

export { colorScheme, getColor, extendedColorScheme };
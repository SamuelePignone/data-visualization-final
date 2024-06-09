import * as d3 from 'd3';

const colorSchemes = {
    normal: [
        "#B3E283", // Light Green
        "#E8E46E", // Light Yellow
        "#F3C583", // Peach
        "#E99497"  // Light Coral
    ],
    protanopia: ['#5D8AA8', '#FFB347', '#B39EB5', '#FF6961'],
    deuteranopia: ['#FF6F61', '#6B5B95', '#88B04B', '#FFCC5C'],
    tritanopia: ['#FFD662', '#955251', '#009B77', '#DD4124'],
    monochromacy: ['#BFBFBF', '#7F7F7F', '#3F3F3F', '#000000']
  };

const primaryColor = "#68a6ed";

// Function to create the extended color scheme
const createExtendedColorScheme = (colors, length = 1000) => {
    const scale = d3.scaleLinear()
        .domain(colors.map((_, i) => i / (colors.length - 1)))
        .range(colors)
        .interpolate(d3.interpolateRgb);
    return Array.from({ length }, (_, i) => scale(i / (length - 1)));
};

// Get color scheme based on blindness mode
const getColorScheme = (blindness = 'normal') => {
    const colors = colorSchemes[blindness] || colorSchemes.normal;
    return createExtendedColorScheme(colors, 101);
};

// Initialize with the default (normal) color scheme
let colorScheme = colorSchemes.normal;
let extendedColorScheme = getColorScheme('normal');

const getColor = (value, min = 0, max = 100) => {
    if (value === null || value === undefined) return "#ccc";
    const index = Math.floor(((value - min) / (max - min)) * (extendedColorScheme.length - 1));
    return extendedColorScheme[Math.min(index, extendedColorScheme.length - 1)];
};

const setBlindnessMode = (blindness) => {
    colorScheme = colorSchemes[blindness] || colorSchemes.normal;
    extendedColorScheme = getColorScheme(blindness);
};

export { colorScheme, extendedColorScheme, getColor, setBlindnessMode, primaryColor };
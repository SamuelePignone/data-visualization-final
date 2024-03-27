import React, { useState, useEffect } from 'react';
import { Heatmap, HeatmapSeries } from 'reaviz';
import * as d3 from 'd3';
import data_file from '../../data/heatmap.json';

function Section3() {
    const [dimensions, setDimensions] = useState({
        width: 1300,
        height: 400,
        margin: { top: 50, right: 30, bottom: 30, left: 60 },
    });
    const [data, setData] = useState([]);
    const [selectedYear, setSelectedYear] = useState("2023");

    useEffect(() => {
        // search the data with key = selectedYear
        setData(data_file[selectedYear]);
    });

    var interpolator = d3.scaleSequential(d3.interpolateBlues)
        .domain([0, 1000]);

    // create a list of colors from 0 to 100
    var array_from_0_to_1000 = Array.from(Array(1001).keys());
    var colorScheme = array_from_0_to_1000.map(interpolator);

    return (
        <>
            <div style={{ margin: '55px', textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                <Heatmap
                    height={dimensions.height - dimensions.margin.top - dimensions.margin.bottom}
                    width={dimensions.width - dimensions.margin.left - dimensions.margin.right}
                    data={data}
                    series={<HeatmapSeries colorScheme={colorScheme} emptyColor='#f5f5f5' />}
                />
            </div>
        </>
    )
}

export default Section3
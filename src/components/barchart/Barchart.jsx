import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import dataFile from '../../data/Last_barchart.json';


function BarChart() {
    const ref = useRef();
    const [selectedYear, setSelectedYear] = useState(2022);
    const [selectedGeo, setSelectedGeo] = useState("AT");
    const [nationList, setNationList] = useState([...new Set(dataFile.map(d => d.geo))]);
    const [size_emp, setSize_emp] = useState('GE250');
    const [size_empList, setSizeEmpList] = useState([]);
    const [indic_is_List, setIndicIs_List] = useState([...new Set(dataFile.map(d => d.indic_is))]);
    const [dimensions, setDimensions] = useState({
        width: 1000,
        height: 600,
        margin: { top: 200, right: 25, bottom: 20, left: 100 },
    });


    useEffect(() => {
        const svg = d3.select(ref.current);
        svg.selectAll("*").remove(); // Clear svg content before adding new elements

        setSizeEmpList([...new Set(dataFile.map(d => d.size_emp))]);


        console.log("_____________________________")
        console.log(dataFile);

        //select the data with geo == SelectedGeo
        var data = dataFile.filter(d => d.geo === selectedGeo && d.TIME_PERIOD === selectedYear && d.size_emp === size_emp);
        const x = d3.scaleBand()
            .rangeRound([0, dimensions.width])
            .padding(0.1)
            .domain(data.map(d => d.indic_is));

        const y = d3.scaleLinear()
            .rangeRound([dimensions.height, 0])
            .domain([0, d3.max(data, d => d.OBS_VALUE)]);

        /*svg.append("g")
            .attr("transform", `translate(0,${dimensions.height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        svg.append("g")
            .call(d3.axisLeft(y).ticks(10))
            .append("text")
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("Value");

        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.indic_is))
            .attr("y", d => y(d.OBS_VALUE))
            .attr("width", x.bandwidth())
            .attr("height", d => dimensions.height - y(d.OBS_VALUE))
            .attr("fill", "steelblue");
            */

    }, []); // Redraw chart if data changes

    return (
        <div ref={ref} className='w-fit flex items-center justify-center'></div>
    );
};

export default BarChart;

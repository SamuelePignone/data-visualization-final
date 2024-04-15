import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import dataFile from '../../data/Area_chart.json';
import { getColor } from '../Config';
import { mapstate, map_size_emp, map_size_emp_to_number } from '../MapState';

function AreaChart() {
    const ref = useRef();
    const [loading, setLoading] = useState(true);
    const [dimensions, setDimensions] = useState({
        width: 1000,
        height: 1000,
        margin: { top: 0, right: 25, bottom: 20, left: 100 },
    });

    const [indic_is, setIndicIs] = useState('E_AESBHM');
    const [geo, setGeo] = useState('DE');

    useEffect(() => {
        const container = d3.select(ref.current);
        container.selectAll('svg').remove();

        const svg = container
            .append('svg')
            .style('margin', '0 auto')
            .attr('width', dimensions.width)
            .attr('height', dimensions.height)
            .append('g')
            .attr('transform', `translate(${dimensions.margin.left}, ${dimensions.margin.top})`);

        const data = dataFile.filter(d => d.geo === geo).filter(d => d.indic_is === indic_is);

        const size_emp_set_list = [...new Set(data.map(d => d.size_emp))];

        var sources = size_emp_set_list.map(function (size_emp) {
            return {
                size_emp: size_emp,
                values: data.map(function (d) {
                    return { TIME_PERIOD: d.TIME_PERIOD, OBS_VALUE: d.OBS_VALUE};
                })
            };
        });
        
        // sort sources by TIME_PERIOD
        sources.forEach(function (s) {
            s.values.sort(function (a, b) {
                return a.TIME_PERIOD - b.TIME_PERIOD;
            });
        });

        console.log(sources);

        const x_domain = d3.extent(dataFile, d => d.TIME_PERIOD)

        const x = d3.scaleLinear()
            .domain(x_domain)
            .range([0, dimensions.width - dimensions.margin.left - dimensions.margin.right]);

        const y = d3.scaleLinear()
            .domain([0, 100])
            .range([dimensions.height - dimensions.margin.top - dimensions.margin.bottom, 0]);

        const xAxis = d3.axisBottom(x)
            .ticks(x_domain[1] - x_domain[0])
            .tickFormat(d3.format("d"));

        const yAxis = d3.axisLeft(y)
            .ticks(10);

        svg.append('g')
            .attr('transform', `translate(0, ${dimensions.height - dimensions.margin.top - dimensions.margin.bottom})`)
            // rotate x-axis labels by 45 degrees
            .call(xAxis)
            .selectAll('text')
            .style('font-size', '14px')
            .style("font-weight", "700")
            .attr('transform', 'rotate(-45)')
            .attr('x', -10)
            .attr('y', 5)
            .style('text-anchor', 'end');

        svg.append('g')
            .call(yAxis)
            .selectAll('text')
            // add % sign to y-axis labels
            .text(d => d + '%')
            .style('font-size', '12px')
            .style("font-weight", "700");

        // gridlines in x axis function
        function make_x_gridlines() {
            return d3.axisBottom(x)
                .ticks(x_domain[1] - x_domain[0])
        }

        // gridlines in y axis function
        function make_y_gridlines() {
            return d3.axisLeft(y)
                .ticks(10)
        }

        // add the X gridlines
        svg.append('g')
            .attr('class', 'grid')
            .attr('transform', `translate(0, ${dimensions.height - dimensions.margin.top - dimensions.margin.bottom})`)
            .call(make_x_gridlines()
                .tickSize(-dimensions.height + dimensions.margin.top + dimensions.margin.bottom)
                .tickFormat('')
            )
            .style('stroke-opacity', 0.1)
            .style('stroke-dasharray', '5,5')

        // add the Y gridlines
        svg.append('g')
            .attr('class', 'grid')
            .call(make_y_gridlines()
                .tickSize(-dimensions.width + dimensions.margin.left + dimensions.margin.right)
                .tickFormat('')
            )
            .style('stroke-opacity', 0.1)
            .style('stroke-dasharray', '5,5')

        var area = d3.area()
            .curve(d3.curveMonotoneX)
            .x(function (d) { return x(d.TIME_PERIOD); })
            .y0(y(0))
            .y1(function (d) { return y(d.OBS_VALUE); });

        var source = svg.selectAll(".area")
            .data(sources)
            .enter().append("g")
            .attr("class", function (d) { return `area ${d.size_emp}`; })

        source.append("path")
            .attr("d", function (d) { return area(d.values); })
            .style("fill", function (d) { return getColor(map_size_emp_to_number(d.size_emp)); });
    }, []);
    return (
        <div className="w-screen mb-64">
            <h1>Stacked Area Chart</h1>
            <div ref={ref}></div>
        </div>
    );
}
export default AreaChart;
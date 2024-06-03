import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import dataFile from '../../data/Area_chart.json';
import { getColor } from '../Config';
import { mapstate, map_size_emp, map_size_emp_to_number, map_code_to_description } from '../MapState';
import NationSelector from "../NationSelector";
import Loader from "../Loader";
import Tooltip from "../Tooltip";

function AreaChart() {
    const ref = useRef();
    const [loading, setLoading] = useState(true);
    const [dimensions, setDimensions] = useState({
        width: 1000,
        height: 600,
        margin: { top: 50, right: 20, bottom: 50, left: 80 },
    });

    const [indic_is, setIndicIs] = useState('E_AESELL');
    const [nationList, setNationList] = useState([...new Set(dataFile.map(d => d.geo))]);
    const [indic_isList, setIndicIsList] = useState([]);
    const [selectedGeo, setSelectedGeo] = useState("DE");

    const [showDataPreparation, setShowDataPreparation] = useState(false);

    const [tooltipContent, setTooltipContent] = useState('');
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        setLoading(true);
        const container = d3.select(ref.current);
        container.selectAll('svg').remove();

        const svg = container
            .append('svg')
            .style('margin', '0 auto')
            .attr('width', dimensions.width)
            .attr('height', dimensions.height)
            .append('g')
            .attr('transform', `translate(${dimensions.margin.left}, ${dimensions.margin.top})`);

        // implement #drop-shadow
        var defs = svg.append("defs");

        var filter = defs.append("filter")
            .attr("id", "drop-shadow")
            .attr("height", "130%");

        filter.append("feGaussianBlur")
            .attr("in", "SourceAlpha")
            .attr("stdDeviation", 3)
            .attr("result", "blur");

        var feOffset = filter.append("feOffset")
            .attr("dx", 0)
            .attr("dy", -1)
            .attr("result", "offsetBlur");

        var feMerge = filter.append("feMerge");

        feMerge.append("feMergeNode")
            .attr("in", "offsetBlur")
        feMerge.append("feMergeNode")
            .attr("in", "SourceGraphic");

        var feFlood = filter.append("feFlood")
            .attr("flood-color", "black")
            .attr("flood-opacity", 0.2)
            .attr("result", "flood");

        var feComposite = filter.append("feComposite")
            .attr("in", "flood")
            .attr("in2", "offsetBlur")
            .attr("operator", "in")
            .attr("result", "shadow");

        var feMerge2 = filter.append("feMerge");

        feMerge2.append("feMergeNode")
            .attr("in", "shadow")
        feMerge2.append("feMergeNode")
            .attr("in", "SourceGraphic");

        // Remove shadows on left and right
        svg.select(".grid")
            .style("stroke-opacity", 0);

        var data = dataFile.filter(d => d.geo === selectedGeo)
        var indic_is_set_list = [...new Set(data.map(d => d.indic_is))];
        setIndicIsList(indic_is_set_list);
        data = data.filter(d => d.indic_is === indic_is);

        const size_emp_set_list = [...new Set(data.map(d => d.size_emp))];

        var sources = size_emp_set_list.map(function (size_emp) {
            var tmp = data.filter(function (d) {
                return d.size_emp === size_emp;
            });
            return {
                size_emp: size_emp,
                values: tmp.map(function (d) {
                    return { TIME_PERIOD: d.TIME_PERIOD, OBS_VALUE: d.OBS_VALUE };
                })
            };
        });

        // sort sources by TIME_PERIOD
        sources.forEach(function (s) {
            s.values.sort(function (a, b) {
                return a.TIME_PERIOD - b.TIME_PERIOD;
            });
        });

        sources.forEach(function (s) {
            var new_values = [];
            var i = 0;
            while (i < s.values.length) {
                var sum = s.values[i].OBS_VALUE;
                var count = 1;
                while (i + count < s.values.length && s.values[i + count].TIME_PERIOD === s.values[i].TIME_PERIOD) {
                    sum += s.values[i + count].OBS_VALUE;
                    count++;
                }
                new_values.push({ TIME_PERIOD: s.values[i].TIME_PERIOD, OBS_VALUE: sum / count });
                i += count;
            }
            s.values = new_values;
        });

        // sort sources by the smallest area to the largest given by the sum of OBS_VALUE
        sources.sort(function (a, b) {
            return d3.sum(b.values, function (d) { return d.OBS_VALUE; }) - d3.sum(a.values, function (d) { return d.OBS_VALUE; });
        });

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
            .style('font-size', '16px')
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
            .style('font-size', '16px')
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
            .style("opacity", 1)
            .attr("class", function (d) { return `area ${d.size_emp}`; })

        source.append("path")
            .attr("d", function (d) { return area(d.values); })
            .attr("class", function (d) { return "areapath " + map_size_emp(d.size_emp).toLowerCase().replace(/\s/g, '') })
            .style("fill", function (d) { return getColor(map_size_emp_to_number(d.size_emp)); })
            .style("fill-opacity", 1)
            .style("filter", "url(#drop-shadow)")
            .on('mouseover', (event, d) => {
                setTooltipContent(`<p>${map_size_emp(d.size_emp)}</p>`);
                setTooltipPosition({ x: event.pageX, y: event.pageY })
                setTooltipVisible(true)
                d3.selectAll('.areapath').style('fill-opacity', 0);
                d3.selectAll('.dot').style('fill-opacity', 0);
                d3.selectAll('.dot').style('stroke-opacity', 0);
                d3.selectAll(`.${map_size_emp(d.size_emp).toLowerCase().replace(/\s/g, '')}`).style('fill-opacity', 1);
            })
            .on('mouseout', () => {
                setTooltipVisible(false)
                d3.selectAll('.areapath').style('fill-opacity', 1);
                d3.selectAll('.dot').style('fill-opacity', 1);
                d3.selectAll('.dot').style('stroke-opacity', 0.5);
            });

        // add legend
        var legend = svg.selectAll(".legend")
            .data(sources)
            .enter().append("g")
            .attr("class", "legend")
            .style("cursor", "pointer")
            .attr("transform", function (d, i) { return `translate(0,${i * 20})`; })
            .on('mouseover', (event, d) => {
                d3.selectAll('.areapath').style('fill-opacity', 0);
                d3.selectAll('.dot').style('fill-opacity', 0);
                d3.selectAll('.dot').style('stroke-opacity', 0);
                d3.selectAll(`.${map_size_emp(d.size_emp).toLowerCase().replace(/\s/g, '')}`).style('fill-opacity', 1);
            })
            .on('mouseout', () => {
                d3.selectAll('.areapath').style('fill-opacity', 1);
                d3.selectAll('.dot').style('fill-opacity', 1);
                d3.selectAll('.dot').style('stroke-opacity', 0.5);
            });

        legend.append("rect")
            .attr("x", dimensions.width - dimensions.margin.left - dimensions.margin.right - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", function (d) { return getColor(map_size_emp_to_number(d.size_emp)); });

        legend.append("text")
            .attr("x", dimensions.width - dimensions.margin.left - dimensions.margin.right - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function (d) { return map_size_emp(d.size_emp) + " enterprises"; });

        // add dots on the areas
        source.selectAll(".dot")
            .data(function (d) { return d.values.map(function (d) { d.size_emp = this.size_emp; return d; }, d); })
            .enter().append("circle")
            .attr("class", function (d) { return "dot " + map_size_emp(d.size_emp).toLowerCase().replace(/\s/g, '') })
            .attr("cx", function (d) { return x(d.TIME_PERIOD); })
            .attr("cy", function (d) { return y(d.OBS_VALUE); })
            .attr("r", 2)
            .style("fill", function (d) { return getColor(map_size_emp_to_number(d.size_emp)); })
            .style("stroke", "white")
            .style("stroke-width", 0.5)
            .style("stroke-opacity", 0.5)
            .style("fill-opacity", 1)
            .on("mouseover", function (event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("r", 5);
                setTooltipContent(`<p>Enterprises size: <b>${map_size_emp(d.size_emp)}</b><br />Percentage: <b>${d.OBS_VALUE}%</b></p>`);
                setTooltipPosition({ x: event.pageX, y: event.pageY })
                setTooltipVisible(true)
            })
            .on("mouseout", function (event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("r", 2);
                setTooltipVisible(false)
            });

        setLoading(false);
    }, [selectedGeo, indic_is]);

    return (
        <>
            <div className='w-screen mt-24 mb-64 plotsection'>
                <h1 className='plottitle'>The Role of E-commerce in Business</h1>
                <p className='plotintro'> This area chart illustrating the growth of e-commerce sales in enterprises over the past years. <br /> Each area rappresents a different size for a company (Micro, Small, Small and medium-sized, Large), we can also opt for a wide range of types of online sales. So we can see the trend of e-commerce sales for each size of company.</p>
                <div className='flex-col justify-center items-center w-full h-full mb-10 mt-1' style={{ display: loading ? 'none' : 'flex' }}>
                    <NationSelector nationsList={nationList} currentNation={selectedGeo} setCurrentNation={setSelectedGeo} />
                    <div className="mt-4">
                        <h2 className="text-xl font-semibold">
                            Percentage of <span className="underline underline-offset-4 font-bold">{map_code_to_description(indic_is)}</span> by size of enterprise in <span className="underline underline-offset-4 font-bold">{mapstate(selectedGeo)}</span>
                        </h2>
                    </div>
                    <div ref={ref} className='w-fit flex items-center justify-center'></div>
                    <div className="mt-6 flex overflow-hidden bg-white border divide-x rounded-lg rtl:flex-row-reverse">
                        {
                            indic_isList.map((indic_is_iterator, index) => (
                                <button key={index} onClick={() => setIndicIs(indic_is_iterator)} onMouseEnter={(e) => { setTooltipVisible(true); setTooltipContent(`<p>${map_code_to_description(indic_is_iterator)}</p>`); setTooltipPosition({ x: e.pageX, y: e.pageY }) }} onMouseLeave={() => setTooltipVisible(false)} className={`px-4 py-2 text-sm font-medium transition-colors duration-200 hover:bg-[#386aa3] hover:text-white ${indic_is_iterator === indic_is ? 'bg-[#386aa3] text-white' : 'text-gray-600'}`}>{indic_is_iterator}</button>
                            ))
                        }
                    </div>
                </div>
                {loading && <Loader />}
                <Tooltip
                    content={<div dangerouslySetInnerHTML={{ __html: tooltipContent }} />}
                    isVisible={tooltipVisible}
                    style={{
                        left: tooltipPosition.x,
                        top: tooltipPosition.y,
                    }}
                    className={'text-center'}
                />
                <p className='plotexpl'>Looking the plot, is clear that the largest companies own the largest share of the online market. But without such a clear gap from smaller companies, though. Obviously these data are about Europe and therefore do not take into account the large U.S. and Chinese companies</p>
                <div className='w-full flex flex-col items-center justify-center'>
                    <div className={`${showDataPreparation ? 'h-[100px]' : 'h-0'} overflow-hidden transition-[height] duration-1000 ease-in-out`}>
                        <p id='explain-1' className='w-[80%] text-left mx-auto'>
                            For this chart, we used this <a href="https://doi.org/10.2908/ISOC_EC_ESELS" className='underline underline-offset-4 cursor-pointer'>dataset</a>  produced, as always, by eurostat. We modified it to get a <code>.json</code> file.<br />
                            After do that, we have to prepare the data in order to have as the external key the size of the company and as the internal key the year, with the value of the percentage of e-commerce sales. Obviously we have to filter the data for the country we want to analyze and for the type of online sales.
                        </p>
                    </div>
                    <p className='underline underline-offset-4 cursor-pointer' onClick={() => setShowDataPreparation(!showDataPreparation)}>{showDataPreparation ? "Hide data preparation" : "Show data preparation"}</p>
                </div>
            </div>
        </>
    );
}
export default AreaChart;
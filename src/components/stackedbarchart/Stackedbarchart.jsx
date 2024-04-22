import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import Loader from '../Loader';
import dataFile from '../../data/stackedBar3.json';
import { colorScheme, getColor } from '../Config';
import Tooltip from '../Tooltip';
import { mapstate, mapvalue, mapindtype, map_size_emp, map_size_indic_is_ai_to_number, map_size_indic_is_ai } from '../MapState';
import NationSelector from '../NationSelector';

function processData(data, indic_list) {
    var processedData = [];
    var time_period_set = new Set(data.map(d => d.TIME_PERIOD));
    time_period_set.forEach(time_period => {
        var obj = {
            TIME_PERIOD: time_period
        };
        // sum OBS_VALUE
        var sum = 100;
        indic_list.forEach(indic => {
            var value = data.filter(d => d.TIME_PERIOD === time_period && d.indic_is === indic);
            if (value.length === 0) {
                obj[indic] = 0;
                return;
            }
            obj[indic] = value[0].OBS_VALUE / sum * 100;
        });
        processedData.push(obj);
    });
    return processedData;
}

function StackedBarChart() {

    const ref = useRef()
    const [loading, setLoading] = useState(true)
    const [dimensions, setDimensions] = useState({
        width: 1000,
        height: 500,
        margin: { top: 50, right: 150, bottom: 50, left: 150 },
    });

    const [size_emp, setSize_emp] = useState('0-9');
    const [nationList, setNationList] = useState([...new Set(dataFile.map(d => d.geo))]);
    const [size_empList, setSizeEmpList] = useState([]);
    const [selectedGeo, setSelectedGeo] = useState("ES");

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

        var defs = svg.append("defs");

        var filter = defs.append("filter")
            .attr("id", "barsshadow")
            .attr("height", "130%");

        filter.append("feGaussianBlur")
            .attr("in", "SourceAlpha")
            .attr("stdDeviation", 3)
            .attr("result", "blur");

        var feOffset = filter.append("feOffset")
            .attr("dx", 2)
            .attr("dy", -2)
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

        var data = dataFile.filter(d => d.geo === selectedGeo);
        setSizeEmpList([...new Set(data.map(d => d.size_emp))]);
        data = data.filter(d => d.size_emp === size_emp);

        var indic_is_set_list = [...new Set(data.map(d => d.indic_is))];

        var processedData = processData(data, indic_is_set_list);

        const x = d3.scaleBand()
            .domain(dataFile.map(d => d.TIME_PERIOD).sort())
            .range([0, dimensions.width - dimensions.margin.left - dimensions.margin.right])
            .padding(0.1);

        var max_value = 0;
        processedData.forEach(d => {
            var sum = 0;
            indic_is_set_list.forEach(indic => {
            sum += d[indic];
            });
            if (sum > max_value) {
            max_value = sum;
            }
        });

        if (max_value > 100) {
            max_value = 100;
        }
        // add a bar that reach the max value called "no_data"
        processedData.forEach(d => {
            var sum = 0;
            var max_indic = '';
            var max_tmp_value = 0;
            indic_is_set_list.forEach(indic => {
                sum += d[indic];
                if (d[indic] > max_tmp_value) {
                    max_tmp_value = d[indic];
                    max_indic = indic;
                }
            });
            if (sum > max_value) { 
                if (max_indic===''){console.log("Merda")}else{d[max_indic]-=(sum-max_value);}}
            d.no_data = max_value - sum;
        });


        indic_is_set_list.push('no_data');

        const y = d3.scaleLinear()
            .domain([0, max_value])
            .range([dimensions.height - dimensions.margin.top - dimensions.margin.bottom, 0]);

        const xAxis = d3.axisBottom(x)
            .tickFormat(d3.format("d"))
            .tickSizeOuter(0);

        const yAxis = d3.axisLeft(y)
            .ticks(10)
            .tickFormat(d => d + '%'); // Add % sign to y-axis labels

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
            .style('font-size', '16px')
            .style("font-weight", "700");

        const stackedData = d3.stack()
            .keys(indic_is_set_list)
            (processedData)

        svg.append("g")
            .selectAll("g")
            .data(stackedData)
            .join("g")
            .attr("fill", (d) => map_size_indic_is_ai_to_number(d.key) != -1 ? getColor(map_size_indic_is_ai_to_number(d.key)) : "#ccc")
            .selectAll("rect")
            .data((d, key) => d.map(item => ({ key: d.key, ...item })))
            .join("rect")
            .attr("x", d => x(d.data.TIME_PERIOD))
            .attr("y", d => y(d[1]))
            .attr("height", d => y(d[0]) - y(d[1]))
            .attr("width", x.bandwidth())
            .attr("filter", "url(#barsshadow)") // Add shadow filter
            .on('mouseover', function (event, d) {
                setTooltipContent(`<div><p>${d.key != "no_data" ? "AI task: " + map_size_indic_is_ai(d.key) : "No data"}</p><p>${d.data[d.key].toFixed(2)}%</p></div>`);
                setTooltipVisible(true);
                setTooltipPosition({ x: event.pageX, y: event.pageY });
            })
            .on('mouseout', function () {
                setTooltipVisible(false);
            })

        setLoading(false)
    }, [selectedGeo, size_emp])

    return (
        <>
            <div className='w-screen mt-24 mb-64 plotsection'>
                <h1 className='plottitle'>Role of AI in the business</h1>
                <p className='plotintro'>One of the most well-known and discussed frontiers of digitalization in recent years is AI.<br /> Using a percentage stacked bar chart we are able to show the different use of AI in european's enterprises by its size.</p>
                <div className='flex-col justify-center items-center w-full h-full mb-10 mt-1' style={{ display: loading ? 'none' : 'flex' }}>
                    <NationSelector nationsList={nationList} currentNation={selectedGeo} setCurrentNation={setSelectedGeo} />
                    <div className="mt-7">
                        <h2 className="text-xl font-semibold">
                            Different AI task in <span className="underline underline-offset-4 font-bold">{map_size_emp(size_emp)}</span> enterprises in <span className="underline underline-offset-4 font-bold">{mapstate(selectedGeo)}</span> over the years
                        </h2>
                    </div>
                    <div ref={ref} className='w-fit flex items-center justify-center'></div>
                    <div className="mt-6 flex overflow-hidden bg-white border divide-x rounded-lg rtl:flex-row-reverse">
                        {
                            size_empList.map((size_emp_iterator, index) => (
                                <button key={index} onClick={() => setSize_emp(size_emp_iterator)} onMouseEnter={(e) => { setTooltipVisible(true); setTooltipContent(`<p>${map_size_emp(size_emp_iterator)} (${size_emp_iterator})</p>`); setTooltipPosition({ x: e.pageX, y: e.pageY }) }} onMouseLeave={() => setTooltipVisible(false)} className={`px-4 py-2 text-sm font-medium transition-colors duration-200 hover:bg-[#386aa3] hover:text-white ${size_emp_iterator === size_emp ? 'bg-[#386aa3] text-white' : 'text-gray-600'}`}>{map_size_emp(size_emp_iterator)}</button>
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
                <p className='plotexpl'>In the chart above, we clearly see how in past years despite the publicity AI has received it is still not used extensively by companies especially small ones. </p>
                <div className='w-full flex flex-col items-center justify-center'>
                    <div className={`${showDataPreparation ? 'h-[100px]' : 'h-0'} overflow-hidden transition-[height] duration-1000 ease-in-out`}>
                        <p id='explain-1' className='w-[80%] text-center mx-auto'>
                        For this graph we used, as always, a <a href="https://doi.org/10.2908/ISOC_EB_AI" className='underline underline-offset-4 cursor-pointer' >dataset</a> from Eurostat. <br /> We had to choose several Ai tasks from the many available to allow visualization also we eliminated many missing data which is why values for certain orders of magnitude of companies in certain countries are not present for example. Finally, we changed the format to .json.
                        </p>
                    </div>
                    <p className='underline underline-offset-4 cursor-pointer' onClick={() => setShowDataPreparation(!showDataPreparation)}>{showDataPreparation ? "Hide data preparation" : "Show data preparation"}</p>
                </div>
            </div>
        </>
    )
}

export default StackedBarChart;
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import dataFile from '../../data/Last_barchart.json';
import { getColor } from '../Config';
import { mapstate, map_size_emp, map_size_emp_to_number, map_code_to_description, map_sec_to_description } from '../MapState';
import NationSelector from "../NationSelector";
import Loader from "../Loader";
import Tooltip from "../Tooltip";

function BarChart() {
    const ref = useRef();
    const [loading, setLoading] = useState(true);
    const [dimensions, setDimensions] = useState({
        width: 1300,
        height: 600,
        margin: { top: 30, right: 50, bottom: 30, left: 50 },
    });

    const [selectedYear, setSelectedYear] = useState(2022);
    const [nationList, setNationList] = useState([...new Set(dataFile.map(d => d.geo))].filter(nation => nation !== 'UK'));
    const [year_list, setYear_list] = useState([]);
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
            .attr("viewBox", [0, 0, dimensions.width, dimensions.height])
            .attr("style", "max-width: 100%; height: auto;");

        var data = dataFile.filter(d => d.geo === selectedGeo && d.TIME_PERIOD === selectedYear);

        const fx = d3.scaleBand()
            .domain(new Set(data.map(d => d.indic_is)))
            .rangeRound([dimensions.margin.left, dimensions.width - dimensions.margin.right])
            .paddingInner(0.1);

        const size_emps = new Set(data.map(d => d.size_emp));

        const x = d3.scaleBand()
            .domain(size_emps)
            .rangeRound([0, fx.bandwidth()])
            .padding(0.05);

        const y = d3.scaleLinear()
            .domain([0, 100]).nice()
            .rangeRound([dimensions.height - dimensions.margin.bottom, dimensions.margin.top]);

        svg.append("g")
            .attr("transform", `translate(0,${dimensions.height - dimensions.margin.bottom})`)
            .call(d3.axisBottom(fx).tickSizeOuter(0))
            .selectAll("text")
            .style("font-size", "14px")
            .style("font-weight", "700")
            .text(d => map_sec_to_description(d))

        svg.append("g")
            .attr("transform", `translate(${dimensions.margin.left},0)`)
            .call(d3.axisLeft(y).ticks(null, "s").tickFormat(d => d + "%"))
            .selectAll("text")
            .style("font-size", "14px")
            .style("font-weight", "700")

        // gridlines in y axis function
        function make_y_gridlines() {
            return d3.axisLeft(y)
                .ticks(10)
        }

        // add the Y gridlines
        svg.append('g')
            .attr('transform', `translate(${dimensions.margin.left},0)`)
            .attr('class', 'grid')
            .call(make_y_gridlines()
                .tickSize(-dimensions.width + dimensions.margin.left + dimensions.margin.right)
                .tickFormat('')
            )
            .style('stroke-opacity', 0.1)
            .style('stroke-dasharray', '5,5')

        svg.append("g")
            .selectAll()
            .data(d3.group(data, d => d.indic_is))
            .join("g")
            .attr("transform", ([indic_is]) => `translate(${fx(indic_is)},0)`)
            .selectAll()
            .data(([, d]) => d)
            .join("rect")
            .attr("x", d => x(d.size_emp))
            .attr("y", d => y(d.OBS_VALUE))
            .attr("width", x.bandwidth())
            .attr("height", d => y(0) - y(d.OBS_VALUE))
            .attr("fill", d => getColor(map_size_emp_to_number(d.size_emp)))
            .style("filter", "url(#barsshadow)")
            .on('mouseover', function (event, d) {
                setTooltipContent(`<b>${map_sec_to_description(d.indic_is)}</b><br><b>${map_size_emp(d.size_emp)}</b>: ${d.OBS_VALUE}%`);
                setTooltipPosition({ x: event.pageX, y: event.pageY });
                setTooltipVisible(true);
            })
            .on('mouseout', () => { setTooltipVisible(false); });

        // add a legend
        var legend = svg.selectAll(".legend")
            .data(size_emps)
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) { return "translate(0," + (dimensions.margin.top + (i * 20)) + ")"; });

        // draw legend colored rectangles
        legend.append("rect")
            .attr("x", dimensions.width - dimensions.margin.right - 18) 
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", d => getColor(map_size_emp_to_number(d)))
            .style("filter", "url(#barsshadow)");

        // draw legend text
        legend.append("text")
            .attr("x", dimensions.width - dimensions.margin.right - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(d => map_size_emp(d))
            .style("font-size", "16px")
            .style("font-weight", "bold")

        setYear_list([...new Set(dataFile.map(d => d.TIME_PERIOD))].sort((a, b) => a - b));

        setLoading(false);
    }, [selectedGeo, selectedYear]);

    return (
        <>
            <div className='w-screen mt-24 !mb-14 plotsection'>
                <h1 className='plottitle'></h1>
                <p className='plotintro'></p>
                <div className='flex-col justify-center items-center w-full h-full mb-10 mt-1' style={{ display: loading ? 'none' : 'flex' }}>
                    <NationSelector nationsList={nationList} currentNation={selectedGeo} setCurrentNation={setSelectedGeo} />
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold">
                            Percentage of <span className="underline underline-offset-4 font-bold">{ }</span> by size of enterprise in <span className="underline underline-offset-4 font-bold">{mapstate(selectedGeo)}</span>
                        </h2>
                    </div>
                    <div ref={ref} className='w-fit flex items-center justify-center'></div>
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
                <p className='plotexpl'></p>
                <div className='w-full flex flex-col items-center justify-center'>
                    <div className={`${showDataPreparation ? 'h-[100px]' : 'h-0'} overflow-hidden transition-[height] duration-1000 ease-in-out`}>
                        <p id='explain-1' className='w-[80%] text-center mx-auto'>

                        </p>
                    </div>
                    <p className='underline underline-offset-4 cursor-pointer' onClick={() => setShowDataPreparation(!showDataPreparation)}>{showDataPreparation ? "Hide data preparation" : "Show data preparation"}</p>
                </div>
            </div>
        </>
    );
};

export default BarChart;

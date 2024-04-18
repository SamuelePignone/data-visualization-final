import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import dataFile from '../../data/transformed_data_by_geo.json';
import { getColor } from '../Config';
import { mapstate, map_size_emp, map_size_emp_to_number, map_code_to_description, map_size_indic_is_sec } from '../MapState';
import NationSelector from "../NationSelector";
import Loader from "../Loader";
import Tooltip from "../Tooltip";

function SpiderChart() {
    const ref = useRef();
    const [loading, setLoading] = useState(true);
    const [dimensions, setDimensions] = useState({
        width: 1000,
        height: 600,
        margin: { top: 200, right: 20, bottom: 0, left: 80 },
    });

    const [indic_is, setIndicIs] = useState('E_AESELL');
    const [nationList, setNationList] = useState([]);
    const [indic_isList, setIndicIsList] = useState([]);
    const [selectedGeo, setSelectedGeo] = useState("DE");

    const [showDataPreparation, setShowDataPreparation] = useState(false);

    const [tooltipContent, setTooltipContent] = useState('');
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

    var maxPoint = 100;

    const radialScale = d3.scaleLinear()
        .domain([0, maxPoint])
        .range([0, (dimensions.height - dimensions.margin.top - dimensions.margin.bottom) / 2]);

    function angleToCoordinate(angle, value) {
        let x = Math.cos(angle) * radialScale(value);
        let y = Math.sin(angle) * radialScale(value);
        return { "x": x, "y": y };
    }

    function getPathCoordinates(data_point, features) {
        let coordinates = [];
        for (var i = 0; i < features.length; i++) {
            let ft_name = features[i];
            let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
            var coord = angleToCoordinate(angle, data_point.values[ft_name]);
            coord.size_emp = data_point.key;
            coordinates.push(coord);
        }
        return coordinates;
    }

    useEffect(() => {
        const container = d3.select(ref.current);
        container.selectAll('svg').remove();

        const svg = container
            .append('svg')
            .style('margin', '0 auto')
            .attr('width', dimensions.width)
            .attr('height', dimensions.height)
            .append('g')
            //.attr('transform', `translate(${dimensions.margin.left}, ${dimensions.margin.top})`);
            .attr("transform", "translate(" + dimensions.width / 2 + "," + dimensions.height / 2 + ")");


        setNationList(Object.keys(dataFile));

        var features = dataFile[selectedGeo]['variables'].map(d => d.label);
        var data = dataFile[selectedGeo]['sets'];

        let ticks = [25, 50, 75, 100];

        ticks.forEach(t =>
            svg.append("circle")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("fill", "none")
                .attr("stroke", "white")
                .attr("stroke-width", "2")
                .attr("r", radialScale(t))
        );

        ticks.forEach(t =>
            svg.append("text")
                .attr("x", 0)
                .attr("y", - radialScale(t) - 5)
                .attr("fill", "white")
                .attr("text-anchor", "middle")
                .style("font-size", "15px")
                .style("font-weight", "bold")
                .text(t.toString())
        );

        // sort data by the area of the radar chart
        data.sort((a, b) => {
            return map_size_emp_to_number(b.key) - map_size_emp_to_number(a.key);
        });

        for (var i = 0; i < features.length; i++) {
            let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
            let line_coordinate = angleToCoordinate(angle, 100);
            let label_coordinate = angleToCoordinate(angle, 120);

            //draw axis label
            svg.append("text")
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "central")
                .attr("x", function(){
                    if (features[i] == "E_SECMSPSW") {
                        return label_coordinate.x + 80;
                    }
                    if (label_coordinate.x == 1.469576158976824e-14) {
                        return 0;
                    } else {
                        return label_coordinate.x < 0 ? label_coordinate.x - 50 : label_coordinate.x + 50
                    }
                })
                .attr("y", label_coordinate.y) // Adjust the y position to move the text up
                .attr("fill", "#333333")
                .text(map_size_indic_is_sec(features[i]))
                .style("font-size", "16px")
                .style("font-weight", "semibold");

            //draw axis line
            svg.append("line")
                .attr("x1", 0)
                .attr("y1", 0)
                .attr("x2", line_coordinate.x)
                .attr("y2", line_coordinate.y)
                .attr("stroke", "#e8e8e8")
                .attr("stroke-width", "2");
        }

        data.forEach(singledata => {

            const coords = getPathCoordinates(singledata, features);

            /*
            var lg = svg.append("defs").append("linearGradient")
                .attr("id", "mygrad")
                .attr("x1", "0%")
                .attr("x2", "0%")
                .attr("y1", "0%")
                .attr("y2", "100%");

            lg.append("stop")
                .attr("offset", "0%")
                .style("stop-color", "#ce6262")
                .style("stop-opacity", 0);

            lg.append("stop")
                .attr("offset", "100%")
                .style("stop-color", "#ce6262")
                .style("stop-opacity", 0.5);

            */

            svg.append("path")
                .datum([...coords])
                .attr("d", d3.line()
                    .curve(d3.curveCatmullRomClosed)
                    .x(d => d.x)
                    .y(d => d.y)
                )
                .attr("stroke-width", 4)
                .attr("stroke", d => getColor(map_size_emp_to_number(d[0].size_emp), 0, 100))
                .attr("stroke-opacity", 1)
                .attr("fill", function (d) {
                    return getColor(map_size_emp_to_number(d[0].size_emp), 0, 100);
                })
                .attr("fill-opacity", 0.7)
                .on("mouseover", (event, d) => {
                    setTooltipContent(`<p>${map_size_emp(d[0].size_emp)}</p>`);   
                    setTooltipPosition({ x: event.pageX, y: event.pageY });
                    setTooltipVisible(true);
                })
                .on("mouseout", () => {
                    setTooltipVisible(false);
                });

            coords.forEach(d => {
                svg.append("circle")
                    .attr("r", 6)
                    .attr("fill", getColor(map_size_emp_to_number(d.size_emp), 0, 100))
                    .attr("stroke", "white")
                    .attr("stroke-width", 1)
                    .attr("cx", d.x)
                    .attr("cy", d.y);
            });

            // sort data by the area of the radar chart
            data.sort((a, b) => {
                return map_size_emp_to_number(b.key) - map_size_emp_to_number(a.key);
            });

        });

        setLoading(false);
    }, [selectedGeo, indic_is]);

    return (
        <>
            <div className='w-screen mt-24 mb-64 plotsection'>
                <h1 className='plottitle'>The year of this chart is the 2019</h1>
                <p className='plotintro'></p>
                <div className='flex-col justify-center items-center w-full h-full mb-10 mt-1' style={{ display: loading ? 'none' : 'flex' }}>
                    <NationSelector nationsList={nationList} currentNation={selectedGeo} setCurrentNation={setSelectedGeo} />
                    <div className="mt-4">
                        <h2 className="text-xl font-semibold">
                            <span className="underline underline-offset-4 font-bold">{map_code_to_description(indic_is)}</span>  <span className="underline underline-offset-4 font-bold">{mapstate(selectedGeo)}</span>
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
}
export default SpiderChart;
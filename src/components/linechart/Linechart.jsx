import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import Loader from '../Loader';
import dataFile from '../../data/cleaned_line_chart.json';
import { colorScheme } from '../Config';
import Tooltip from '../Tooltip';
import { mapstate, mapvalue, mapindtype } from '../MapState';
import NationSelector from '../NationSelector';

function LineChart() {

    const ref = useRef()
    const [dimensions, setDimensions] = useState({
        width: 1000,
        height: 500,
        margin: { top: 50, right: 250, bottom: 50, left: 100 },
    });

    const [loading, setLoading] = useState(true)
    const [selectedGeo, setSelectedGeo] = useState("DE");
    const [nationList, setNationList] = useState([...new Set(dataFile.map(d => d.geo))]);
    const ind_type_list = [...new Set(dataFile.map(d => d.ind_type))];

    const [tooltipContent, setTooltipContent] = useState('');
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

    const max_value = 100

    useEffect(() => {
        const container = d3.select(ref.current)
        container.selectAll('svg').remove();

        const svg = container
            .append('svg')
            .style('margin', '0 auto')
            .attr('width', dimensions.width)
            .attr('height', dimensions.height)
            .append('g')
            .attr('transform', `translate(${dimensions.margin.left}, ${dimensions.margin.top})`);

        const x_domain = d3.extent(dataFile, d => d.time_period)

        const x = d3.scaleLinear()
            .domain(x_domain)
            .range([0, dimensions.width - dimensions.margin.left - dimensions.margin.right]);

        const y = d3.scaleLinear()
            .domain([0, max_value])
            .range([dimensions.height - dimensions.margin.top - dimensions.margin.bottom, 0]);

        const xAxis = d3.axisBottom(x)
            .ticks(x_domain[1] - x_domain[0])
            .tickFormat(d3.format("d"));

        const yAxis = d3.axisLeft(y)
            .ticks(10)

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

        ind_type_list.forEach((ind_type, i) => {
            svg.append('path')
                .datum(dataFile.filter(d => d.geo === selectedGeo && d.ind_type === ind_type))
                .attr('fill', 'none')
                .attr('class', 'line-' + i)
                .attr('stroke', colorScheme[i])
                .attr('stroke-width', 2)
                .attr('d', d3.line()
                    .x(d => x(d.time_period))
                    .y(d => y(d.obs_value))
                )
                .on('mouseover', (event, d) => {
                    setTooltipContent(`${mapindtype(ind_type)} in ${mapstate(selectedGeo)}`)
                    setTooltipPosition({ x: event.pageX, y: event.pageY })
                    setTooltipVisible(true)
                    ind_type_list.forEach((ind_type, j) => {
                        if (j !== i) {
                            svg.selectAll('.line-' + j)
                                .transition()
                                .duration(200)
                                .attr('stroke-opacity', 0.2)
                            svg.selectAll('.circle-' + j)
                                .transition()
                                .duration(200)
                                .attr('fill-opacity', 0.2)
                        }
                    })
                })
                .on('mouseout', () => {
                    setTooltipVisible(false)
                    // remove highlight
                    ind_type_list.forEach((ind_type, j) => {
                        svg.selectAll('.line-' + j)
                            .transition()
                            .duration(200)
                            .attr('stroke-opacity', 1)
                        svg.selectAll('.circle-' + j)
                            .transition()
                            .duration(200)
                            .attr('fill-opacity', 1)
                    })
                });

            svg.selectAll('myCircles')
                .data(dataFile.filter(d => d.geo === selectedGeo && d.ind_type === ind_type))
                .enter()
                .append('circle')
                .attr('class', 'circle-' + i)
                .attr('fill', colorScheme[i])
                .attr('stroke', 'none')
                .attr('cx', d => x(d.time_period))
                .attr('cy', d => y(d.obs_value))
                .attr('r', 3)
                .on('mouseover', (event, d) => {
                    setTooltipContent(`${mapindtype(d.ind_type)} in ${mapstate(d.geo)} (${d.time_period}):<br /> <strong>${mapvalue(d.obs_value)}</strong>`)
                    setTooltipPosition({ x: event.pageX, y: event.pageY })
                    setTooltipVisible(true)
                    // highlight the circle
                    d3.select(event.currentTarget)
                        .transition()
                        .duration(200)
                        .attr('r', 6)
                    ind_type_list.forEach((ind_type, j) => {
                        if (j !== i) {
                            svg.selectAll('.line-' + j)
                                .transition()
                                .duration(200)
                                .attr('stroke-opacity', 0.2)
                            svg.selectAll('.circle-' + j)
                                .transition()
                                .duration(200)
                                .attr('fill-opacity', 0.2)
                        }
                    })
                })
                .on('mouseout', () => {
                    setTooltipVisible(false)
                    // remove highlight
                    ind_type_list.forEach((ind_type, j) => {
                        svg.selectAll('.line-' + j)
                            .transition()
                            .duration(200)
                            .attr('stroke-opacity', 1)
                        svg.selectAll('.circle-' + j)
                            .transition()
                            .duration(200)
                            .attr('fill-opacity', 1)
                            .attr('r', 3)
                    })
                });
        });

        // add the legend
        const legend = svg.append('g')
            // middle of y-axis 
            .attr('transform', `translate(${dimensions.width - dimensions.margin.right - 70}, ${dimensions.height / 2 - 80})`);

        ind_type_list.forEach((ind_type, i) => {
            legend.append('rect')
                .attr('x', 0)
                .attr('y', i * 20)
                .attr('width', 10)
                .attr('height', 10)
                .attr('fill', colorScheme[i]);

            legend.append('text')
                .attr('x', 20)
                .attr('y', i * 20 + 10)
                .text(mapindtype(ind_type))
                .style('font-size', '12px')
                .style('font-weight', '700')
                .attr('alignment-baseline', 'middle')
                .on('mouseover', () => {
                    // reduce opacity of other lines
                    ind_type_list.forEach((ind_type, j) => {
                        if (j !== i) {
                            svg.selectAll('.line-' + j)
                                .transition()
                                .duration(200)
                                .attr('stroke-opacity', 0.2)
                            svg.selectAll('.circle-' + j)
                                .transition()
                                .duration(200)
                                .attr('fill-opacity', 0.2)
                        }
                    })
                })
                .on('mouseout', () => {
                    // reset opacity of other lines
                    ind_type_list.forEach((ind_type, j) => {
                        svg.selectAll('.line-' + j)
                            .transition()
                            .duration(200)
                            .attr('stroke-opacity', 1)
                        svg.selectAll('.circle-' + j)
                            .transition()
                            .duration(200)
                            .attr('fill-opacity', 1)
                    })
                })
        });

        setLoading(false)
    }, [selectedGeo])

    return (
        <>
            <div className='w-screen mt-24 mb-64'>
                {loading && <Loader />}
                <div className='flex-col justify-center items-center w-full h-full mb-10 mt-1' style={{ display: loading ? 'none' : 'flex' }}>
                    <NationSelector nationsList={nationList} currentNation={selectedGeo} setCurrentNation={setSelectedGeo} />
                    <div ref={ref} className='w-fit flex items-center justify-center mt-4'></div>
                </div>
                <Tooltip
                    content={<div dangerouslySetInnerHTML={{ __html: tooltipContent }} />}
                    isVisible={tooltipVisible}
                    style={{
                        left: tooltipPosition.x,
                        top: tooltipPosition.y,
                    }}
                    className={'text-center'}
                />
            </div>
        </>
    )
}

export default LineChart
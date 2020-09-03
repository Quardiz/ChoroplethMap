import React, {Component} from 'react';
import * as d3 from 'd3';
import {event as currentEvent} from 'd3';
import {data} from './data'
import europe_geo from './europe_geo.json'
import './choroplet.css';

export default class Chloroplet extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.drawChart();
    }

    drawChart() {
        const w = 1000;
        const h = 900;

        const immigration_numbers = data.reduce((prev,curr) => {prev[curr[0]]=curr[1];return prev;},{});

        // Map and projection
        var path = d3.geoPath();
        var projection = d3.geoMercator()
                            .scale(700)
                            .center([0,20])
                            .translate([w / 2 -100, h+220]);

        // Data and color scale
        var colorScale = d3.scaleLinear()
            .domain([d3.min(data, d => parseInt(d[1].replace(',', ''))), d3.max(data, d => parseInt(d[1].replace(',', '')))])
            .range(["lightblue", "darkblue"]);

        const svg = d3.select(this.refs.chartHolder)
                        .append("svg")
                        .attr("height", h)
                        .attr("width", w);

        const immigrationHelper = function(d){
            if(d.properties.geounit in immigration_numbers){
                return immigration_numbers[d.properties.geounit];
            } else {
                return "unknown.";
            }
        };

        svg.append("text")
            .attr("x", w/2-250)
            .attr("y", 50)
            .attr("font-size", 30)
            .text("Immigration from non-EU countries to Europe 2018")

        svg.append("g")
        .selectAll("path")
        .data(europe_geo.features)
        .enter()
        .append("path")
            // draw each country
            .attr("d", d3.geoPath()
                .projection(projection)
            )
            // set the color of each country
            .attr("fill", function (d) {
                if(d.properties.geounit in immigration_numbers){
                    let temp = parseInt(immigration_numbers[d.properties.geounit].replace(',',''));
                    return colorScale(temp);
                } else {
                    return "gray";
                }
            })
            .append("title")
            .text(d => `${d.properties.geounit}: ${immigrationHelper(d)}`);
        
        const legendWidth = 400;
        const rectHeight = 30;
        const legendSteps = 8;
        const rectWidth = Math.ceil(legendWidth / (legendSteps-1));
        const legendScale = d3.scaleLinear()
            .domain([100000, legendSteps*100000])
            .range([0, legendWidth]);
        const legendAxis = d3.axisBottom(legendScale)
            .ticks(8);
        const legendData = [...Array(legendSteps).keys()].map(i => (i+1)*100000);

        svg.append("g")
            .attr("transform", `translate(${w/10}, ${200})`)
            .call(legendAxis)
            .selectAll("rect")
            .data(legendData)
            .enter()
                .append("rect")
                .attr("x", d => legendScale(d)-rectWidth/2)
                .attr("y", -rectHeight)
                .attr("width", rectWidth)
                .attr("height", rectHeight)
                .attr("fill", d => colorScale(d))
                .attr("transform", `translate(${0}, ${1})`);
    }

    render() {
        return <div id="holder" ref="chartHolder">
            <p>Source: <a target="_blank" href="https://ec.europa.eu/eurostat">https://ec.europa.eu/eurostat</a></p>
        </div>;
    }
}
// components/partograph/FetalHeartRateChart.js
import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const FetalHeartRateChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Parse time if needed
    const parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%S");
    const formattedData = data.map(d => ({
      time: d.record_time ? new Date(d.record_time) : new Date(),
      rate: +d.fetal_heart_rate,
    }));

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // clear previous render

    const g = svg
      .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Scales
    const x = d3
      .scaleTime()
      .domain(d3.extent(formattedData, d => d.time))
      .range([0, width]);

    const y = d3.scaleLinear().domain([80, 200]).nice().range([height, 0]);

    // Axes
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d3.timeFormat("%H:%M")));

    g.append("g").call(d3.axisLeft(y));

    // Normal band (110–160 bpm)
    g.append("rect")
      .attr("x", 0)
      .attr("y", y(160))
      .attr("width", width)
      .attr("height", y(110) - y(160))
      .attr("fill", "#d1fae5"); // light green

    // Line generator
    const line = d3
      .line()
      .x(d => x(d.time))
      .y(d => y(d.rate))
      .curve(d3.curveMonotoneX);

    // Line path
    g.append("path")
      .datum(formattedData)
      .attr("fill", "none")
      .attr("stroke", "#2563eb") // blue
      .attr("stroke-width", 2)
      .attr("d", line);

    // Points
    g.selectAll("circle")
      .data(formattedData)
      .enter()
      .append("circle")
      .attr("cx", d => x(d.time))
      .attr("cy", d => y(d.rate))
      .attr("r", 4)
      .attr("fill", d => (d.rate < 110 || d.rate > 160 ? "#dc2626" : "#2563eb")); // red if abnormal
  }, [data]);

  return (
    <div className="p-4 bg-white rounded-2xl shadow-md">
      <h2 className="text-lg font-semibold mb-2">Fetal Heart Rate (bpm)</h2>
      <svg ref={svgRef} className="w-full h-[260px]" />
    </div>
  );
};

export default FetalHeartRateChart;

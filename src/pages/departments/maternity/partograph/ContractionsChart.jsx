// components/partograph/ContractionsChart.js
import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const ContractionsChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const formattedData = data.map(d => ({
      time: d.record_time ? new Date(d.record_time) : new Date(),
      frequency: +d.contractions_frequency,
      strength: d.contractions_strength || "Mild",
    }));

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg
      .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Scales
    const x = d3
      .scaleTime()
      .domain(d3.extent(formattedData, d => d.time))
      .range([0, width]);

    const y = d3.scaleLinear().domain([0, 6]).nice().range([height, 0]); // contractions per 10 min (max ~6)

    // Axes
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d3.timeFormat("%H:%M")));

    g.append("g").call(d3.axisLeft(y));

    // Strength color coding
    const strengthColor = {
      Mild: "#fde68a",     // light yellow
      Moderate: "#f59e0b", // orange
      Strong: "#dc2626",   // red
    };

    // Bars (rectangles for contractions)
    g.selectAll("rect")
      .data(formattedData)
      .enter()
      .append("rect")
      .attr("x", d => x(d.time) - 10)
      .attr("y", d => y(d.frequency))
      .attr("width", 20)
      .attr("height", d => height - y(d.frequency))
      .attr("fill", d => strengthColor[d.strength] || "#9ca3af")
      .attr("opacity", 0.8);

    // Labels (frequency value above bar)
    g.selectAll("text.label")
      .data(formattedData)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", d => x(d.time))
      .attr("y", d => y(d.frequency) - 5)
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("fill", "#374151")
      .text(d => d.frequency);
  }, [data]);

  return (
    <div className="p-4 bg-white rounded-2xl shadow-md">
      <h2 className="text-lg font-semibold mb-2">Uterine Contractions (per 10 min)</h2>
      <svg ref={svgRef} className="w-full h-[260px]" />
      <div className="flex justify-center gap-4 mt-2 text-sm">
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-300 inline-block"></span> Mild</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-orange-500 inline-block"></span> Moderate</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-600 inline-block"></span> Strong</span>
      </div>
    </div>
  );
};

export default ContractionsChart;

// components/maternity/PartographChart.js
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const PartographChart = ({ records = [] }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // clear before re-render

    const width = 700;
    const height = 450;
    const margin = { top: 30, right: 150, bottom: 50, left: 60 };

    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;

    // scales
    const xScale = d3.scaleLinear().domain([0, 12]).range([0, plotWidth]); // 12 hours
    const yScale = d3.scaleLinear().domain([0, 10]).range([plotHeight, 0]); // 0–10 cm

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // grid
    g.append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(yScale).tickSize(-plotWidth).tickFormat(""))
      .selectAll("line")
      .attr("stroke", "#eee");

    g.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${plotHeight})`)
      .call(d3.axisBottom(xScale).tickSize(-plotHeight).tickFormat(""))
      .selectAll("line")
      .attr("stroke", "#eee");

    // axes
    g.append("g").call(d3.axisLeft(yScale).ticks(10));
    g.append("g")
      .attr("transform", `translate(0,${plotHeight})`)
      .call(d3.axisBottom(xScale).ticks(12))
      .append("text")
      .attr("x", plotWidth / 2)
      .attr("y", 40)
      .attr("fill", "black")
      .attr("text-anchor", "middle")
      .text("Time (hours)");

    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -plotHeight / 2)
      .attr("y", -45)
      .attr("fill", "black")
      .attr("text-anchor", "middle")
      .text("Cervical Dilatation (cm)");

    // Alert line
    const lineGenerator = d3
      .line()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y));

    g.append("path")
      .datum([
        { x: 0, y: 4 },
        { x: 6, y: 10 },
      ])
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "4,2")
      .attr("d", lineGenerator);

    g.append("path")
      .datum([
        { x: 4, y: 4 },
        { x: 10, y: 10 },
      ])
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "4,2")
      .attr("d", lineGenerator);

    // Labels for lines
    g.append("text")
      .attr("x", xScale(2))
      .attr("y", yScale(7))
      .attr("fill", "blue")
      .attr("font-size", "12px")
      .text("Alert");

    g.append("text")
      .attr("x", xScale(6))
      .attr("y", yScale(7))
      .attr("fill", "red")
      .attr("font-size", "12px")
      .text("Action");

    // Tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("padding", "6px 10px")
      .style("background", "white")
      .style("border", "1px solid #ccc")
      .style("border-radius", "4px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("opacity", 0);

    // --- Data plotting ---
    // Prepare categories
    const datasets = [
      {
        key: "cervical_dilatation",
        color: "black",
        label: "Cervical Dilatation",
        shape: "circle",
      },
      {
        key: "descent_of_head",
        color: "green",
        label: "Descent of Head",
        shape: "triangle",
      },
      {
        key: "fhr",
        color: "orange",
        label: "Fetal Heart Rate",
        shape: "square",
      },
    ];

    // Draw points for each dataset
    datasets.forEach((dataset) => {
      const points = g
        .selectAll(`.${dataset.key}-point`)
        .data(records.filter((d) => d[dataset.key] !== undefined))
        .enter()
        .append("path")
        .attr("class", `${dataset.key}-point`)
        .attr("d", d3.symbol().type(
          dataset.shape === "circle"
            ? d3.symbolCircle
            : dataset.shape === "triangle"
            ? d3.symbolTriangle
            : d3.symbolSquare
        ).size(50))
        .attr("transform", (d, i) => `translate(${xScale(i)},${yScale(d[dataset.key])})`)
        .attr("fill", dataset.color)
        .on("mouseover", (event, d) => {
          tooltip
            .style("opacity", 1)
            .html(`${dataset.label}: ${d[dataset.key]}`)
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - 20 + "px");
        })
        .on("mouseout", () => {
          tooltip.style("opacity", 0);
        });

      dataset.points = points; // store for legend hover
    });

    // --- Legend ---
    const legend = svg
      .append("g")
      .attr("transform", `translate(${width - margin.right + 20},${margin.top})`);

    const legendItems = legend
      .selectAll(".legend-item")
      .data(datasets)
      .enter()
      .append("g")
      .attr("class", "legend-item")
      .attr("transform", (d, i) => `translate(0, ${i * 25})`)
      .style("cursor", "pointer")
      .on("mouseover", (event, d) => {
        d.points
          .transition()
          .attr("transform", (data, i) =>
            `translate(${xScale(i)},${yScale(data[d.key])}) scale(1.5)`
          )
          .attr("stroke", "black")
          .attr("stroke-width", 1.5);
      })
      .on("mouseout", (event, d) => {
        d.points
          .transition()
          .attr("transform", (data, i) =>
            `translate(${xScale(i)},${yScale(data[d.key])}) scale(1)`
          )
          .attr("stroke", "none");
      });

    legendItems
      .append("rect")
      .attr("width", 16)
      .attr("height", 16)
      .attr("fill", (d) => d.color);

    legendItems
      .append("text")
      .attr("x", 22)
      .attr("y", 12)
      .text((d) => d.label)
      .attr("font-size", "12px");
  }, [records]);

  return <div className="p-4 bg-white rounded-2xl shadow-md">
    <svg ref={svgRef}></svg>
  </div>;
};

export default PartographChart;

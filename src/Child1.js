import React, { Component } from "react";
import * as d3 from "d3";
import "./Child1.css";

class Child1 extends Component {
  componentDidUpdate() {
    const rawData = this.props.csv_data;

    if (!rawData || rawData.length === 0) return;

    const models = ["GPT-4", "Gemini", "PaLM-2", "Claude", "LLaMA-3.1"];
    const colorMap = {
      "GPT-4": "#e41a1c",
      "Gemini": "#377eb8",
      "PaLM-2": "#4daf4a",
      "Claude": "#984ea3",
      "LLaMA-3.1": "#ff7f00",
    };

    const data = rawData.map(d => ({
      Date: new Date(d.Date),
      "GPT-4": +d["GPT-4"],
      Gemini: +d.Gemini,
      "PaLM-2": +d["PaLM-2"],
      Claude: +d.Claude,
      "LLaMA-3.1": +d["LLaMA-3.1"],
    }));

    const stack = d3.stack()
      .keys(models)
      .order(d3.stackOrderReverse) // Ensure stack order matches legend
      .offset(d3.stackOffsetWiggle);

    const stackedData = stack(data);

    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 100, bottom: 20, left: 50 };

    const x = d3
      .scaleTime()
      .domain(d3.extent(data, d => d.Date))
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain([
        d3.min(stackedData, layer => d3.min(layer, d => d[0])) - 20,
        d3.max(stackedData, layer => d3.max(layer, d => d[1])),
      ])
      .range([height - margin.bottom, margin.top]);

    const svg = d3
      .select("#chart")
      .html("")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    // Draw areas with smooth curves
    svg
      .selectAll("path")
      .data(stackedData)
      .join("path")
      .attr(
        "d",
        d3
          .area()
          .curve(d3.curveCardinal)
          .x(d => x(d.data.Date))
          .y0(d => y(d[0]))
          .y1(d => y(d[1]))
      )
      .attr("fill", d => colorMap[d.key])
      .on("mouseover", (event, layer) => showTooltip(event, layer))
      .on("mousemove", (event) => moveTooltip(event))
      .on("mouseout", hideTooltip);

    // X-Axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(
        d3.axisBottom(x)
          .ticks(d3.timeMonth.every(1))
          .tickFormat(d3.timeFormat("%b"))
      );

    // Y-Axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    // Legend
    const legend = svg
      .append("g")
      .attr("transform", `translate(${width - 80}, ${margin.top})`);

    models.forEach((model, index) => {
      legend
        .append("circle")
        .attr("cx", 0)
        .attr("cy", index * 20)
        .attr("r", 5)
        .attr("fill", colorMap[model])
        .attr("stroke", "none");

      legend
        .append("text")
        .attr("x", 10)
        .attr("y", index * 20 + 5)
        .text(model)
        .style("font-size", "12px")
        .attr("alignment-baseline", "middle");
    });

    // Tooltip Handlers
    const tooltip = d3.select("#tooltip");

    function showTooltip(event, layer) {
      const model = layer.key;
      const modelData = data.map(d => ({ Date: d.Date, Value: d[model] }));

      tooltip.style("display", "block");

      // Render mini bar chart
      const tooltipWidth = 150;
      const tooltipHeight = 100;

      const xMini = d3
        .scaleBand()
        .domain(modelData.map(d => d.Date))
        .range([0, tooltipWidth])
        .padding(0.1);

      const yMini = d3
        .scaleLinear()
        .domain([0, d3.max(modelData, d => d.Value)])
        .range([tooltipHeight, 0]);

      tooltip.html(""); // Clear previous content

      const miniSvg = tooltip
        .append("svg")
        .attr("width", tooltipWidth)
        .attr("height", tooltipHeight);

      miniSvg
        .selectAll("rect")
        .data(modelData)
        .join("rect")
        .attr("x", d => xMini(d.Date))
        .attr("y", d => yMini(d.Value))
        .attr("width", xMini.bandwidth())
        .attr("height", d => tooltipHeight - yMini(d.Value))
        .attr("fill", colorMap[model]);

      miniSvg
        .append("g")
        .attr("transform", `translate(0,${tooltipHeight})`)
        .call(d3.axisBottom(xMini).tickFormat(d3.timeFormat("%b")));

      miniSvg.append("g").call(d3.axisLeft(yMini).ticks(5));
    }

    function moveTooltip(event) {
      const [mouseX, mouseY] = d3.pointer(event);
      tooltip
        .style("left", `${event.pageX + 15}px`)
        .style("top", `${event.pageY + 15}px`);
    }

    function hideTooltip() {
      tooltip.style("display", "none");
    }
  }

  render() {
    return (
      <div>
        <div id="chart" className="child1"></div>
        <div
          id="tooltip"
          style={{
            position: "absolute",
            pointerEvents: "none",
            backgroundColor: "white",
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "5px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            display: "none",
          }}
        ></div>
      </div>
    );
  }
}

export default Child1;

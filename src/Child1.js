import React, { Component } from "react";
import * as d3 from "d3";
import "./Child1.css";

class Child1 extends Component {
  state = { 
    company: "Apple", // Default Company
    selectedMonth: 'November' //Default Month
  };

  componentDidMount() {
    console.log(this.props.csv_data) // Use this data as default. When the user will upload data this props will provide you the updated data
  }

  componentDidUpdate() {
    const { company, selectedMonth } = this.state;
    const data = this.props.csv_data.filter(item => 
      item.Company === company && 
      item.Date.toLocaleString('default', { month: 'long' }) === selectedMonth
    );
  
    const svg = d3.select("#chart")
      .html("") 
      .append("svg")
      .attr("width", 800)
      .attr("height", 400);
  
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
  
    const x = d3.scaleTime()
      .domain(d3.extent(data, d => d.Date))
      .range([margin.left, width - margin.right]);
  
    const y = d3.scaleLinear()
      .domain([d3.min(data, d => Math.min(d.Open, d.Close)), 
               d3.max(data, d => Math.max(d.Open, d.Close))])
      .nice()
      .range([height - margin.bottom, margin.top]);
  
    const lineOpen = d3.line()
      .x(d => x(d.Date))
      .y(d => y(d.Open));
  
    const lineClose = d3.line()
      .x(d => x(d.Date))
      .y(d => y(d.Close));
  
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#b2df8a")
      .attr("d", lineOpen);
  
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#e41a1c")
      .attr("d", lineClose);
  
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(10));
  
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
    
      const tooltip = d3.select("#chart")
      .append("div")
      .style("position", "absolute")
      .style("background", "#fff")
      .style("border", "1px solid #ccc")
      .style("padding", "5px")
      .style("display", "none");
    
    data.forEach(d => {
      svg.append("circle")
        .attr("cx", x(d.Date))
        .attr("cy", y(d.Open))
        .attr("r", 4)
        .attr("fill", "#b2df8a")
        .on("mouseover", (event) => {
          tooltip.style("display", "block")
            .html(`
              <strong>Date:</strong> ${d.Date.toLocaleDateString()}<br/>
              <strong>Open:</strong> ${d.Open}<br/>
              <strong>Close:</strong> ${d.Close}<br/>
              <strong>Difference:</strong> ${(d.Close - d.Open).toFixed(2)}
            `)
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 20}px`);
        })
        .on("mouseout", () => tooltip.style("display", "none"));
    
      svg.append("circle")
        .attr("cx", x(d.Date))
        .attr("cy", y(d.Close))
        .attr("r", 4)
        .attr("fill", "#e41a1c")
        .on("mouseover", (event) => {
          tooltip.style("display", "block")
            .html(`
              <strong>Date:</strong> ${d.Date.toLocaleDateString()}<br/>
              <strong>Open:</strong> ${d.Open}<br/>
              <strong>Close:</strong> ${d.Close}<br/>
              <strong>Difference:</strong> ${(d.Close - d.Open).toFixed(2)}
            `)
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 20}px`);
        })
        .on("mouseout", () => tooltip.style("display", "none"));
      }); 
      
      const legend = svg.append("g")
      .attr("transform", `translate(${width},${margin.top})`);

      legend.append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", 5)
      .attr("fill", "#b2df8a");

      legend.append("text")
      .attr("x", 10)
      .attr("y", 5)
      .text("Open")
      .style("font-size", "12px")
      .attr("alignment-baseline", "middle");

      legend.append("circle")
      .attr("cx", 0)
      .attr("cy", 20)
      .attr("r", 5)
      .attr("fill", "#e41a1c");

      legend.append("text")
      .attr("x", 10)
      .attr("y", 25)
      .text("Close")
      .style("font-size", "12px")
      .attr("alignment-baseline", "middle");

  }  

  render() {
    const options = ['Apple', 'Microsoft', 'Amazon', 'Google', 'Meta'];
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
  
    return (
      <div className="child1">
        <div>
          <h3>Select a Company:</h3>
          {options.map(option => (
            <label key={option}>
              <input
                type="radio"
                name="company"
                value={option}
                checked={this.state.company === option}
                onChange={(e) => this.setState({ company: e.target.value })}
              />
              {option}
            </label>
          ))}
        </div>
  
        <div>
          <h3>Select a Month:</h3>
          <select
            value={this.state.selectedMonth}
            onChange={(e) => this.setState({ selectedMonth: e.target.value })}
          >
            {months.map(month => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
  
        <div id="chart"></div>
      </div>
    );
  }  
}

export default Child1;

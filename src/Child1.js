import React, { Component } from "react";
import * as d3 from "d3";
import "./App.css";

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

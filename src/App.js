import React, { Component } from "react";
import "./Child1.css";
import FileUpload from "./FileUpload";
import Child1 from "./Child1";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        { Date: "2024-11-02", "GPT-4": 120, Gemini: 30, "PaLM-2": 50, Claude: 40, "LLaMA-3.1": 70 },
        { Date: "2024-11-03", "GPT-4": 100, Gemini: 40, "PaLM-2": 60, Claude: 50, "LLaMA-3.1": 80 },
        { Date: "2024-11-04", "GPT-4": 90, Gemini: 20, "PaLM-2": 70, Claude: 30, "LLaMA-3.1": 90 },
        { Date: "2024-11-05", "GPT-4": 110, Gemini: 50, "PaLM-2": 40, Claude: 70, "LLaMA-3.1": 100 },
        { Date: "2024-11-06", "GPT-4": 130, Gemini: 60, "PaLM-2": 90, Claude: 80, "LLaMA-3.1": 120 },
        { Date: "2024-11-07", "GPT-4": 140, Gemini: 70, "PaLM-2": 100, Claude: 90, "LLaMA-3.1": 130 },
        { Date: "2024-11-08", "GPT-4": 150, Gemini: 80, "PaLM-2": 110, Claude: 100, "LLaMA-3.1": 140 },
      ],
    };
  }

  set_data = (csv_data) => {
    this.setState({ data: csv_data });
  };

  render() {
    return (
      <div>
        <FileUpload set_data={this.set_data} />
        <div className="parent">
          <Child1 csv_data={this.state.data} />
        </div>
      </div>
    );
  }
}

export default App;

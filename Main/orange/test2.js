import React from 'react';

class Counter extends React.Component {
  constructor() {
    super();
    this.state = {
      counter: 0,
    };
    this.handleIncrement = this.handleIncrement.bind(this);
  }

  handleIncrement() {
    this.setState({
      counter: (this.state.counter += 1),
    });
  }

  render() {
    return (
      <div>
        <div>{this.state.counter}</div>
        <hr />
        <button type="button" onClick={this.handleIncrement}>
          +
        </button>
      </div>
    );
  }
}

import React, { useState } from 'react';

function Counter() {
  const [counter, incrementCounter] = useState(0);

  function handleIncrement() {
    incrementCounter(counter + 1);
  }

  return (
    <div>
      <div>{counter}</div>
      <hr />
      <button type="button" onClick={handleIncrement}>
        +
      </button>
    </div>
  );
}

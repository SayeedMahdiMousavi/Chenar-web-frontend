import { Component } from 'react';

class PrintComponent extends Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    return this.props.children;
  }
}
export default PrintComponent;

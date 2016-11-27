/** @jsx h */
import { h, Component } from 'preact';

import createVisualization from './createVisualization';

import s from './Chart.css';

export default class SunburstChart extends Component {
  componentDidMount() {
    if (this.props.data) {
      this.createChart(this.props.data);
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  componentDidUpdate(prevProps) {
    if (this.props.data && this.props.data !== prevProps.data) {
      this.createChart(this.props.data);
    }
  }

  createChart(data) {
    var details = createVisualization({
      svgElement: this.node,
      data,
      onMouseOver: this.props.onMouseOver,
      onMouseLeave: this.props.onMouseLeave
    });
  }

  render() {
    return (
      <div className={s.svgContainer}>
        <svg
          preserveAspectRatio='xMidYMid meet'
          className={s.svgContentResponsive}
          ref={this.saveNode}
        />
      </div>
    );
  }

  saveNode = node => (this.node = node);
}

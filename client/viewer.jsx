/** @jsx h */
import { h, render } from 'preact';

import ModulesTreemap from './components/ModulesTreemap';
/* eslint no-unused-vars: "off" */
import styles from './viewer.css';

window.addEventListener('load', () => {
  render(
    <ModulesTreemap data={window.chartData} defaultSizes={window.defaultSizes}/>,
    document.getElementById('app')
  );
}, false);

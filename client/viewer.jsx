/** @jsx h */
import '@babel/polyfill';
import {h, render} from 'preact';

import {store} from './store';
import ModulesTreemap from './components/ModulesTreemap';
/* eslint no-unused-vars: "off" */
import styles from './viewer.css';

// Initializing WebSocket for live treemap updates
let ws;
try {
  ws = new WebSocket(`ws://${location.host}`);
} catch (err) {
  console.warn(
    "Couldn't connect to analyzer websocket server so you'll have to reload page manually to see updates in the treemap"
  );
}

window.addEventListener('load', () => {
  store.defaultSize = `${window.defaultSizes}Size`;
  store.allChunks = window.chartData;
  store.selectedChunks = store.allChunks;

  render(
    <ModulesTreemap/>,
    document.getElementById('app')
  );

  if (ws) {
    ws.addEventListener('message', event => {
      const msg = JSON.parse(event.data);

      if (msg.event === 'chartDataUpdated') {
        store.allChunks = msg.data;
      }
    });
  }
}, false);

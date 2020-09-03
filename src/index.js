import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Chloroplet from './components/choropleth_chart/choroplet'

ReactDOM.render(
  <React.StrictMode>
    <Chloroplet/>
  </React.StrictMode>,
  document.getElementById('root')
);

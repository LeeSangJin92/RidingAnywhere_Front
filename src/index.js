import React from 'react';
import ReactDOM from 'react-dom/client';
import './RidingAnywhere-client/css/index.css';
import RidingAnywhereApp from './RidingAnywhereApp';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <RidingAnywhereApp/>
  </BrowserRouter>
);

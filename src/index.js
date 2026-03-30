// src/index.js
// ─────────────────────────────────────────────────────────────
//  React entry point.
//  Wraps <App /> in the Redux <Provider> so every component
//  in the tree has access to the store.
// ─────────────────────────────────────────────────────────────

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* ──────────────────────────────────────────────────────
        Redux Provider: makes the store available to all
        child components via useSelector / useDispatch hooks.
       ────────────────────────────────────────────────────── */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

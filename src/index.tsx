import React from 'react';
import ReactDOM from 'react-dom';

import App from 'components/App';
import { printStorageUsage } from 'lib/utils';
import './index.css';

void printStorageUsage();

ReactDOM.render(<App />, document.querySelector('#root'));

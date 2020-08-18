import React from 'react';
import ReactDOM from 'react-dom';

import App from 'components/App';
import {printStorageUsage, sendBeacon} from 'lib/utils';
import './index.css';

void printStorageUsage();
sendBeacon();

ReactDOM.render(<App />, document.querySelector('#root'));

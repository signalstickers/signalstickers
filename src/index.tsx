import React from 'react';
import ReactDOM from 'react-dom';

import App from 'components/App';
import {printStorageUsage} from 'lib/utils';
import './index.css';

printStorageUsage(); // tslint:disable-line no-floating-promises
ReactDOM.render(<App />, document.getElementById('root'));

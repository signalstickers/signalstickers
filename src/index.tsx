import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/index.esm';
import 'etc/global-styles.css';

import { render } from '@darkobits/tsx/lib/runtime';

import App from 'components/App';
import { printStorageUsage } from 'lib/utils';

void printStorageUsage();

render('#root', <App />);

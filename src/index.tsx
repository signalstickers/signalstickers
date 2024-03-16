import { render } from '@darkobits/tsx/lib/runtime';

import App from 'components/App';
import { printStorageUsage } from 'lib/utils';
// import './index.css';
import 'etc/global-styles.css';

void printStorageUsage();

render('#root', <App />);

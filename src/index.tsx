import 'bootstrap/dist/css/bootstrap.min.css';
import 'etc/global-styles.css';

import '@fontsource/montserrat';
import 'bootstrap/js/index.esm';
import '@popperjs/core';

import { render } from '@darkobits/tsx/lib/runtime';

import App from 'components/App';
import { printStorageUsage } from 'lib/utils';

console.debug('🔖 •', import.meta.env.GIT_DESC);

void printStorageUsage();

render('#root', <App />);

import { PLUGIN_ID } from '../pluginId';

import config from './config';

const reducers = {
  [`${PLUGIN_ID}_config`]: config,
};

export default reducers;

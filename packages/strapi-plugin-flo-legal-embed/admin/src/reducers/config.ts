import { produce } from 'immer';
import type { Action } from 'redux';

import { RESOLVE_CONFIG } from '../constants';
import type { Config, FloLegalCheck } from '../types';
export interface PluginConfigState {
  isLoading: boolean;
  config: Config | null;
  checks: FloLegalCheck[];
}

interface ResolveConfigAction extends Action<typeof RESOLVE_CONFIG> {
  data: { config: Config; checks: FloLegalCheck[] } | null;
}

type KnownAction = ResolveConfigAction | Action;

const initialState: PluginConfigState = {
  isLoading: true,
  config: null,
  checks: [],
};

const configReducer = produce(
  // eslint-disable-next-line consistent-return
  (state: PluginConfigState = initialState, action: KnownAction) => {
    switch (action.type) {
      case RESOLVE_CONFIG: {
        const { data } = action as ResolveConfigAction;
        state.isLoading = false;
        state.config = data?.config ?? null;
        state.checks = data?.checks ?? [];
        break;
      }

      default:
        return state;
    }
  },
);

export default configReducer;

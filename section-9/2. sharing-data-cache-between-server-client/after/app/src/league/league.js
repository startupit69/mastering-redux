import produce from 'immer';
import { createAction } from 'redux-actions';
import { handle } from 'redux-pack';
import { ADD_TEAM } from 'src/team/team';
import reducerRegistry from 'src/reducerRegistry';
import API from 'src/api.service';

const reducerName = 'league';

export const GET_LEAGUE_DATA = `mastering-redux/${reducerName}/GET_LEAGUE_DATA`;
export const SET_ACTIVE_LEAGUE = `mastering-redux/${reducerName}/SET_ACTIVE_LEAGUE`;
export const UPDATE_LEAGUE_NAME = `mastering-redux/${reducerName}/UPDATE_LEAGUE_NAME`;

export const initialState = {
  active: 1,
  loading: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_LEAGUE_DATA: {
      return handle(state, action, {
        start: s =>
          produce(s, draft => {
            draft.loading = true;
          }),
        finish: s =>
          produce(s, draft => {
            draft.loading = false;
          })
      });
    }
    case SET_ACTIVE_LEAGUE: {
      return produce(state, draft => {
        draft.active = action.payload;
      });
    }
    case ADD_TEAM: {
      return handle(state, action, {
        success: s =>
          produce(s, draft => {
            const team = action.payload;
            draft.active = team.leagueId;
          })
      });
    }
    default:
      return state;
  }
}

reducerRegistry.register(reducerName, reducer);

export const setActiveLeague = createAction(
  SET_ACTIVE_LEAGUE,
  league => league.id
);
export const updateLeagueName = createAction(
  UPDATE_LEAGUE_NAME,
  (name, leagueId) => ({ name, leagueId })
);

// packs

export const getLeagueData = (onSuccess, onError, cache) => ({
  type: GET_LEAGUE_DATA,
  promise: API('leagues', undefined, cache),
  meta: {
    onSuccess,
    onError
  }
});

// data-fetching thunks
export const getLeagueDataThunk = (dispatch, getState, { extra }) =>
  new Promise((resolve, reject) =>
    dispatch(getLeagueData(resolve, reject, extra.cache))
  );

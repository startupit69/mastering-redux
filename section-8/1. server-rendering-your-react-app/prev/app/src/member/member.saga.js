import { put, select, all, fork, call, takeEvery } from 'redux-saga/effects';
import { getInfoDetails, getInfoEntityDataItem } from 'selectors';
import { setMemberWithDetailsEntry } from 'member/member';
import API from 'api.service';

const ENTITIES_WITH_DETAILS = ['member'];

export function* onNavigationToInfo(action) {
  const { level, id } = action.payload;
  let entityItem = yield select(getInfoEntityDataItem);
  if (ENTITIES_WITH_DETAILS.includes(level)) {
    if (!entityItem) {
      entityItem = yield call(API, `${level}s/${id}`);
    }
    const entry = yield select(getInfoDetails);
    if (entry === null) {
      const details = yield call(API, 'details');
      const action = {
        member: setMemberWithDetailsEntry
      }[level];
      yield put(action({ entity: entityItem, details }));
    }
  }
}

function* fetchDetailsOnNavigationToInfo() {
  yield takeEvery('INFO_ROUTE', onNavigationToInfo);
}

export default function* memberSaga() {
  const sagas = [
    fetchDetailsOnNavigationToInfo
  ];
  yield all(sagas.map(saga => fork(saga)));
}

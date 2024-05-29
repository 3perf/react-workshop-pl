import { reduxBatch } from "@manaflair/redux-batch";
import { createStore, applyMiddleware, compose } from "redux";
import {
  useSelector as useReduxSelector,
  TypedUseSelectorHook,
} from "react-redux";
import appReducer, { AppState } from "./reducers";
import createSagaMiddleware from "redux-saga";
import { rootSaga } from "sagas";
import * as Sentry from "@sentry/react";
import { ReduxActionTypes } from "constants/ReduxActionConstants";

const sagaMiddleware = createSagaMiddleware();
const sentryReduxEnhancer = Sentry.createReduxEnhancer({
  actionTransformer: (action) => {
    if (
      action.type === ReduxActionTypes.SET_EVALUATED_TREE ||
      action.type === ReduxActionTypes.EXECUTE_API_ACTION_SUCCESS
    ) {
      // Return null to not log the action to Sentry
      action.payload = null;
    }
    return action;
  },
});

const composeEnhancers =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export default createStore(
  appReducer,
  composeEnhancers(
    reduxBatch,
    applyMiddleware(sagaMiddleware),
    reduxBatch,
    sentryReduxEnhancer,
  ),
);
sagaMiddleware.run(rootSaga);

export const useSelector: TypedUseSelectorHook<AppState> = useReduxSelector;

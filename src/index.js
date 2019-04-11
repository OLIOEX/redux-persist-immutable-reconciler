// @flow
import { fromJS, Iterable } from "immutable";

const autoMergeImmutable = (
  inboundState: any,
  originalState: any,
  reducedState: any,
  { debug }: { debug: boolean }
): any => {
  let newState = { ...reducedState };
  if (true === objectExists(inboundState)) {
    Object.keys(inboundState).forEach(key => {
      if (key === "_persist") return;
      if (
        true === reducerModifiesState(originalState[key], reducedState[key])
      ) {
        log(
          `redux-persist/stateReconciler: sub state for key '${key}' \
           modified, skipping.`,
          debug
        );
        return;
      }
      newState[key] = rehydrate(key, inboundState, reducedState, newState);
    });
    log(
      `redux-persist/stateReconciler: rehydrated keys '${Object.keys(
        inboundState
      ).join(", ")}'`,
      debug
    );
  }
  return newState;
};

const rehydrate = (
  key: string,
  inboundState: any,
  reducedState: any,
  newState: any
) => {
  if (Iterable.isIterable(reducedState[key])) {
    return deepMerge(key, inboundState, newState);
  }
  return inboundState[key];
};

const reducerModifiesState = (originalStateKey: any, reducedStateKey: any) =>
  originalStateKey !== reducedStateKey;

const deepMerge = (key: string, inboundState: any, newState: any) => {
  const inboundKey = Iterable.isIterable(inboundState[key])
    ? inboundState[key]
    : fromJS(inboundState[key]);
  return newState[key].mergeDeep(inboundKey);
};

const objectExists = (state: any) => state && "object" === typeof state;

const log = (message: string, debug: boolean) => {
  if (process.env.NODE_ENV !== "production" && debug) {
    console.log(message);
  }
};

export default autoMergeImmutable;

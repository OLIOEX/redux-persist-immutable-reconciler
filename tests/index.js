// @flow
import autoMergeImmutable from "../src/index.js";
import { fromJS } from "immutable";

describe("autoMergeImmutable", () => {
  let debug;
  let state;
  const id = 1000;
  beforeEach(() => {
    state = {
      users: fromJS({
        data: { [id]: { id } },
        settings: {
          filters: { current: { filter1: false, filter2: 1, filter3: 25 } }
        }
      })
    };
    debug = { debug: false };
  });

  it("does not rehydrate if inbound state is empty", () => {
    const inboundState = null;
    const originalState = state;
    const reducedState = state;
    expect(
      autoMergeImmutable(inboundState, originalState, reducedState, debug)
    ).toEqual(originalState);
  });

  it("does not rehydrate if reducer modifies state", () => {
    const originalState = state;
    const inboundState = {
      users: fromJS({
        data: { [id]: { id, first_name: "John" } },
        settings: { filters: {} }
      })
    };
    const reducedState = {
      users: fromJS({
        data: { [id]: { id, first_name: "Tom" } },
        settings: { filters: {} },
        other: {}
      })
    };
    expect(
      autoMergeImmutable(inboundState, originalState, reducedState, debug)
    ).toEqual(reducedState);
  });

  it("rehydrates deep state property as object", () => {
    const originalState = state;
    const reducedState = state;
    const inboundState = {
      users: {
        settings: {
          filters: { current: { filter1: true, filter2: 2, filter3: 10 } }
        }
      }
    };
    expect(
      autoMergeImmutable(inboundState, originalState, reducedState, debug)
    ).toEqual({
      users: fromJS({
        data: { [id]: { id } },
        settings: {
          filters: { current: { filter1: true, filter2: 2, filter3: 10 } }
        }
      })
    });
  });

  it("rehydrates deep state property as immutable", () => {
    const originalState = state;
    const reducedState = state;
    const inboundState = {
      users: fromJS({
        settings: {
          filters: { current: { filter1: true, filter2: 2, filter3: 10 } }
        }
      })
    };
    expect(
      autoMergeImmutable(inboundState, originalState, reducedState, debug)
    ).toEqual({
      users: fromJS({
        data: { [id]: { id } },
        settings: {
          filters: { current: { filter1: true, filter2: 2, filter3: 10 } }
        }
      })
    });
  });
});

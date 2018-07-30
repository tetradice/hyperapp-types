import { ParamType, WiredActions } from "@hyperapp/types";

interface MyState {
  count: number;
}

const state: MyState = {
  count: 0
};

const actionImplements = {
  down:     (value: number) => (state: MyState, actions: MyActions) => ({ count: state.count - value }),
  up:       (value: number) => (state: MyState) => ({ count: state.count + value }),
  reset:    () => ({ count: 0 }),
  getState: () => (state: MyState) => (state)
};

type MyActions = WiredActions<MyState, (typeof actionImplements)>; // generate type of wired actions from `actionImplements`


const view1 = (state: MyState, actions: MyActions) => {
  // Get parameter type from actions
  type paramType = ParamType<typeof actions.down>; // paramType is number
  // or
  // type paramType = ParamType<MyActions['down']>;
  // type paramType = ParamType<typeof actionImplements.down>;

  // If an action hasn't any parameter, you will get never type of TypeScript.
  type resetParamType = ParamType<typeof actions.reset>; // resetParamType is never
};

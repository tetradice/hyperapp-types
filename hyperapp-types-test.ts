// test code for dtslint
// https://github.com/Microsoft/dtslint

import { WiredActions, ParamType } from "hyperapp-types";
import { app, h } from "hyperapp";

interface MyState {
  count: number;
  tag: {
      label: string;
  };
}

const state: MyState = {
  count: 0,
  tag: {
      label: '&'
  }
};

// Basic
{
  const actions = {
    act1:  ()              => ({ count: 1 }),
    act2:  (value: number) => ({ count: value }),
    act2o: (value?: number) => ({ count: value }),
    act3:  ()              => (state: MyState, actions: MyActions) => ({ count: state.count - 1 }),
    act4:  (value: number) => (state: MyState, actions: MyActions) => ({ count: state.count - value }),
    act4o: (value?: number) => (state: MyState, actions: MyActions) => ({ count: state.count - value }),
    getState: ()          => (state: MyState) => (state),
    tag: {
      setLabel: (value: string) => ({ label: value }),
      get: () => (state: MyState['tag']) => (state),
    }
  };
  type MyActions = WiredActions<MyState, (typeof actions)>;
  const testView = (st: MyState, acts: MyActions) => (h('div'));
  const wiredActions: MyActions = app(state, actions, testView, null);

  const func = (actions: MyActions) => {
    const t1: Partial<MyState> = actions.act1();
    const t2: Partial<MyState> = actions.act2(1);
    const t2o: Partial<MyState> = actions.act2(1);
    const t3: Partial<MyState> = actions.act3();
    const t4: Partial<MyState> = actions.act4(1);
    const t4o: Partial<MyState> = actions.act4(1);
    const st: MyState = actions.getState();
    const t5: Partial<MyState['tag']> = actions.tag.setLabel('abc');
    const st2: MyState['tag'] = actions.tag.get();
  };
}

// Invalid action implements
{
  // invalid action type
  const actions = {
    act1: ()              => ({ count: state.count - 1 }),
    act2: (value: number) => (state: MyState, actions: number) => ({ count: state.count - value })
  };
  type MyActions = WiredActions<MyState, (typeof actions)>; // $ExpectError
}
{
  // invalid state type
  const actions = {
    act1: (value: number) => (state: {count: string}, actions: MyActions) => ({ count: state.count })
  };
  type MyActions = WiredActions<MyState, (typeof actions)>; // $ExpectError
}
{
  // multiple parameters
  const actions = {
    act1: (value: number, value2: number) => (state: MyState, actions: MyActions) => ({ count: state.count })
  };
  type MyActions = WiredActions<MyState, (typeof actions)>; // $ExpectError
}

// ParamType
{
  const actions = {
    act1: ()              => ({ count: state.count - 1 }),
    act2: (value: number) => (state: MyState, actions: MyActions) => ({ count: state.count - value }),
    act3: ()              => (state: MyState, actions: MyActions) => ({ count: state.count - 1 }),
    act4: (value: number) => (state: MyState, actions: MyActions) => ({ count: state.count - value }),
    getState: ()          => (state: MyState) => (state)
  };
  type MyActions = WiredActions<MyState, (typeof actions)>;

  type t1 = ParamType<typeof actions.act1>; // $ExpectType {}
  type t1a = ParamType<MyActions['act1']>; // $ExpectType {}
  type t2 = ParamType<typeof actions.act2>; // $ExpectType number
  type t2a = ParamType<MyActions['act2']>; // $ExpectType number
  type t3 = ParamType<typeof actions.act3>; // $ExpectType {}
  type t4 = ParamType<typeof actions.act4>; // $ExpectType number
}
import { WiredActions } from "@hyperapp/types";

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

//------------------------
// without @hyperapp/types
//------------------------
const view1 = (state: MyState, actions: (typeof actionImplements)) => {
    actions.down(5); // OK
    actions.reset(); // OK

    let st = actions.getState();  // TypeScript infers that `st` is function - ((state: MyState) => MyState)  But, st is MyState object exactly.
    // console.log(st.count); // TypeScript raises a build error

    // You may write for avoiding TypeScript build error, but it is verbose and unsafe...
    // (if getState() returns partial state or Promise?)
    let st2 = ((actions.getState() as any) as MyState);
    console.log(st2.count); // Build OK
};

//------------------------
// with @hyperapp/types
//------------------------
type MyActions = WiredActions<MyState, (typeof actionImplements)>; // generate type of wired actions from `actionImplements`

const view2 = (state: MyState, actions: MyActions) => {
    actions.down(5); // OK
    actions.reset(); // OK

    let st = actions.getState(); // TypeScript infers that `st` is MyState. It is correct and typesafe!
    console.log(st.count); // OK
};
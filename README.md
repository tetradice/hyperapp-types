hyperapp-types
========

Useful and strict type definitions for TypeScript with [hyperapp][].


Requirement
--------

hyperapp V1 (1.x.x) and TypeScript 2.8 later


Features
--------

hyperapp-types includes 2 utility types.

1. `WiredActions` - Generate wired actions type from actions. (Also nesting action)
2. `ParamType` - Extract parameter type from action. It is a little something extra :-)

Installation
--------

Install with npm / Yarn.

```
npm install hyperapp-types
```

Usage
--------

### 1. WiredActions

Pass the state type and the actions type to `WiredAction`. WiredActions will generate correctly typed actions types based on them.

```ts
import { WiredActions } from "hyperapp-types";

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
// without hyperapp-types
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
// with hyperapp-types
//------------------------
type MyActions = WiredActions<MyState, (typeof actionImplements)>; // generate type of wired actions from `actionImplements`

const view2 = (state: MyState, actions: MyActions) => {
    actions.down(5); // OK
    actions.reset(); // OK

    let st = actions.getState(); // TypeScript infers that `st` is MyState. It is correct and typesafe!
    console.log(st.count); // OK
};
```

hyperapp-types also supports nested actions.

```ts
import { WiredActions } from "hyperapp-types";

interface MyState {
  label: {
    text: string;
  }
}

const state: MyState = {
  label: {
    text: ""
  }
};

type LabelState = MyState['label'];
type LabelActions = MyActions['label'];

const actionImplements = {
  label: {
    setText: (data: string) => ({text: ''}),
    getLabel: () => (state: LabelState, actions: LabelActions) => (state)
  }
};

type MyActions = WiredActions<MyState, (typeof actionImplements)>;

const view2 = (state: MyState, actions: MyActions) => {
    actions.label.setText('1');
    let currentLabelText = actions.label.getLabel().text;
};
```

### 2. ParamType

ParamType extracts parameter types from function type with zero or one parameter (action function).

```ts
import { ParamType, WiredActions } from "hyperapp-types";

interface MyState {
  count: number;
}

const state: MyState = {
  count: 0
};

const actionImplements = {
  down:     (value: number) => (state: MyState, actions: MyActions) => ({ count: state.count - value }),
  reset:    () => ({ count: 0 })
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
```

License
--------
Unlicensed.

Contact
--------
@tetradice ([Twitter](https://twitter.com/tetradice))

[hyperapp]: https://github.com/hyperapp/hyperapp
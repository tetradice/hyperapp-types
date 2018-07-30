// TypeScript Version: 2.8
// Extra type definitions for hyperapp V1

/// <reference types="hyperapp" />

/** Action implements type */
export type ActionImplements<Self, State> = {[key in keyof Self]: ActionImplementItem<Self, State, key>};

type ActionImplementItem<ActionImpls, State, PropName extends keyof ActionImpls> = (
    ActionImplementFunctionLazy<State>
    |
    ActionImplementFunction<State>
    |
    NestedActionImplements<ActionImpls, State, PropName>
);

type ActionImplementFunctionLazy<State> = (data?: any) => (state: State, actions: object) => hyperapp.ActionResult<State>;
type ActionImplementFunction<State> = (data?: any) => hyperapp.ActionResult<State>;

type NestedActionImplements<ActionImpls, State, PropName extends keyof ActionImpls> = (
    PropName extends ((keyof State) & (keyof ActionImpls)) ? ActionImplements<ActionImpls[PropName], State[PropName]> : never
);

/** Wired actions type (generated by type of action implements) */
export type WiredActions<State, ActImpls extends ActionImplements<ActImpls, State>> = WiredActionsInner<State, ActImpls>;

type WiredActionsInner<State, ActImpls> = {[key in keyof ActImpls]: WiredActionItem<State, ActImpls, key>};

type WiredActionItem<State, ActImpls, PropName extends (keyof ActImpls)> = (
    // without parameter
    ActImpls[PropName] extends (() => (state: State, actions: infer A2) => (infer R))              ? (() => R)        :
    ActImpls[PropName] extends (() => (infer R))                                                   ? (() => R)        :
    // with parameter
    ActImpls[PropName] extends ((data: infer P) => (state: State, actions: infer A2) => (infer R)) ? ((data: P) => R) :
    ActImpls[PropName] extends ((data: infer P) => (infer R))                                      ? ((data: P) => R) :
    // nested actions
    PropName extends (keyof State) ? WiredActionsInner<State[PropName], ActImpls[PropName]> :
    // invalid
    'ERROR: invalid action type'
);

/** extract parameter type from action */
export type ParamType<A> = (
    A extends (() => any)              ? never :
    A extends ((data: infer P) => any) ? P     :
    never
);
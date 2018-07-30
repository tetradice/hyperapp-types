import { WiredActions } from "@hyperapp/types";

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
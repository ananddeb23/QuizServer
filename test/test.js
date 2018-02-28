const defaultState1 = {
  page: 'removenote',
  notescount: 2,
  status: 'like',
};
const defaultState2 = {
  page: 'removenote',
  notescount: 1,
  status: 'like',
};
const defaultState3 = {
  page: 'removenote',
  notescount: 1,
  status: 'like',
};
const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'EDIT_NOTE': {
      //   notescount: noteid - 1, page: 'addnote', defText: notetext, defTitle: notetitle
      return {
        ...state, page: 'addnote', notescount: action.payload.noteid - 1,
      };
    }

    case 'TOGGLE_PAGE': {
      return { ...state, page: 'addNnote' };
    }

    default: {
      return state;
    }
  }
};

describe(' testing reducers ', () => {
  it('action edit note must corretly update the state', () => {
    const action = {
      type: 'EDIT_NOTE',
      payload: {
        noteid: 2,
      },
    };
    const obj = {
      page: 'addnote',
      notescount: 1,
      status: 'like',
    };
    expect(reducer(defaultState1, action)).toEqual(obj);
  });
  it('action toggle page  must corretly update the state', () => {
    const action = {
      type: 'TOGGLE_PAGE',
      payload: {
        noteid: 1,
      },
    };
    const obj = {
      page: 'addNnote',
      notescount: 1,
      status: 'like',
    };
    expect(reducer(defaultState2, action)).toEqual(obj);
  });
  it('default action must corretly not update the state', () => {
    const action = {
      type: 'EDIT_oNOTE',
      payload: {
        noteid: 1,
      },
    };
    const obj = {
      page: 'removenote',
      notescount: 1,
      status: 'like',
    };
    expect(reducer(defaultState3, action)).toEqual(obj);
  });
  it('tan object must be returned', () => {
    const action = {
      type: 'EDIT_oNOTE',
      payload: {
        noteid: 1,
      },
    };
    const obj = {
      page: 'removenote',
      notescount: 1,
      status: 'like',
    };
    expect(typeof (reducer(defaultState3, action))).toBe('object');
  });
});

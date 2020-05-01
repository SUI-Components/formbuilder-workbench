const JSON_ERROR = 'JSON bad formatted'
const parseOrFail = str => {
  let obj
  try {
    obj = JSON.parse(str)
  } catch (err) {
    return [err]
  }

  return [null, obj]
}

const BASE_FORM = {
  form: {
    id: 'base',
    fields: [
      // {id: '1', type: 'text'},
      // {id: '2', type: 'text'},
      // {id: '3', type: 'text'},
      // {id: '4', type: 'text'}
    ],
    rules: {}
  }
}
export const STORE = {
  json: BASE_FORM,
  initialFields: {},
  modal: {open: false, text: '', error: null},
  fields: {text: JSON.stringify(BASE_FORM.form.fields, null, 2)},
  rules: {text: JSON.stringify(BASE_FORM.form.rules, null, 2)}
}

export const reducer = (state, action) => {
  switch (action.type) {
    case 'MODAL_UPDATE': {
      return {
        ...state,
        modal: {
          ...state.modal,
          open: action.open
        }
      }
    }
    case 'FIELDS_UPDATE': {
      const [error, nextFields] = parseOrFail(action.value)

      if (error) {
        return {
          ...state,
          fields: {
            text: action.value,
            error
          }
        }
      } else {
        return {
          ...state,
          json: {
            form: {
              ...state.json.form,
              fields: nextFields
            }
          },
          fields: {
            text: action.value,
            error: null
          }
        }
      }
    }
    case 'RULES_UPDATE': {
      const [error, nextRules] = parseOrFail(action.value)
      if (error) {
        return {
          ...state,
          rules: {
            text: action.value,
            error
          }
        }
      } else {
        return {
          ...state,
          json: {
            form: {
              ...state.json.form,
              rules: nextRules
            }
          },
          rules: {
            text: action.value,
            error: null
          }
        }
      }
    }
    case 'FORM_UPDATE': {
      return {
        ...state,
        initialFields: action.fields
      }
    }
    case 'FORM_NEW': {
      const [error, nextForm] = parseOrFail(action.nextForm)
      if (error) {
        return {
          ...state,
          modal: {
            ...state.modal,
            text: action.nextForm,
            error
          }
        }
      } else {
        return {
          ...state,
          json: nextForm,
          modal: {
            ...state.modal,
            text: action.nextForm,
            error: null,
            open: false
          },
          fields: {
            ...state.fields,
            text: JSON.stringify(nextForm.form.fields, null, 2)
          },
          rules: {
            ...state.rules,
            text: JSON.stringify(nextForm.form.rules, null, 2)
          }
        }
      }
    }
    default: {
      return state
    }
  }
}

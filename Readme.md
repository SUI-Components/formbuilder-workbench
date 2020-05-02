## Install form builder [![Build Status](https://travis-ci.org/SUI-Components/formbuilder-workbench.svg?branch=master)](https://travis-ci.org/SUI-Components/formbuilder-workbench)

### Installation

```sh
$ npm install @s-ui/react-form-builder --save
```

### Usage

```js
import FormBuilder from '@s-ui/react-form-builder'

return (<FormBuilder
    json={json}
    onChange={fields => console.table(fields)}
    onBlur={onBlur}
    errors={errors}
/>)
```

### Form Builder API

- `json`: json that will build the form.
- `onChange`: method triggered on each change:
    - First argument: Dictionary like `{fieldId1: value1, fieldId2: value2, ... , __FIELD_CHANGED__: fieldId}`. __FIELD_CHANGED__ key contains as value the last field that has changed its value.
- `onBlur`: method triggered on each on blur:
    - First argument: `fieldId` that has triggered the blur event.
- `errors`: Dictionary like `{fieldId1: [error11, error12, ...], fieldId2: [error21, error22, ...]}`.

### Example Form Builder with validation

- It allows two types of validations;
    - `checkConstrainstsFactory` is a function exported by the form builder that returns the **native** errors of the form based on the constraints defined in each field in the json.
    - `checkCustomConstraints` is a invented function that allows to **extend** the validation of the form builder adding some validation outside the form.

```js
import FormBuilder, {checkConstrainstsFactory} from '@s-ui/react-form-builder'

const onBlur = fieldId => {

    const checkCustomConstraints = ({fieldId, fieldValue}) => {
        if(fieldValue === 'prohibit_word') 
            return {[fieldId]: ['No puede contener palabras prohibidas']}
    }

    setErrors(prevErrors => {
        // get errors derived from the constraints defined in json
        const newNativeErrors = checkConstrainstsFactory(JSONBuilder)({
            for: fieldId
        })
        // get errors not defined in the json ('custom')
        const newCustomErrors = checkCustomConstraints({
            fieldId,
            fieldValue: adFields[fieldId]
        })

        const errors = {
            ...prevErrors,
            ...newNativeErrors,
            ...newCustomErrors
        }

        // set errors
        return errors
    })
}

return (<FormBuilder
    json={json}
    onBlur={onBlur}
    errors={errors}
/>)
```

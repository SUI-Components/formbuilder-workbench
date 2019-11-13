import React, {useCallback, useReducer} from 'react'

import FormBuilder from '@schibstedspain/ma-form-builder'
import MoleculeTextareaField from '@s-ui/react-molecule-textarea-field'
import AtomButton from '@schibstedspain/sui-atom-button'
import MoleculeModal from '@s-ui/react-molecule-modal'

import {reducer, STORE} from '../../reducer'
import saveFile from '../../lib/saveFile'

const App = () => {
  const [store, dispatch] = useReducer(reducer, STORE)

  const handlerFieldsTextArea = useCallback((_, {value}) => {
    return dispatch({type: 'FIELDS_UPDATE', value})
  }, [])

  const handlerRulesTextArea = useCallback((_, {value}) => {
    return dispatch({type: 'RULES_UPDATE', value})
  }, [])

  const handlerChangeFormBuilder = useCallback(fields => {
    return dispatch({type: 'FORM_UPDATE', fields})
  }, [])

  const handlerClickUploadButton = useCallback(() => {
    return dispatch({type: 'MODAL_UPDATE', open: true})
  }, [])

  const handlerClickCloseModal = useCallback(() => {
    return dispatch({type: 'MODAL_UPDATE', open: false})
  }, [])

  const handlerFormTextArea = useCallback((_, {value}) => {
    return dispatch({type: 'FORM_NEW', nextForm: value})
  }, [])

  const handlerClickDownloadButton = useCallback(() => {
    saveFile(
      new window.Blob([JSON.stringify(store.json, null, 2)], {
        type: 'text/json;charset=utf-8'
      }),
      'form.json'
    )
  }, [store])

  return (
    <>
      <AtomButton size="large" onClick={handlerClickDownloadButton}>
        Download JSON
      </AtomButton>
      <AtomButton size="large" onClick={handlerClickUploadButton}>
        Upload JSON
      </AtomButton>
      <MoleculeModal
        isOpen={store.modal.open}
        closeOnOutsideClick
        closeOnEscKeyDown
        header={<strong>Form JSON</strong>}
        onClose={handlerClickCloseModal}
      >
        <MoleculeTextareaField
          id="form"
          label="Form"
          errorText={store.modal.error}
          value={store.modal.text}
          onChange={handlerFormTextArea}
        />
      </MoleculeModal>
      <MoleculeTextareaField
        id="fields"
        label="Fields"
        errorText={store.fields.error}
        value={store.fields.text}
        onChange={handlerFieldsTextArea}
      />
      <MoleculeTextareaField
        id="rules"
        label="Rules"
        errorText={store.rules.error}
        value={store.rules.text}
        onChange={handlerRulesTextArea}
      />
      <FormBuilder
        key={JSON.stringify(store.json)}
        json={store.json}
        initialFields={store.initialFields}
        onChange={handlerChangeFormBuilder}
      />
    </>
  )
}

export default App

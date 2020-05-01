import React, {useCallback, useReducer} from 'react'
import cx from 'classnames'

import FormBuilder from '@s-ui/react-form-builder'
import AtomButton from '@s-ui/react-atom-button'
import MoleculeModal from '@s-ui/react-molecule-modal'
import AtomUpload, {uploadStatuses} from '@s-ui/react-atom-upload'

import Upload from '../Icons/Upload'
import {reader} from '../libs/files'

import {reducer, STORE} from '../../reducer'
import saveFile from '../../lib/saveFile'
import {Tab, Tabs} from '../Tabs'

import AceEditor from 'react-ace'

import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/theme-monokai'

const App = () => {
  const [store, dispatch] = useReducer(reducer, STORE)

  const classNameFormBuilderContainer = cx('App-formContainer', {
    'has-Error': store.fields.error || store.rules.error
  })

  const handlerFieldsTextArea = useCallback(value => {
    return dispatch({type: 'FIELDS_UPDATE', value})
  }, [])

  const handlerRulesTextArea = useCallback(value => {
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

  // const handlerFormTextArea = useCallback((_, {value}) => {
  //   return dispatch({type: 'FORM_NEW', nextForm: value})
  // }, [])

  const handlerClickDownloadButton = useCallback(() => {
    saveFile(
      new window.Blob([JSON.stringify(store.json, null, 2)], {
        type: 'text/json;charset=utf-8'
      }),
      'form.json'
    )
  }, [store])

  const onFilesSelection = async files => {
    const [fileJSON] = files
    const json = await reader(fileJSON)
    return dispatch({type: 'FORM_NEW', nextForm: json})
  }

  return (
    <div className="App">
      <div className="App-editor">
        <MoleculeModal
          isOpen={store.modal.open}
          closeOnOutsideClick
          closeOnEscKeyDown
          onClose={handlerClickCloseModal}
        >
          <AtomUpload
            onFilesSelection={onFilesSelection}
            status={uploadStatuses.ACTIVE}
            iconActive={<Upload height="100%" width="100%" />}
            textActive="Click or Drag&Drop to Upload"
          />
        </MoleculeModal>
        <Tabs
          defaultIndex={0}
          actions={
            <AtomButton size="small" onClick={handlerClickUploadButton}>
              Upload JSON
            </AtomButton>
          }
        >
          <Tab label="Fields">
            <AceEditor
              style={{
                width: '100%',
                height: 'calc(100vh - 50px)'
              }}
              className="App-editorCanvas"
              placeholder="Placeholder Text"
              mode="json"
              theme="monokai"
              name="blah2"
              onChange={handlerFieldsTextArea}
              fontSize={14}
              showPrintMargin
              showGutter
              highlightActiveLine
              value={store.fields.text}
              setOptions={{
                enableBasicAutocompletion: false,
                enableLiveAutocompletion: false,
                enableSnippets: false,
                showLineNumbers: true,
                tabSize: 2
              }}
            />
          </Tab>
          <Tab label="Rules">
            <AceEditor
              style={{
                width: '100%',
                height: 'calc(100vh - 50px)'
              }}
              className="App-editorCanvas"
              editorProps={{$blockScrolling: true}}
              mode="json"
              name="TextAreaRules"
              onChange={handlerRulesTextArea}
              theme="monokai"
              value={store.rules.text}
            />
          </Tab>
        </Tabs>
      </div>
      <div className="App-preview">
        <div className="App-previewTitle">
          <h2 className="App-previewTitleLiteral">PREVIEW</h2>
          <div>
            <AtomButton size="small" onClick={handlerClickDownloadButton}>
              Download JSON
            </AtomButton>
          </div>
        </div>
        <div className={classNameFormBuilderContainer}>
          {!store.fields.error && !store.rules.error ? (
            <FormBuilder
              key={JSON.stringify(store.json)}
              json={store.json}
              initialFields={store.initialFields}
              onChange={handlerChangeFormBuilder}
            />
          ) : (
            <pre>
              <code>
                {store.fields.error?.stack}
                {store.rules.error?.stack}
              </code>
            </pre>
          )}
        </div>
      </div>
    </div>
  )
}

export default App

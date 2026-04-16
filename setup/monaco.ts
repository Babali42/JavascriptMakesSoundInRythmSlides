import { defineMonacoSetup } from '@slidev/types'

export default defineMonacoSetup((monaco) => {
    monaco.editor.EditorOptions.fontSize.defaultValue = 20

    return {
        editorOptions: {
            fontSize: 20,
            lineHeight: 36,   // Monaco interprets this as px when > 8
            lineNumbers: 'on',
        }
    }
})
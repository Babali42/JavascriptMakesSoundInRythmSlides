import { defineMonacoSetup } from '@slidev/types'

export default defineMonacoSetup((monaco) => {
    monaco.editor.EditorOptions.fontSize.defaultValue = 20

    return {
        editorOptions: {
            fontSize: 18,
            lineHeight: 26,   // Monaco interprets this as px when > 8
            lineNumbers: 'on',
            scrollbar: {
                vertical: 'hidden',         // hide scrollbar if you want no-scroll feel
                handleMouseWheel: false,    // prevent scroll hijacking on slide
            },
        }
    }
})
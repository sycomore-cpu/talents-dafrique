'use client'

import React, { useRef, useEffect, useCallback } from 'react'

interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}

const TOOLBAR_BUTTONS = [
  { command: 'bold', label: 'G', title: 'Gras', style: 'font-bold' },
  { command: 'italic', label: 'I', title: 'Italique', style: 'italic' },
  { command: 'underline', label: 'S', title: 'Souligné', style: 'underline' },
] as const

export default function RichTextEditor({ value, onChange, placeholder = 'Commencez à écrire votre article...' }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  // Track if we're updating internally to avoid cursor-reset loops
  const internalUpdate = useRef(false)

  // Sync value → editor only on mount or external change (not from onInput)
  useEffect(() => {
    if (!editorRef.current) return
    if (internalUpdate.current) return
    // Only update DOM if content actually differs to avoid cursor jumping
    if (editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  const exec = useCallback((command: string, value?: string) => {
    editorRef.current?.focus()
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    document.execCommand(command, false, value)
    if (editorRef.current) {
      internalUpdate.current = true
      onChange(editorRef.current.innerHTML)
      internalUpdate.current = false
    }
  }, [onChange])

  function handleInput() {
    if (!editorRef.current) return
    internalUpdate.current = true
    onChange(editorRef.current.innerHTML)
    internalUpdate.current = false
  }

  function handleHeading(tag: 'h2' | 'h3') {
    exec('formatBlock', tag)
  }

  function handleList(ordered: boolean) {
    exec(ordered ? 'insertOrderedList' : 'insertUnorderedList')
  }

  function handleLink() {
    const url = window.prompt('URL du lien :', 'https://')
    if (url) exec('createLink', url)
  }

  const btnBase = 'px-2.5 py-1 rounded text-xs font-medium text-brown/70 hover:bg-brown/10 hover:text-brown transition-colors focus:outline-none focus:ring-1 focus:ring-primary/30 border border-transparent hover:border-brown/15'

  return (
    <div className="rounded-lg border border-brown/15 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary hover:border-brown/30 transition-colors">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-brown/10 bg-brown/2">
        {/* Bold / Italic / Underline */}
        {TOOLBAR_BUTTONS.map((btn) => (
          <button
            key={btn.command}
            type="button"
            title={btn.title}
            onMouseDown={(e) => { e.preventDefault(); exec(btn.command) }}
            className={`${btnBase} ${btn.style}`}
          >
            {btn.label}
          </button>
        ))}

        {/* Separator */}
        <span className="mx-1 h-4 w-px bg-brown/15 shrink-0" />

        {/* H2 */}
        <button
          type="button"
          title="Titre (H2)"
          onMouseDown={(e) => { e.preventDefault(); handleHeading('h2') }}
          className={btnBase}
        >
          H2
        </button>

        {/* H3 */}
        <button
          type="button"
          title="Sous-titre (H3)"
          onMouseDown={(e) => { e.preventDefault(); handleHeading('h3') }}
          className={btnBase}
        >
          H3
        </button>

        {/* Separator */}
        <span className="mx-1 h-4 w-px bg-brown/15 shrink-0" />

        {/* Unordered list */}
        <button
          type="button"
          title="Liste à puces"
          onMouseDown={(e) => { e.preventDefault(); handleList(false) }}
          className={btnBase}
        >
          • Liste
        </button>

        {/* Ordered list */}
        <button
          type="button"
          title="Liste numérotée"
          onMouseDown={(e) => { e.preventDefault(); handleList(true) }}
          className={btnBase}
        >
          1. Liste
        </button>

        {/* Separator */}
        <span className="mx-1 h-4 w-px bg-brown/15 shrink-0" />

        {/* Link */}
        <button
          type="button"
          title="Insérer un lien"
          onMouseDown={(e) => { e.preventDefault(); handleLink() }}
          className={btnBase}
        >
          🔗 Lien
        </button>
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        data-placeholder={placeholder}
        className="
          min-h-[300px] px-3 py-2.5 text-sm text-brown leading-relaxed outline-none
          [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-brown [&_h2]:mt-4 [&_h2]:mb-2
          [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-brown [&_h3]:mt-3 [&_h3]:mb-1.5
          [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3
          [&_li]:mb-1 [&_a]:text-primary [&_a]:underline
          empty:before:content-[attr(data-placeholder)] empty:before:text-brown/30 empty:before:pointer-events-none
        "
      />
    </div>
  )
}

'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Props {
  content: string
}

export default function BlogContent({ content }: Props) {
  return (
    <div className="prose prose-brown max-w-none text-brown leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold font-playfair text-brown mt-8 mb-4">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-bold font-playfair text-brown mt-8 mb-3">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold text-brown mt-6 mb-2">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-brown/80 mb-4 leading-relaxed">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-6 mb-4 space-y-1.5">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-6 mb-4 space-y-1.5">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-brown/80">{children}</li>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-brown">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-brown/60">{children}</em>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary/30 pl-4 my-4 italic text-brown/60">
              {children}
            </blockquote>
          ),
          code: ({ children, className }) => {
            const isBlock = className?.includes('language-')
            if (isBlock) {
              return (
                <pre className="bg-brown/5 rounded-lg p-4 overflow-x-auto my-4">
                  <code className="text-sm font-mono text-brown">{children}</code>
                </pre>
              )
            }
            return (
              <code className="bg-brown/5 rounded px-1.5 py-0.5 text-sm font-mono text-brown">
                {children}
              </code>
            )
          },
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline hover:text-primary/80 transition-colors"
            >
              {children}
            </a>
          ),
          hr: () => <hr className="border-brown/10 my-8" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

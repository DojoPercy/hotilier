import { PortableText } from '@portabletext/react'
import { urlFor } from './image'

// Custom components for portable text
const components = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?._ref) {
        return null
      }
      return (
        <figure className="my-8">
          <img
            src={urlFor(value)
              .width(800)
              .fit('max')
              .auto('format')
              .url()}
            alt={value.alt || ''}
            className="w-full h-auto"
          />
          {(value.caption || value.credit) && (
            <figcaption className="mt-2 text-sm text-gray-600">
              {value.caption}
              {value.credit && (
                <span className="ml-2">
                  Credit: {value.credit}
                </span>
              )}
            </figcaption>
          )}
        </figure>
      )
    },
    embed: ({ value }: any) => {
      if (!value?.url) {
        return null
      }
      return (
        <div className="my-8">
          <iframe
            src={value.url}
            title={value.title || 'Embedded content'}
            className="w-full aspect-video"
            frameBorder="0"
            allowFullScreen
          />
        </div>
      )
    }
  },
  marks: {
    link: ({ children, value }: any) => {
      const target = (value?.href || '').startsWith('http') ? '_blank' : undefined
      return (
        <a
          href={value?.href}
          target={target}
          rel={target === '_blank' ? 'noopener noreferrer' : undefined}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          {children}
        </a>
      )
    },
    strong: ({ children }: any) => (
      <strong className="font-bold">{children}</strong>
    ),
    em: ({ children }: any) => (
      <em className="italic">{children}</em>
    ),
    code: ({ children }: any) => (
      <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    )
  },
  block: {
    h1: ({ children }: any) => (
      <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-2xl font-bold mt-6 mb-3">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-xl font-bold mt-4 mb-2">{children}</h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="text-lg font-bold mt-3 mb-2">{children}</h4>
    ),
    normal: ({ children }: any) => (
      <p className="mb-4 leading-relaxed">{children}</p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">
        {children}
      </blockquote>
    )
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>
    ),
    number: ({ children }: any) => (
      <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>
    )
  },
  listItem: ({ children }: any) => (
    <li className="leading-relaxed">{children}</li>
  )
}

// Main component for rendering portable text
export function PortableTextComponent({ value }: { value: any }) {
  return <PortableText value={value} components={components} />
}

// Helper function to extract plain text from portable text
export function extractTextFromPortableText(blocks: any[]): string {
  if (!blocks || !Array.isArray(blocks)) return ''
  
  return blocks
    .map(block => {
      if (block._type === 'block') {
        return block.children
          ?.map((child: any) => child.text)
          .join('') || ''
      }
      return ''
    })
    .join(' ')
    .trim()
}

// Helper function to get reading time estimate
export function getReadingTime(blocks: any[]): number {
  const text = extractTextFromPortableText(blocks)
  const wordsPerMinute = 200
  const wordCount = text.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

'use client'
import {useEffect, useRef, useState} from 'react'

export function Slider({children}: {children: React.ReactNode}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const [perView, setPerView] = useState(1)
  const slides = Array.isArray(children) ? children : [children]
  const loop = slides.length > perView
  const extended = loop ? [...slides, ...slides.slice(0, perView)] : slides

  useEffect(() => {
    const handle = () => {
      const w = window.innerWidth
      setPerView(w >= 1024 ? 3 : 1)
    }
    handle()
    window.addEventListener('resize', handle)
    return () => window.removeEventListener('resize', handle)
  }, [])

  const maxIndex = Math.max(0, (loop ? slides.length + perView : slides.length) - 1)
  const go = (delta: number) =>
    setIndex((i) => {
      if (!loop) {
        const next = i + delta
        return Math.min(maxIndex, Math.max(0, next))
      }
      const span = slides.length + perView
      return (i + delta + span) % span
    })

  useEffect(() => {
    if (!trackRef.current) return
    const track = trackRef.current
    const total = slides.length
    const visible = perView
    const widthPercent = 100 / visible
    // Apply widths and translate
    track.style.setProperty('--item-width', widthPercent + '%')
    track.style.transform = `translateX(-${index * (100 / visible)}%)`
  }, [index, perView, slides.length])

  // Seamless wrap: jump without animation after reaching clones
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const onEnd = () => {
      if (!loop) return
      if (index >= slides.length) {
        track.style.transition = 'none'
        setIndex((i) => i - slides.length)
        requestAnimationFrame(() => {
          track.style.transition = ''
        })
      }
      if (index < 0) {
        track.style.transition = 'none'
        setIndex((i) => i + slides.length)
        requestAnimationFrame(() => {
          track.style.transition = ''
        })
      }
    }
    track.addEventListener('transitionend', onEnd)
    return () => track.removeEventListener('transitionend', onEnd)
  }, [index, slides.length, loop])

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div ref={trackRef} className="flex transition-transform duration-300 ease-out">
          {extended.map((child, i) => (
            <div key={i} className="shrink-0" style={{width: 'var(--item-width)'}}>
              {child}
            </div>
          ))}
        </div>
      </div>
      
    </div>
  )
}



 export function Slide({children}: {children: React.ReactNode}) {
    return <div className="px-2 lg:px-3">{children}</div>
  }

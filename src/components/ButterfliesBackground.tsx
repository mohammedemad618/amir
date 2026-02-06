'use client'

import { useEffect, useRef, useState } from 'react'

interface ButterfliesInstance {
  destroy?: () => void
  [key: string]: unknown
}

declare global {
  interface Window {
    THREE?: typeof import('three')
  }
}

export function ButterfliesBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const instanceRef = useRef<ButterfliesInstance | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted || !containerRef.current) {
      return
    }

    let mounted = true

    const initButterflies = async () => {
      try {
        const textureUrl = 'https://assets.codepen.io/33787/butterflies.png'
        await new Promise<void>((resolve, reject) => {
          const img = new Image()
          img.crossOrigin = 'anonymous'
          img.onload = () => {
            resolve()
          }
          img.onerror = () => {
            reject(new Error(`Failed to load texture image: ${textureUrl}`))
          }
          img.src = textureUrl
        })

        if (!window.THREE) {
          const THREE = await import('three')
          window.THREE = THREE
        }

        // @ts-expect-error - threejs-toys doesn't have type declarations
        const toys = await import('threejs-toys')

        if (!mounted || !containerRef.current) {
          return
        }

        const { butterfliesBackground } = toys

        const canvas = document.createElement('canvas')
        const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null
        if (!gl) {
          throw new Error('WebGL is not supported')
        }

        instanceRef.current = butterfliesBackground({
          el: containerRef.current,
          gpgpuSize: 5,
          material: 'basic',
          materialParams: { transparent: true, alphaTest: 0.5 },
          texture: textureUrl,
          textureCount: 4,
          wingsScale: [1, 1, 1],
          wingsWidthSegments: 8,
          wingsHeightSegments: 8,
          wingsSpeed: 0.12,
          wingsDisplacementScale: 1.0,
          noiseCoordScale: 0.001,
          noiseTimeCoef: 0.0002,
          noiseIntensity: 0.00015,
          attractionRadius1: 100,
          attractionRadius2: 150,
          maxVelocity: 0.04
        })
      } catch (error) {
        console.error('Error initializing butterflies background:', error)
      }
    }

    const timer = setTimeout(() => {
      initButterflies()
    }, 100)

    return () => {
      clearTimeout(timer)
      mounted = false
      if (instanceRef.current && typeof instanceRef.current.destroy === 'function') {
        instanceRef.current.destroy()
        instanceRef.current = null
      }
    }
  }, [isMounted])

  return (
    <div
      ref={containerRef}
      className='butterflies-container'
      aria-hidden='true'
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
        opacity: 0.2
      }}
    />
  )
}

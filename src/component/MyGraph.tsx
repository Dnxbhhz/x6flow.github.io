import { useEffect, useRef } from 'react'
import { Graph } from '@antv/x6'

const MyGraph = () => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const graphRef = useRef<Graph | null>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const graph = new Graph({
      container: containerRef.current,
      autoResize: true,
      grid: true,
    })
    graphRef.current = graph

    return () => {
      graph.dispose?.()
      graphRef.current = null
    }
  }, [])

  return <div id="container" ref={containerRef} className="w-full h-full"></div>
}

export default MyGraph

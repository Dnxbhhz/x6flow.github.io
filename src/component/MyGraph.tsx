import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { Graph, Path, Edge, Platform } from '@antv/x6'
import { componentConfig } from './component'
import { register } from '@antv/x6-react-shape'
import { nanoid } from 'nanoid'
import { Selection } from '@antv/x6-plugin-selection'

componentConfig.forEach((item) => {
  register(item)
})

// 注册连线
Graph.registerConnector(
  'curveConnector',
  (sourcePoint, targetPoint) => {
    const hgap = Math.abs(targetPoint.x - sourcePoint.x)
    const path = new Path()
    path.appendSegment(
      Path.createSegment('M', sourcePoint.x - 4, sourcePoint.y),
    )
    path.appendSegment(
      Path.createSegment('L', sourcePoint.x + 12, sourcePoint.y),
    )
    // 水平三阶贝塞尔曲线
    path.appendSegment(
      Path.createSegment(
        'C',
        sourcePoint.x < targetPoint.x
          ? sourcePoint.x + hgap / 2
          : sourcePoint.x - hgap / 2,
        sourcePoint.y,
        sourcePoint.x < targetPoint.x
          ? targetPoint.x - hgap / 2
          : targetPoint.x + hgap / 2,
        targetPoint.y,
        targetPoint.x - 6,
        targetPoint.y,
      ),
    )
    path.appendSegment(
      Path.createSegment('L', targetPoint.x + 2, targetPoint.y),
    )

    return path.serialize()
  },
  true,
)

Edge.config({
  markup: [
    {
      tagName: 'path',
      selector: 'wrap',
      attrs: {
        fill: 'none',
        cursor: 'pointer',
        stroke: 'transparent',
        strokeLinecap: 'round',
      },
    },
    {
      tagName: 'path',
      selector: 'line',
      attrs: {
        fill: 'none',
        pointerEvents: 'none',
      },
    },
  ],
  connector: { name: 'curveConnector' },
  attrs: {
    wrap: {
      connection: true,
      strokeWidth: 10,
      strokeLinejoin: 'round',
    },
    line: {
      connection: true,
      stroke: '#A2B1C3',
      strokeWidth: 1,
      targetMarker: {
        name: 'classic',
        size: 6,
      },
    },
  },
})

Graph.registerEdge('data-processing-curve', Edge, true)

const MyGraph = forwardRef((_, ref) => {
  useImperativeHandle(ref, () => {
    return {
      getGraph: () => graphRef.current,
    }
  })

  const containerRef = useRef<HTMLDivElement | null>(null)
  const graphRef = useRef<Graph | null>(null)

  const initGraph = () => {
    if (!graphRef.current) return
    const graph = graphRef.current
    const id = nanoid(8)
    graph.addNode({
      id,
      shape: 'Begin',
      ports: [{ id: `${id}-out`, group: 'out' }],
    })
  }

  useEffect(() => {
    if (!containerRef.current) return
    const graph = new Graph({
      container: containerRef.current,
      autoResize: true,
      grid: true,
      connecting: {
        snap: true,
        allowBlank: false,
        allowLoop: false,
        highlight: true,
        sourceAnchor: {
          name: 'left',
          args: {
            dx: Platform.IS_SAFARI ? 4 : 8,
          },
        },
        targetAnchor: {
          name: 'right',
          args: {
            dx: Platform.IS_SAFARI ? 4 : -8,
          },
        },
        createEdge(): Edge {
          return graph.createEdge({
            shape: 'data-processing-curve',
            attrs: {
              line: {
                strokeDasharray: '5 5',
              },
            },
            zIndex: -1,
          })
        },
        // 连接桩校验
        validateConnection({ sourceMagnet, targetMagnet }) {
          // 只能从输出链接桩创建连接
          if (
            !sourceMagnet ||
            sourceMagnet.getAttribute('port-group') === 'in'
          ) {
            return false
          }
          // 只能连接到输入链接桩
          if (
            !targetMagnet ||
            targetMagnet.getAttribute('port-group') !== 'in'
          ) {
            return false
          }
          return true
        },
      },
    })
    graph.use(
      new Selection({
        multiple: true,
        rubberEdge: true,
        rubberNode: true,
        modifiers: 'shift',
        rubberband: true,
      }),
    )
    graphRef.current = graph
    initGraph()
    return () => {
      graph.dispose?.()
      graphRef.current = null
    }
  }, [])

  return (
    <div
      id="container"
      ref={containerRef}
      className="w-full h-full touch-none overscroll-contain"></div>
  )
})

export default MyGraph

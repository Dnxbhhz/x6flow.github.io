import { type Graph, type Node } from '@antv/x6'
import PlusMenu from './PlusMenu'
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { addNodeFromMenu, handleDeleteNode } from '../utils/node'
import { CloseCircleOutlined } from '@ant-design/icons'

const BaseNode = ({
  children,
  node,
  graph,
  showAddMenu = true,
  allowClosed = true,
}: {
  children: ReactNode
  node: Node
  graph: Graph
  showAddMenu?: boolean
  allowClosed?: boolean
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const measureRef = useRef<HTMLDivElement | null>(null)
  const [menuPosition, setMenuPosition] = useState<
    Array<{ id: string; x?: number; y?: number }>
  >([])

  useLayoutEffect(() => {
    const el = measureRef.current
    if (!el) return

    const sync = () => {
      const width = Math.ceil(el.scrollWidth)
      const height = Math.ceil(el.scrollHeight)
      const size = node.size()
      if (
        Math.abs(size.width - width) > 0.5 ||
        Math.abs(size.height - height) > 0.5
      ) {
        node.setSize({ width, height })
      }
    }

    const ro = new ResizeObserver(() => sync())
    ro.observe(el)
    requestAnimationFrame(() => sync())
    return () => ro.disconnect()
  }, [node])

  useEffect(() => {
    let rafId: number | null = null

    const syncFromPorts = () => {
      const list = (node.getPorts() ?? [])
        .filter((p) => (p as { group?: string }).group === 'out')
        .map((p) => {
          const ax = (p as { args?: { x?: unknown } }).args?.x
          const ay = (p as { args?: { y?: unknown } }).args?.y
          const x = typeof ax === 'number' ? (ax as number) : undefined
          const y = typeof ay === 'number' ? (ay as number) : undefined
          return { id: (p.id as string) ?? `${node.id}-out`, x, y }
        })
      if (showAddMenu) {
        setMenuPosition([])
      } else {
        setMenuPosition(list)
      }
    }

    const schedule = () => {
      if (rafId != null) return
      rafId = requestAnimationFrame(() => {
        rafId = null
        syncFromPorts()
      })
    }

    const onAdded = () => schedule()
    const onRemoved = () => schedule()

    node.on('ports:added', onAdded)
    node.on('ports:removed', onRemoved)

    schedule()

    return () => {
      node.off('ports:added', onAdded)
      node.off('ports:removed', onRemoved)
      if (rafId != null) cancelAnimationFrame(rafId)
    }
  }, [node])

  const onMainMouseEnter = () => {
    const ports = node.getPorts() || []
    ports.forEach((port) => {
      node.setPortProp(port.id!, 'attrs/circle', {
        fill: '#fff',
        stroke: '#85A5FF',
      })
    })
  }
  const onMainMouseLeave = () => {
    const ports = node.getPorts() || []
    ports.forEach((port) => {
      node.setPortProp(port.id!, 'attrs/circle', {
        fill: 'transparent',
        stroke: 'transparent',
      })
    })
  }
  const handleMenuClick = (info: { key: string }, index = 0) => {
    const { key } = info
    addNodeFromMenu(key, graph, node, index)
  }

  const menuItems = [
    { key: 'Route', label: '路线' },
    { key: 'Device', label: '设备' },
    { key: 'Algorithm', label: '算法' },
    { key: 'Map', label: '地图' },
  ]
  return (
    <div
      className="bg-white border border-gray-200 rounded-md relative overflow-visible"
      ref={containerRef}
      onMouseEnter={onMainMouseEnter}
      onMouseLeave={onMainMouseLeave}>
      <div ref={measureRef} className="inline-block">
        {children}
      </div>
      {allowClosed && (
        <CloseCircleOutlined
          className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 invisible [.x6-node-selected_&]:visible cursor-pointer"
          onClick={() => handleDeleteNode(node, 'out')}
        />
      )}
      {showAddMenu && (
        <PlusMenu
          items={menuItems}
          onClick={(info) => handleMenuClick({ key: String(info.key) })}
          placement="bottomRight"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[28px]"
        />
      )}
      {menuPosition.length > 0 &&
        menuPosition.map((item, index) => {
          return (
            <PlusMenu
              key={index}
              items={menuItems}
              onClick={(info) =>
                handleMenuClick({ key: String(info.key) }, index)
              }
              placement="bottomRight"
              className="absolute right-0 -translate-y-1/2 translate-x-[28px]"
              style={{ top: item.y ?? 0 }}
            />
          )
        })}
    </div>
  )
}

export default BaseNode

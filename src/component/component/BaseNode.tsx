import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { type Node, type Graph } from '@antv/x6'
import { PlusCircleOutlined } from '@ant-design/icons'
import { Dropdown, type MenuProps } from 'antd'
import { nanoid } from 'nanoid'

const BaseNode = ({
  children,
  node,
  shapeType,
  showAddMenu = true,
}: {
  children: ReactNode
  node: Node
  shapeType?: string
  showAddMenu?: boolean
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const measureRef = useRef<HTMLDivElement | null>(null)

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
  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    const model = node as unknown as { model?: { graph?: Graph } }
    const graph = model.model?.graph
    if (!graph) return

    const rawKey = String(key)
    const shape = rawKey

    // 当前节点确保有 out 端口
    const existingOut = node.getPorts().find((p) => p.group === 'out')
    const outId = existingOut?.id ?? `${node.id}-out`
    if (!existingOut) {
      node.addPort({ id: outId, group: 'out' })
    }

    const { x, y } = node.getPosition()
    const newId = nanoid(8)
    const ports = [{ id: `${newId}-in`, group: 'in' }]
    if (shape !== 'Map') {
      ports.push({ id: `${newId}-out`, group: 'out' })
    }

    graph.addNode({
      id: newId,
      shape,
      x: x + 250,
      y,
      ports,
    })

    // 连接边
    graph.addEdge({
      shape: 'data-processing-curve',
      source: { cell: node.id, port: outId },
      target: { cell: newId, port: `${newId}-in` },
      zIndex: -1,
    })
  }
  return (
    <div
      className="bg-white border border-gray-200 rounded-md relative overflow-visible"
      ref={containerRef}
      onMouseEnter={onMainMouseEnter}
      onMouseLeave={onMainMouseLeave}>
      <div ref={measureRef} className="inline-block">
        {children}
      </div>
      {showAddMenu && (
        <Dropdown
          menu={{
            items: [
              {
                key: 'Route',
                label: '路线',
              },
              {
                key: 'Device',
                label: '设备',
              },
              {
                key: 'Algorithm',
                label: '算法',
              },
              {
                key: 'Map',
                label: '地图',
              },
            ],
            onClick: handleMenuClick,
          }}
          placement="bottomRight"
          trigger={['click']}>
          <PlusCircleOutlined className="absolute invisible right-0 top-1/2 -translate-y-1/2 translate-x-[28px] z-10 [.x6-node-selected_&]:visible" />
        </Dropdown>
      )}
    </div>
  )
}

export default BaseNode

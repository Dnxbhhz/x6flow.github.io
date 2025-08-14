import { type Graph, type Node } from '@antv/x6'
import { nanoid } from 'nanoid'

/**
 * 根据起点初始下游节点的位置信息
 * @param node 起始节点
 * @param graph
 * @returns
 */
export const getDownstreamNodePosition = (
  node: Node,
  graph: Graph,
  dx = 250,
  dy = 50,
) => {
  const downstreamNodeIdList: string[] = []
  const edges = graph.getEdges()
  edges.forEach((edge) => {
    const originEdge = edge.toJSON()
    const sourceId = originEdge.source?.cell || originEdge.source
    if (sourceId === node.id) {
      const targetId = originEdge.target?.cell || originEdge.target
      downstreamNodeIdList.push(targetId)
    }
  })
  const position = node.getPosition()
  let minX = Infinity
  let maxY = -Infinity

  graph.getNodes().forEach((graphNode) => {
    if (downstreamNodeIdList.indexOf(graphNode.id) > -1) {
      const nodePosition = graphNode.getPosition()
      const nodeSize = graphNode.getSize()
      if (nodePosition.x < minX) {
        minX = nodePosition.x
      }
      const nodeBottom = nodePosition.y + nodeSize.height
      if (nodeBottom > maxY) {
        maxY = nodeBottom
      }
    }
  })

  return {
    x: minX !== Infinity ? minX : position.x + dx,
    y: maxY !== -Infinity ? maxY + dy : position.y,
  }
}

/**
 * 添加节点
 * @param shape 节点形状
 * @param graph
 * @param node
 * @returns
 */
export const addNodeFromMenu = (
  shape: string,
  graph: Graph,
  node: Node,
  index = 0,
) => {
  const position = getDownstreamNodePosition(node, graph)
  const currentGraph = graph
  if (!currentGraph) return
  // 当前节点确保有 out 端口
  const existingOut = node.getPorts().filter((p) => p.group === 'out')
  const outId = existingOut[index]?.id ?? `${node.id}-out`
  if (existingOut.length === 0) {
    node.addPort({ id: outId, group: 'out' })
  }

  const newId = nanoid(8)
  const ports = [{ id: `${newId}-in`, group: 'in' }]

  // 特殊节点做特殊处理
  if (shape !== 'Map') {
    ports.push({ id: `${newId}-out`, group: 'out' })
  }

  currentGraph.addNode({
    id: newId,
    shape,
    ...position,
    ports,
  })

  // 连接边
  currentGraph.addEdge({
    shape: 'data-processing-curve',
    source: { cell: node.id, port: outId },
    target: { cell: newId, port: `${newId}-in` },
    zIndex: -1,
  })
}

/**
 * 添加路线端口
 * @param node 节点
 * @param graph 图
 * @param group 组
 * @param keyWord 关键字
 * @param position 位置
 * @returns
 */
export const addPort = ({
  node,
  group,
  position,
  data,
}: {
  node: Node
  group: string
  position: { x: number; y: number }
  data?: any
}) => {
  const portId = `${node.id}-${group}-${nanoid(8)}`
  const existingPort = node.getPorts().find((p) => p.id === portId)
  if (!existingPort) {
    node.addPort({
      id: portId,
      group,
      args: position,
      attrs: {
        circle: {
          r: 4,
          magnet: true,
          stroke: '#85A5FF',
          strokeWidth: 1,
          fill: '#fff',
          cursor: 'pointer',
        },
      },
      data,
    })
  }
}

/**
 * 计算输出map节点端口位置
 * @param y 起始y
 * @param index 索引
 * @param dy 间隔
 * @returns
 */
export const getOutPortPosition = (
  node: Node,
  y: number,
  index: number,
  dy: number,
) => {
  const size = node.getSize()
  const portPosition = {
    x: size.width,
    y: y + index * dy,
  }
  return portPosition
}

export const handleDeleteNode = (node: Node, port: string) => {
  node.remove()
  // const ports = node.getPorts()
  // const port = ports.find((p) => p.id === port)
  // if (port) {
  //   node.removePort(port.id)
  // }
}

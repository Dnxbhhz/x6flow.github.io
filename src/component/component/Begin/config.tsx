import Begin from './index'
import type { Node, Graph } from '@antv/x6'

const config = {
  id: 'Begin',
  shape: 'Begin',
  component: ({ node, graph }: { node: Node; graph: Graph }) => {
    return <Begin node={node} graph={graph} />
  },
  x: 100,
  y: 100,
  ports: {
    groups: {
      out: {
        position: {
          name: 'right',
          // args: {
          //   dx: 32,
          // },
        },
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: 'transparent',
            strokeWidth: 1,
            fill: 'transparent',
          },
        },
      },
    },
  },
}

export default config

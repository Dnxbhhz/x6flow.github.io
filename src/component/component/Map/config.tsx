import Map from './index'
import type { Node, Graph } from '@antv/x6'

const config = {
  id: 'Map',
  shape: 'Map',
  component: ({ node, graph }: { node: Node; graph: Graph }) => {
    return <Map node={node} graph={graph} />
  },
  x: 100,
  y: 100,
  ports: {
    groups: {
      in: {
        position: {
          name: 'left',
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
      // out: {
      //   position: {
      //     name: 'right',
      //     // args: {
      //     //   dx: 32,
      //     // },
      //   },
      //   attrs: {
      //     circle: {
      //       r: 4,
      //       magnet: true,
      //       stroke: 'transparent',
      //       strokeWidth: 1,
      //       fill: 'transparent',
      //     },
      //   },
      // },
    },
  },
}

export default config

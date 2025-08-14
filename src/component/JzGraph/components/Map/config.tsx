import type { Graph, Node } from '@antv/x6';
import Map from './index';

const config = {
  id: 'Map',
  shape: 'Map',
  component: ({ node, graph }: { node: Node; graph: Graph }) => {
    return <Map node={node} graph={graph} />;
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
      out: {
        position: 'absolute',
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
};

export default config;

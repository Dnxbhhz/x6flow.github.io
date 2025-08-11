import { type Node, type Graph } from '@antv/x6'
import BaseNode from '../BaseNode'

const Begin = ({ node, graph }: { node: Node; graph: Graph }) => {
  return (
    <BaseNode node={node}>
      <div className="w-[200px] h-[50px] flex items-center justify-center">
        开始
      </div>
    </BaseNode>
  )
}

export default Begin

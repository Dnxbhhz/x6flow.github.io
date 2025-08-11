import { type Node, type Graph } from '@antv/x6'
import BaseNode from '../BaseNode'
import { Form, Select, Button } from 'antd'
import { EyeOutlined } from '@ant-design/icons'

const Map = ({ node, graph }: { node: Node; graph: Graph }) => {
  const mapList = [
    {
      label: 'map1',
      value: 'map1',
    },
    {
      label: 'map2',
      value: 'map2',
    },
  ]

  const openMapDetail = (e: any) => {
    e.stopPropagation()
    console.log('openMapDetail')
  }

  return (
    <BaseNode node={node} showAddMenu={false}>
      <div className="p-2">
        <Form style={{ width: 400 }}>
          <Form.Item label="地图" name="map">
            <Select
              options={mapList}
              fieldNames={{ label: 'label', value: 'value' }}
              optionRender={(option: any) => {
                return (
                  <div className="flex items-center justify-between">
                    <span>{option.label}</span>
                    <Button
                      onClick={openMapDetail}
                      type="link"
                      icon={<EyeOutlined />}>
                      查看
                    </Button>
                  </div>
                )
              }}
            />
          </Form.Item>
        </Form>
      </div>
    </BaseNode>
  )
}

export default Map

import { CloseOutlined, EyeOutlined } from '@ant-design/icons'
import { type Graph, type Node } from '@antv/x6'
import { Button, Flex, Form, Select } from 'antd'
import { useEffect } from 'react'
import { addPort, getOutPortPosition } from '../../utils/node'
import BaseNode from '../BaseNode'

const Map = ({ node, graph }: { node: Node; graph: Graph }) => {
  const [form] = Form.useForm()
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

  // 监听表单值变化
  const onValuesChange = (changedValues: any, allValues: any) => {
    // 获取路线数据
    const routes = allValues?.routes || []
    node.setData({
      ...node.getData(),
      formData: allValues,
      routes: routes,
    })
  }

  // 获取当前表单数据的方法
  const getFormData = () => {
    const values = form.getFieldsValue()
    console.log('获取到的表单数据:', values)
    return values
  }

  // 获取路线数据的方法
  const getRoutes = () => {
    const values = form.getFieldsValue()
    return values?.routes || []
  }

  // 在组件挂载时获取初始数据
  useEffect(() => {
    // const initialData = node.getData();
    // if (initialData?.formData) {
    //   form.setFieldsValue(initialData.formData);
    // } else {
    //   // 如果没有初始数据，设置默认的地图和路线
    //   form.setFieldsValue({
    //     map: 'map1', // 默认选中地图1
    //     routes: [{ name: '路线1' }], // 简化为字符串数组
    //   });
    // }
  }, [])

  return (
    <BaseNode node={node} graph={graph} showAddMenu={false}>
      <div className="py-2 px-4">
        <Form
          form={form}
          layout="vertical"
          style={{ width: 400 }}
          onValuesChange={onValuesChange}>
          <Form.Item label="地图" name="map">
            <Select
              allowClear={true}
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
          <Form.Item label="路线">
            <Form.List name="routes">
              {(subFields, subOpt) => (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    rowGap: 16,
                  }}>
                  {subFields.map((subField) => (
                    <Flex
                      className="w-full relative"
                      gap="small"
                      key={subField.key}>
                      <div className="flex-1 p-2 border border-gray-200 rounded bg-gray-50">
                        {form.getFieldValue(['routes', subField.name, 'name'])}
                      </div>
                      <CloseOutlined
                        onClick={() => {
                          const ports = node
                            .getPorts()
                            .filter((port: any) => port.group === 'out')
                          if (ports.length > 0) {
                            const port = ports[subField.name]
                            // 计算其他端口的位置
                            for (let i = subField.name; i < ports.length; i++) {
                              const item = ports[i]
                              node.setPortProp(item.id as string, 'args', {
                                x: item.args?.x ?? 0,
                                y: (item.args?.y as number) - 56,
                              })
                            }
                            node.removePort(port.id as string)
                          }
                          subOpt.remove(subField.name)
                        }}
                        className="cursor-pointer"
                      />
                    </Flex>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() => {
                      subOpt.add({
                        name: `路线${subFields.length + 1}`,
                      })
                      addPort({
                        node,
                        group: 'out',
                        position: getOutPortPosition(
                          node,
                          145,
                          subFields.length,
                          56,
                        ),
                        data: {
                          index: subFields.length,
                          dy: 56,
                        },
                      })
                    }}
                    block>
                    添加路线
                  </Button>
                </div>
              )}
            </Form.List>
          </Form.Item>
        </Form>
      </div>
    </BaseNode>
  )
}

export default Map

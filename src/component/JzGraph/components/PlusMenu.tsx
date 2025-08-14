import { PlusCircleOutlined } from '@ant-design/icons'
import { Dropdown, type MenuProps } from 'antd'
import type { CSSProperties } from 'react'

interface PlusMenuProps {
  items: NonNullable<MenuProps['items']>
  onClick: NonNullable<MenuProps['onClick']>
  className?: string
  style?: CSSProperties
  placement?: NonNullable<Parameters<typeof Dropdown>[0]['placement']>
  showOnSelected?: boolean
}

export default function PlusMenu({
  items,
  onClick,
  className,
  style,
  placement = 'bottomRight',
  showOnSelected = true,
}: PlusMenuProps) {
  const visibility = showOnSelected
    ? 'invisible [.x6-node-selected_&]:visible'
    : ''
  return (
    <Dropdown
      menu={{ items, onClick }}
      placement={placement}
      trigger={['click']}>
      <PlusCircleOutlined
        className={`absolute z-10 ${visibility} ${className ?? ''}`}
        style={style}
      />
    </Dropdown>
  )
}

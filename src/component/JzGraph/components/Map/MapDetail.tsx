import type { DrawerProps } from 'antd';
import { Drawer } from 'antd';

export interface MapDetailProps extends Omit<DrawerProps, 'open' | 'children'> {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
}

const MapDetail = (props: MapDetailProps) => {
  const { open, onOpenChange, onClose, ...drawerProps } = props;

  const handleClose: DrawerProps['onClose'] = e => {
    onOpenChange?.(false);
    onClose?.(e);
  };

  return (
    <Drawer open={open} onClose={handleClose} {...drawerProps}>
      MapDetail
    </Drawer>
  );
};

export default MapDetail;

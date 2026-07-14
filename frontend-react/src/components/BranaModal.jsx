import { Modal } from 'antd';

export function BranaModal(props) {
  const rootClassName = ['brana-modal-root', props.rootClassName].filter(Boolean).join(' ');
  return <Modal {...props} rootClassName={rootClassName} />;
}

import * as React from 'react';

import Popup from 'reactjs-popup';
import styled from 'styled-components';

export default function Dialog(props: {
  onOpen: () => void;
  onClose: () => void;
  open: boolean;
  children: JSX.Element | JSX.Element[];
}) {
  const { onOpen, onClose, open, children } = props;

  return (
    <Modal onOpen={onOpen} onClose={onClose} open={open} modal lockScroll={true}>
      {children}
    </Modal>
  );
}

const Modal = styled(Popup)`
  &-content {
    border: 0;
    width: 100%;
    max-width: 600px;
    box-shadow: 0px 15px 55px 0 rgba(0, 0, 0, 0.08);
    border-radius: 4px;
    background-color: #fff;
    padding: 2em;
  }
  &-overlay {
    overflow-y: auto;
    background-color: rgba(0, 0, 0, 0.15);
  }
`;

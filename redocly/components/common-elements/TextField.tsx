import * as React from 'react';
import styled from 'styled-components';

export default function TextField(props: { label: string; inputProps: {} }) {
  return (
    <Label>
      <span>{props.label}</span>
      <Input {...props.inputProps} />
    </Label>
  );
}

const Input = styled.input`
  border: 1px solid rgba(0, 0, 0, 0.23);
  padding: 12px;
  border-radius: 4px;
  width: 100%;
  height: 48px;
  display: block;
  outline-color: ${({ theme }) => theme.colors.primary.main};
  transition: outline 0.25s ease;
`;

const Label = styled.label`
  color: ${({ theme }) => theme.colors.text.primary};
  span {
    font-size: 0.9em;
    display: inline-block;
    margin-bottom: 5px;
  }
`;

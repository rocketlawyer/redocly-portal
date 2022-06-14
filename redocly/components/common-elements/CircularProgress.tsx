import * as React from 'react';
import styled from 'styled-components';

interface CircularProgressProps {
  size?: number;
  color?: 'contrast' | 'primary';
}

export default function CircularProgress(props: CircularProgressProps) {
  return (
    <StyledSpinner {...props}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </StyledSpinner>
  );
}

export const StyledSpinner = styled.div<CircularProgressProps>`
  display: inline-block;
  position: relative;
  width: ${({ size }) => size || '60'}px;
  height: ${({ size }) => size || '60'}px;
  div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: ${({ size }) => size || '44'}px;
    height: ${({ size }) => size || '44'}px;
    margin: 0;
    border: 2px solid
      ${({ theme, color }) =>
        color === 'contrast' ? theme.colors.primary.contrastText : theme.colors.primary.main};
    border-radius: 50%;
    animation: ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: ${({ theme, color }) =>
        color === 'contrast' ? theme.colors.primary.contrastText : theme.colors.primary.main}
      transparent transparent transparent;
  }
  div:nth-child(1) {
    animation-delay: -0.45s;
  }
  div:nth-child(2) {
    animation-delay: -0.3s;
  }
  div:nth-child(3) {
    animation-delay: -0.15s;
  }
  @keyframes ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

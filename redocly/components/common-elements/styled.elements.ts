import styled from 'styled-components';

import { Box, Button } from '@redocly/developer-portal/ui';
import { StyledSpinner } from './CircularProgress';

export const Container = styled(Box)`
  max-width: 100%;
  margin-right: auto;
  margin-left: auto;
  padding-left: 15px;
  padding-right: 15px;

  @media only screen and (min-width: ${({ theme }) => theme.breakpoints.small}) {
    padding-left: 30px;
    padding-right: 30px;
  }
  @media only screen and (min-width: ${({ theme }) => theme.breakpoints.medium}) {
    max-width: 1170px;
    padding-left: 15px;
    padding-right: 15px;
  }
`;

export const Paper = styled(Box)`
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0px 10px 30px 0px rgba(35, 35, 35, 0.1);
`;

export const Table = styled.table`
  border-collapse: collapse;
  border-spacing: 0;
  width: 100%;
  @media only screen and (max-width: ${({ theme }) => theme.breakpoints.small}) {
    thead {
      display: none;
    }
    tbody {
      width: 100%;
    }
    td {
      padding-left: 0;
      padding-right: 0;
    }
  }
`;

export const TableHead = styled.th<{ align?: 'right' | 'left' | 'center' }>`
  border-bottom: 1px solid #e0e0e0;
  padding: 6px 12px;
  text-align: ${({ align }) => align || 'left'};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: ${({ theme }) => theme.typography.fontWeightRegular};
  font-size: 0.75em;
  text-transform: uppercase;
`;

export const TableCell = styled.td<{ align?: 'right' | 'left' | 'center' }>`
  padding: 12px;
  text-align: ${({ align }) => align || 'left'};
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const StyledButton = styled(Button)`
  outline: 0;
  position: relative;
  ${StyledSpinner} {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  &:disabled {
    background-color: rgba(0, 0, 0, 0.12);
    border-color: transparent;
    color: rgba(0, 0, 0, 0.26);
    pointer-events: none;
  }
`;

export const IconButton = styled.button`
  border: 0;
  background-color: transparent;
  padding: 4px;
  margin: 0;
  margin-left: 4px;
  cursor: pointer;
  outline: 0;
  &:disabled {
    opacity: 0.5;
    pointer-events: none;
  }
`;

export const MenuItemButton = styled.button`
  display: inline-block;
  color: ${({ theme }) => theme.colors.text.primary};
  padding: 0.5em 1em;
  cursor: pointer;
  width: 100%;
  background-color: transparent;
  border: 0;
  outline: 0;
  text-align: left;
  &:disabled {
    opacity: 0.5;
    pointer-events: none;
  }
`;

export const SimpleButton = styled.button`
  background-color: transparent;
  border: 0;
  outline: 0;
  text-align: left;
  color: ${({ theme }) => theme.colors.primary.main};
  cursor: pointer;
  border-bottom: 1px solid ${({ theme }) => theme.colors.primary.main};
  padding: 0;
  transition: opacity 0.25s ease;
  + button {
    margin-left: 12px;
  }
  &:hover {
    opacity: 0.75;
  }
`;

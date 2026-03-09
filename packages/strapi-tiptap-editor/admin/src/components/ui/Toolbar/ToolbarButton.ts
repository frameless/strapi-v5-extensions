import { styled } from 'styled-components';
import { IconButton, IconButtonGroup } from '@strapi/design-system';

type ToolbarButtonProps = {
  active: boolean;
  disabled?: boolean;
};

export const ToolbarIconButtonGroup = styled(IconButtonGroup)`
  border-width: 0.25em;
  border-style: solid;
  border-color: ${({ theme }) => theme.colors.neutral100};
`;

export const ToolbarButton = styled(IconButton)<ToolbarButtonProps>`
  color: ${({ active, theme }) => (active ? theme.colors.primary600 : theme.colors.neutral1000)};
  background: ${({ theme, active }) => (active ? theme.colors.primary100 : theme.colors.neutral0)};
  display: flex;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizes[4]};
  &:hover {
    background: ${({ theme }) => theme.colors.neutral150};
  }
`;

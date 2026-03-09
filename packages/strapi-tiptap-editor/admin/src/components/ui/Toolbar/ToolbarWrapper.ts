import styled from 'styled-components';

export const ToolbarWrapper = styled.div`
  background: ${({ theme }) => theme.colors.neutral100};
  display: flex;
  flex-wrap: wrap;
  row-gap: ${({ theme }) => theme.spaces[1]};
  column-gap: ${({ theme }) => theme.spaces[2]};
  margin-block-end: ${({ theme }) => theme.spaces[2]};
`;

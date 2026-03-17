import { Heading } from '@utrecht/component-library-react';
import kebabCase from 'lodash.kebabcase';
import styled from 'styled-components';

import { LogoButton, LogoButtonProps } from '../LogoButton';

export type Columns = {
  title?: string;
  logoButton: LogoButtonProps[];
};
export interface MultiColumnsButtonProps {
  columns: Columns[];
}

const ColumnsContainer = styled.div`
  column-count: 1;
  column-gap: 2rem;
  inline-size: 100%;
  @media (min-width: 600px) {
    column-count: 2;
    column-rule: var(--utrecht-multi-columns-buttons-divider-width) solid
      var(--utrecht-multi-columns-button-divider-color);
  }
  }
    
`;

const ColumnItem = styled.div`
  break-inside: avoid;
  -webkit-column-break-inside: avoid;
  display: grid;
  gap: 8px;
  padding-block-end: var(--utrecht-space-block-xs);
  padding-block-start: var(--utrecht-space-block-xs);
  padding-inline-end: var(--utrecht-space-inline-xs);
  padding-inline-start: var(--utrecht-space-inline-xs);

  @media (min-width: 600px) {
    /* override mobile vars */
    --utrecht-multi-columns-button-item-mobile-padding-inline-start: var(--utrecht-space-inline-lg);
    --utrecht-multi-columns-button-item-mobile-padding-inline-end: var(--utrecht-space-inline-lg);
    --utrecht-multi-columns-button-item-mobile-padding-block-start: var(--utrecht-space-block-lg);
    --utrecht-multi-columns-button-item-mobile-padding-block-end: var(--utrecht-space-block-lg);

    &:first-child {
      border-inline-end-color: var(--utrecht-color-grey-90);
      border-inline-end-style: solid;
      border-inline-end-width: 1px;
    }

    &:last-child {
      border-inline-start-color: transparant;
      border-inline-start-width: 0;
    }
  }
`;

export const MultiColumnsButton = ({ columns }: MultiColumnsButtonProps) => {
  if (!columns?.length) return null;

  return (
    <ColumnsContainer>
      {columns.map(({ logoButton, title }, index: number) => (
        <ColumnItem key={index}>
          {title && <Heading level={3}>{title}</Heading>}

          {logoButton?.map((item: any, index: number) => {
            if (item.openFormsEmbed) {
              const params = new URLSearchParams(item.openFormsEmbed);
              const slug = params.get('slug');
              const uuid = params.get('uuid');
              const label = params.get('label');

              return (
                <LogoButton
                  headingLevel={title ? 4 : 3}
                  key={uuid}
                  appearance={item?.appearance as string}
                  label={item.label}
                  logo={item.logo}
                  href={`/form/${slug}`}
                >
                  {item.textContent || label}
                </LogoButton>
              );
            }

            return (
              <LogoButton
                headingLevel={title ? 4 : 3}
                key={index}
                href={item.href}
                appearance={kebabCase(item.appearance)}
                label={item.label}
                logo={item.logo}
              >
                {item.textContent}
              </LogoButton>
            );
          })}
        </ColumnItem>
      ))}
    </ColumnsContainer>
  );
};

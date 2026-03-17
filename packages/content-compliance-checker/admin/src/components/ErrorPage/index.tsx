import type { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from 'react';
import { Flex, Typography } from '@strapi/design-system';

import { GoBackButton } from '../GoBackButton';

interface ErrorPageProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
  buttonText?: string;
}

export const ErrorPage = ({ children, buttonText, ...restProps }: PropsWithChildren<ErrorPageProps>) => (
  <main {...restProps}>
    <Flex direction="column" gap={4}>
      <Typography variant="alpha" textColor="danger600">
        {children}
      </Typography>
      {buttonText && <GoBackButton>{buttonText}</GoBackButton>}
    </Flex>
  </main>
);

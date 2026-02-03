import { Box } from '@strapi/design-system';
import { StatusBadge as UtrechtStatusBadge } from '@utrecht/component-library-react';
import type { StatusBadgeProps as UtrechtStatusBadgeProps } from '@utrecht/component-library-react';
import { forwardRef } from 'react';
import type { ForwardedRef, PropsWithChildren } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';

import usePluginConfig from '../../hooks/use-plugin-config';
import { getTranslation } from '../../utils/getTranslation';

interface StatusBadgeProps extends UtrechtStatusBadgeProps {
  gap?: boolean;
}

const StyledStatusBadge = styled(UtrechtStatusBadge)`
  max-inline-size: 100%;
  inline-size: 100%;
`;

export const StatusBadge = forwardRef(
  ({ gap, ...resProps }: PropsWithChildren<StatusBadgeProps>, ref: ForwardedRef<HTMLSpanElement>) => {
    const { formatMessage } = useIntl();
    const { config } = usePluginConfig();

    const regex = /^(development|acceptance)$/;

    if (!config?.env_label || !regex.test(config.env_label)) return null;

    return (
      <Box
        display="flex"
        width="100%"
        textAlign="center"
        className="utrecht-theme test"
        marginTop={gap ? 5 : undefined}
        marginBottom={gap ? 5 : undefined}
      >
        <StyledStatusBadge ref={ref} status="warning" {...resProps}>
          {formatMessage({
            id: getTranslation(`${config?.env_label}-env-label-message`),
            defaultMessage: `${config?.env_label}`,
          })}
        </StyledStatusBadge>
      </Box>
    );
  },
);

StatusBadge.displayName = 'StatusBadge';

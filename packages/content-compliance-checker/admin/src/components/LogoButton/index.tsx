import { ButtonGroup, ButtonLink, ButtonProps, Heading } from '@utrecht/component-library-react';
import {
  UtrechtDigidLogo,
  UtrechtEherkenningLogo,
  UtrechtEidasLogo,
  UtrechtIconArrow,
  UtrechtLogoButton,
} from '@utrecht/web-component-library-react';
import kebabCase from 'lodash.kebabcase';
import styled from 'styled-components';
import { ReactNode } from 'react';
import { Flex } from '@strapi/design-system';

export type LogoType = 'digid' | 'eherkenning' | 'eidas' | 'without_logo';

type AppearanceType = (ButtonProps['appearance'] & 'magenta') | undefined;

export interface LogoButtonProps {
  logo?: LogoType | null;
  appearance?: AppearanceType;
  href: string;
  children: ReactNode;
  label?: string | null;
  headingLevel?: number;
}
const MagentaButton = styled(ButtonLink)<{ $magenta?: boolean }>`
  &.utrecht-button-link {
    ${({ $magenta }) =>
      $magenta &&
      `
      --utrecht-button-primary-action-focus-border-color: var(--utrecht-color-grey-10);
      --utrecht-button-primary-action-active-border-color: var(--utrecht-color-grey-10);
      --utrecht-button-primary-action-active-color: var(--utrecht-color-white);
      --utrecht-button-primary-action-background-color: #bc3983;
      --utrecht-button-primary-action-active-background-color: #bc3983;
      --utrecht-button-primary-action-hover-background-color: #bc3983;
      --utrecht-button-primary-action-focus-background-color: #bc3983;
      --utrecht-button-primary-action-pressed-background-color: #bc3983;
    `}
  }
`;

export const LogoButton = ({ logo, appearance, href, children, label, headingLevel = 3 }: LogoButtonProps) => {
  const magenta = appearance === 'magenta';
  switch (logo) {
    case 'digid':
      return (
        <Flex gap={3} direction="column" alignItems="flex-start">
          {label && <Heading level={headingLevel}>{label}</Heading>}
          <ButtonGroup>
            <UtrechtLogoButton>
              <UtrechtDigidLogo role="presentation" />
              <ButtonLink appearance={kebabCase(appearance) as unknown as AppearanceType} href={href}>
                {children} <UtrechtIconArrow />
              </ButtonLink>
            </UtrechtLogoButton>
          </ButtonGroup>
        </Flex>
      );
    case 'eherkenning':
      return (
        <Flex gap={3} direction="column" alignItems="flex-start">
          {label && <Heading level={headingLevel}>{label}</Heading>}
          <ButtonGroup>
            <UtrechtLogoButton>
              <UtrechtEherkenningLogo role="presentation" />
              <MagentaButton appearance="primary-action-button" href={href} $magenta={magenta}>
                {children} <UtrechtIconArrow />
              </MagentaButton>
            </UtrechtLogoButton>
          </ButtonGroup>
        </Flex>
      );
    case 'eidas':
      return (
        <Flex gap={3} direction="column" alignItems="flex-start">
          {label && <Heading level={headingLevel}>{label}</Heading>}
          <ButtonGroup>
            <UtrechtLogoButton>
              <UtrechtEidasLogo role="presentation" />
              <ButtonLink appearance={kebabCase(appearance) as unknown as AppearanceType} href={href}>
                {children} <UtrechtIconArrow />
              </ButtonLink>
            </UtrechtLogoButton>
          </ButtonGroup>
        </Flex>
      );
    case 'without_logo':
      return (
        <Flex gap={3} direction="column" alignItems="flex-start">
          {label && <Heading level={headingLevel}>{label}</Heading>}
          <ButtonGroup>
            <MagentaButton
              $magenta={magenta}
              appearance={magenta ? 'primary-action-button' : (kebabCase(appearance) as unknown as AppearanceType)}
              href={href}
            >
              {children} <UtrechtIconArrow />
            </MagentaButton>
          </ButtonGroup>
        </Flex>
      );
    default:
      return null;
  }
};

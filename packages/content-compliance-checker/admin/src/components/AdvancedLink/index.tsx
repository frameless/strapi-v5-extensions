import { Link as UtrechtLink } from '@utrecht/component-library-react';
import { UtrechtIconArrow, UtrechtIconChevronLeft } from '@utrecht/web-component-library-react';
import React, { ComponentType, ForwardedRef, forwardRef, PropsWithChildren } from 'react';
import styled, { css } from 'styled-components';

interface AdvancedLinkProps extends React.ComponentProps<typeof UtrechtLink> {
  color?: 'red';
  icon?: 'arrow' | 'chevronLeft';
  Link?: ComponentType<any>;
}

const mappedIcons = {
  arrow: UtrechtIconArrow,
  chevronLeft: UtrechtIconChevronLeft,
};

const StyledIcon = styled.span`
  margin-inline-end: var(--utrecht-advanced-link-icon-margin-inline-end);
`;

const StyledLink = styled(UtrechtLink)<{
  $withIcon?: boolean;
  $colorRed?: boolean;
}>`
  --utrecht-link-icon-size: var(--utrecht-advanced-link-icon-size, var(--utrecht-document-font-size));

  ${({ $withIcon }) =>
    $withIcon &&
    css`
      --utrecht-link-text-decoration: var(--utrecht-advanced-link-with-icon-text-decoration);
      --utrecht-link-hover-text-decoration-thickness: var(--utrecht-advanced-link-with-icon-text-decoration-thickness);

      align-items: center;
      display: flex;
      width: fit-content;
    `}

  ${({ $colorRed }) =>
    $colorRed &&
    css`
      --utrecht-link-active-color: var(--utrecht-advanced-link-color-active-color-red);
      --utrecht-link-color: var(--utrecht-advanced-link-color-color-red);
      --utrecht-link-focus-color: var(--utrecht-advanced-link-color-focus-color-red);
      --utrecht-link-hover-color: var(--utrecht-advanced-link-color-hover-color-red);
      --utrecht-link-visited-color: var(--utrecht-advanced-link-color-visited-color-red);
    `}
`;

export const AdvancedLink = forwardRef(
  (
    { href, children, icon, color, Link = UtrechtLink, ...restProps }: PropsWithChildren<AdvancedLinkProps>,
    ref: ForwardedRef<HTMLAnchorElement>,
  ) => {
    const Icon = icon ? mappedIcons[icon as keyof typeof mappedIcons] : null;
    const LinkComponent = Link || UtrechtLink;

    return (
      <StyledLink
        as={LinkComponent}
        ref={ref}
        href={href}
        $withIcon={!!icon}
        $colorRed={color === 'red'}
        {...restProps}
      >
        {Icon && <StyledIcon as={Icon} />}
        {children}
      </StyledLink>
    );
  },
);

AdvancedLink.displayName = 'AdvancedLink';

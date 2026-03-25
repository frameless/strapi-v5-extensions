import { Route, Routes, NavLink } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { styled } from 'styled-components';
import { Box, Flex, SubNav as DSSubNav, Typography } from '@strapi/design-system';
import { Filter, Information } from '@strapi/icons';
import { QueryClientProvider } from '@tanstack/react-query';
import '@utrecht/component-library-css/dist/html.css';

import AdditionalInformationDetailPage from '../AdditionalInformationDetailPage';
import AdditionalInformationFilterPage from '../AdditionalInformationFilterPage';
import ProductDetailPage from '../ProductDetailPage';
import ProductFilterPage from '../ProductFilterPage';
import getTrad from '../../utils/getTrad';
import { queryClient } from '../../utils/queryClient';
import { getLocalStorage } from '../../utils/getLocalStorage';

const MainSubNav = styled(DSSubNav)`
  flex: 0 0 250px; /* fixed width for sidebar */
  height: 100%; /* full height of parent flex container */
  overflow-y: auto;
  background-color: ${({ theme }) => theme.colors?.neutral0 || '#ffffff'};
  display: flex;
  flex-direction: column;
  border-right: 1px solid ${({ theme }) => theme.colors?.neutral150 || '#e0e0e0'};
  box-shadow: none;
  position: relative;
`;

const StyledLink = styled(NavLink)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-decoration: none;
  height: 32px;
  color: ${({ theme }) => theme.colors?.neutral800 || '#333333'};
  border: none;
  background: none;
  cursor: pointer;
  font-family: inherit;

  &.active > div {
    background-color: ${({ theme }) => theme.colors?.primary100 || '#f0f7ff'};
    color: ${({ theme }) => theme.colors?.primary700 || '#0066cc'};
    font-weight: 500;
  }

  &:hover.active > div {
    background-color: ${({ theme }) => theme.colors?.primary100 || '#f0f7ff'};
  }

  &:hover > div {
    background-color: ${({ theme }) => theme.colors?.neutral100 || '#f5f5f5'};
  }

  &:focus-visible {
    outline-offset: -2px;
  }
`;

const LinkContent = styled(Box)`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaces?.[3] || '12px'};
  padding: ${({ theme }) => `${theme.spaces?.[2] || '8px'} ${theme.spaces?.[3] || '12px'}`};
  border-radius: ${({ theme }) => theme.borderRadius || '4px'};
  transition: background-color 0.2s ease;
`;

const MainContainer = styled(Box)`
  display: flex;
  width: 100%;
  height: 100vh; /* full viewport height */
  align-items: start;
`;

const NavHeader = styled(Box)`
  flex: 0 0 auto;
  padding: ${({ theme }) => theme.spaces?.[5] || '18px'};
  border-bottom: 1px solid ${({ theme }) => theme.colors?.neutral150 || '#e0e0e0'};

  h2 {
    margin: 0;
  }
`;

const NavSections = styled(Box)`
  flex: 1 1 auto;
  overflow-y: auto;
  padding: ${({ theme }) => `${theme.spaces?.[3] || '12px'} 0`};

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors?.neutral300 || '#d0d0d0'};
    border-radius: 4px;

    &:hover {
      background: ${({ theme }) => theme.colors?.neutral400 || '#a0a0a0'};
    }
  }
`;

const NavSection = styled(Box)`
  padding: ${({ theme }) => `${theme.spaces?.[3] || '12px'} ${theme.spaces?.[5] || '18px'}`};

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors?.neutral150 || '#e0e0e0'};
  }

  h3 {
    margin: 0 0 ${({ theme }) => theme.spaces?.[3] || '12px'} 0;
    font-size: ${({ theme }) => theme.fontSizes?.[1] || '14px'};
    font-weight: ${({ theme }) => theme.fontWeights?.semiBold || 600};
    color: ${({ theme }) => theme.colors?.neutral600 || '#666666'};
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const NavLinksList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaces?.[2] || '8px'};
`;

const MainContent = styled(Box)`
  flex: 1; /* take remaining space */
  overflow-y: auto;
  background-color: ${({ theme }) => theme.colors?.neutral100 || '#f9f9f9'};
  padding: ${({ theme }) => theme.spaces?.[5] || '18px'};

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors?.neutral300 || '#d0d0d0'};
    border-radius: 4px;

    &:hover {
      background: ${({ theme }) => theme.colors?.neutral400 || '#a0a0a0'};
    }
  }
`;

interface LinkProps {
  to: string;
  label: string;
  icon: React.ReactNode;
}

const Link = ({ to, label, icon }: LinkProps) => {
  return (
    <StyledLink to={to} end={to === ''}>
      <LinkContent padding={0}>
        {icon}
        <Typography tag="span" variant="pi" style={{ whiteSpace: 'nowrap' }}>
          {label}
        </Typography>
      </LinkContent>
    </StyledLink>
  );
};

type Theme = 'light' | 'dark' | 'system';

const isValidTheme = (theme: Theme): theme is Theme => ['light', 'dark', 'system'].includes(theme);
// Main App Component with Routing Diagnostics
export const App = () => {
  const { formatMessage } = useIntl();
  const localStorageTheme = getLocalStorage('STRAPI_THEME', isValidTheme);
  const prefersDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDarkMode = localStorageTheme === 'dark' || (localStorageTheme === 'system' && prefersDark);
  const navItems = [
    {
      to: '',
      label: formatMessage({
        id: getTrad('navigation.link.productFilters'),
        defaultMessage: 'Productfilters',
      }),
      icon: <Filter width={16} height={16} />,
    },
    {
      to: 'additional-information-filter',
      label: formatMessage({
        id: getTrad('navigation.link.additionalInfoFilters'),
        defaultMessage: 'Aanvullende informatiefilters',
      }),
      icon: <Information width={16} height={16} />,
    },
  ];

  return (
    <div className={`utrecht-theme utrecht-document ${isDarkMode ? 'utrecht-theme--color-scheme-dark' : ''}`}>
      <QueryClientProvider client={queryClient}>
        <MainContainer>
          <Flex height="100%" width="100%" alignItems="flex-start">
            <MainSubNav>
              <NavHeader>
                <Typography variant="beta" tag="h2">
                  {formatMessage({
                    id: getTrad('navigation.header'),
                    defaultMessage: 'Controle op inhoudsnaleving',
                  })}
                </Typography>
              </NavHeader>

              <NavSections>
                <NavSection>
                  <h3>
                    {formatMessage({
                      id: getTrad('navigation.section.filters'),
                      defaultMessage: 'Filters',
                    })}
                  </h3>
                  <NavLinksList>
                    {navItems.map((item) => (
                      <li key={item.to}>
                        <Link to={item.to} label={item.label} icon={item.icon} />
                      </li>
                    ))}
                  </NavLinksList>
                </NavSection>
              </NavSections>
            </MainSubNav>

            <MainContent>
              <Routes>
                <Route index element={<ProductFilterPage />} />
                <Route path="product-filter/:id" element={<ProductDetailPage />} />
                <Route path="additional-information-filter" element={<AdditionalInformationFilterPage />} />
                <Route path="additional-information-filter/:id" element={<AdditionalInformationDetailPage />} />
                <Route path="*" element={<h1>Page is not found</h1>} />
              </Routes>
            </MainContent>
          </Flex>
        </MainContainer>
      </QueryClientProvider>
    </div>
  );
};

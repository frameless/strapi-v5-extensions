import { Flex } from '@strapi/design-system';
import { FiList, FiUserCheck, FiMapPin } from 'react-icons/fi';

const IconWrapper = ({ children }: { children: React.ReactNode }) => (
  <Flex
    justifyContent="center"
    alignItems="center"
    width={12}
    height={12}
    hasRadius
    aria-hidden
    color="primary600"
    background="primary100"
    padding={2}
  >
    {children}
  </Flex>
);

export const UPLIcon = () => (
  <IconWrapper>
    <FiList fill="currentColor" />
  </IconWrapper>
);
export const AuthorityIcon = () => (
  <IconWrapper>
    <FiUserCheck fill="currentColor" />
  </IconWrapper>
);

export const GemeenteIcon = () => (
  <IconWrapper>
    <FiMapPin fill="currentColor" />
  </IconWrapper>
);

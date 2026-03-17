import { Flex } from '@strapi/design-system';
import { TbFilterCheck } from 'react-icons/tb';

export const PluginIcon = () => (
  <Flex justifyContent="center" alignItems="center" fontSize="20px" hasRadius aria-hidden>
    <TbFilterCheck color="primary600" />
  </Flex>
);

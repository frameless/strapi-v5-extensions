import { Flex } from '@strapi/design-system';
import { Earth } from '@strapi/icons';

export const LanguageFieldIcon = () => {
  return (
    <Flex justifyContent="center" alignItems="center" width={7} height={6} hasRadius aria-hidden>
      <Earth fill="primary600" />
    </Flex>
  );
};

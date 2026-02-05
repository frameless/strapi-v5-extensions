import { Flex } from '@strapi/design-system';
import { User } from '@strapi/icons';

const ComboboxIcon = () => {
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      width={7}
      height={6}
      borderColor="primary200"
      background="primary100"
      hasRadius
      aria-hidden
    >
      <User fill="primary600" />
    </Flex>
  );
};

export default ComboboxIcon;

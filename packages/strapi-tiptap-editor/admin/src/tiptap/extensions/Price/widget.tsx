import { NodeViewWrapper } from '@tiptap/react';
import type { NodeViewWrapperProps, ReactNodeViewProps } from '@tiptap/react';
import type { PropsWithChildren } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { Loader } from '@strapi/design-system';

import { formatCurrency, isFreeProduct, getTranslation } from '../../../utils';
import { usePriceStore } from '../../../utils/usePriceStore';

const StyledPriceWidgetWrapper = styled(NodeViewWrapper)`
  display: inline-block;
  border: 1px dashed ${({ theme }) => theme.colors.neutral400};
  border-radius: 4px;
  padding: ${({ theme }) => theme.spaces[1]};
  background-color: ${({ theme }) => theme.colors.primary100};
  margin-inline: ${({ theme }) => theme.spaces[1]};
  user-select: none;
  &:hover {
    border-color: ${({ theme }) => theme.colors.neutral1000};
  }
`;

const PriceWidgetWrapper = ({ children }: PropsWithChildren<NodeViewWrapperProps>) => (
  <StyledPriceWidgetWrapper contentEditable={false}>{children}</StyledPriceWidgetWrapper>
);

const PriceWidget = ({ node }: ReactNodeViewProps<HTMLElement>) => {
  const { formatMessage } = useIntl();
  const { prices, status } = usePriceStore();

  if (status === 'loading')
    return (
      <PriceWidgetWrapper>
        <Loader small />
      </PriceWidgetWrapper>
    );
  if (status === 'error' || !prices)
    return (
      <PriceWidgetWrapper>
        {formatMessage({
          id: getTranslation('components.priceWidget.priceUnknown'),
          defaultMessage: '€ #,##0 (price unknown)',
        })}
      </PriceWidgetWrapper>
    );

  const price = prices.find((p) => p.uuid === node.attrs['data-strapi-idref']);
  if (!price)
    return (
      <PriceWidgetWrapper>
        {formatMessage({
          id: getTranslation('components.priceWidget.priceUnknown'),
          defaultMessage: '€ #,##0 (price unknown)',
        })}
      </PriceWidgetWrapper>
    );
  return (
    <PriceWidgetWrapper>
      {isFreeProduct(price.value)
        ? formatMessage({ id: getTranslation('common.words.freeProduct'), defaultMessage: 'free' })
        : formatCurrency(price)}
    </PriceWidgetWrapper>
  );
};

export default PriceWidget;

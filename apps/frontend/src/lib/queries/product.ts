import { gql } from 'graphql-request';

export const GET_PRODUCT_BY_SLUG = gql`
  query getProductsBySlug($slug: String, $status: PublicationStatus) {
    products(filters: { slug: { eq: $slug } }, status: $status) {
      documentId
      title
      slug
      content {
        content
        kennisartikelCategorie
      }
      contact_information_public {
        contentBlock {
          content
        }
        documentId
      }
      sections {
        ... on ComponentComponentsContactInformationPublic {
          __typename
          contact_information_public {
            contentBlock {
              content
              id
            }
          }
        }
        ... on ComponentComponentsUtrechtAccordion {
          item {
            body
            headingLevel
            label
            id
          }
        }
        ... on ComponentComponentsUtrechtImage {
          __typename
          imageData {
            name
            alternativeText
            caption
            width
            height
            formats
            url
          }
        }
        ... on ComponentComponentsUtrechtLink {
          href
          icon
          id
          textContent
        }
        ... on ComponentComponentsUtrechtLogoButton {
          __typename
          appearance
          href
          label
          logo
          textContent
        }
        ... on ComponentComponentsUtrechtMultiColumnsButton {
          __typename
          column {
            id
            title
            logoButton {
              __typename
              appearance
              href
              label
              logo
              textContent
            }
          }
        }
        ... on ComponentComponentsUtrechtRichText {
          __typename
          content
        }
        ... on ComponentComponentsUtrechtSpotlight {
          __typename
          content
          type
          logoButton {
            id
            label
            href
            textContent
            logo
            appearance
            __typename
          }
        }
      }
    }
  }
`;

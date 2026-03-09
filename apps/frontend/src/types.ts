export type RichText = {
  content: string;
};
export type LogoVariant = 'digid' | 'eherkenning' | 'eidas' | 'without_logo';

export type LogoButton = {
  __typename: 'ComponentComponentsUtrechtLogoButton';
  appearance: string;
  href: string;
  label?: string;
  textContent?: string;
  logo?: LogoVariant;
};

/* -----------------------------
   Section types
------------------------------ */

export type UtrechtRichTextSection = {
  __typename: 'ComponentComponentsUtrechtRichText';
  content: string;
};

export type UtrechtSpotlightSection = {
  __typename: 'ComponentComponentsUtrechtSpotlight';
  content: string;
  type?: string;
  logoButton?: LogoButton[];
};

export type UtrechtMultiColumnsButtonSection = {
  __typename: 'ComponentComponentsUtrechtMultiColumnsButton';
  column: {
    id: string;
    title: string;
    logoButton: LogoButton[];
  }[];
};

export type ContactInformationPublicSection = {
  __typename: 'ComponentComponentsContactInformationPublic';
  contact_information_public: {
    contentBlock: {
      id?: string;
      content: string;
    }[];
  };
};

export type UtrechtImageSection = {
  __typename: 'ComponentComponentsUtrechtImage';
  imageData: {
    url: string;
    alternativeText?: string | null;
    width?: number;
    height?: number;
  };
};

/**
 * Accordion-like section (no __typename in your JSON)
 */
export type AccordionSection = {
  item: {
    id: string;
    label: string;
    headingLevel: number;
    body: string;
  }[];
};

/**
 * Catch-all for empty / unknown sections
 */
export type UnknownSection = Record<string, never>;

/**
 * Union of all supported sections
 */
export type Section =
  | UtrechtRichTextSection
  | LogoButton
  | UtrechtSpotlightSection
  | UtrechtMultiColumnsButtonSection
  | ContactInformationPublicSection
  | UtrechtImageSection
  | AccordionSection
  | UnknownSection;

/* -----------------------------
   Product & API response
------------------------------ */

export type Product = {
  documentId: string;
  title: string;
  slug: string;
  content: RichText;
  contact_information_public?: {
    contentBlock: RichText[];
  };
  sections: Section[];
};

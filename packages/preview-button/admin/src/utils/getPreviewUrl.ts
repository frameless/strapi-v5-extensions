interface GetPreviewUrlProps {
  url: URL | null;
  secret: string;
  apiToken?: string;
  type: string;
  slug: string;
  locale: string;
  uuid?: string;
  status?: string;
}

export const getPreviewUrl = ({
  url,
  secret,
  type,
  slug,
  locale,
  apiToken,
  uuid,
  status,
}: GetPreviewUrlProps): URL | null => {
  if (url) {
    url.searchParams.set('secret', secret);
    url.searchParams.set('apiToken', apiToken || '');
    url.searchParams.set('type', type);
    url.searchParams.set('slug', slug);
    url.searchParams.set('locale', locale);
    url.searchParams.set('status', status ?? 'DRAFT');
    if (uuid) {
      url.searchParams.set('uuid', uuid);
    }
  }
  return url;
};

import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug');
  const type = searchParams.get('type');
  const status = searchParams.get('status');
  const locale = searchParams.get('locale') ?? 'en';

  if (secret !== process.env.PREVIEW_SECRET_TOKEN) {
    return new Response('Invalid token', { status: 401 });
  }

  if (!slug || !type) {
    return new Response('Missing parameters', { status: 422 });
  }

  (await draftMode()).enable();

  redirect(`/${type}/${slug}?status=${status}&locale=${locale}`);
}

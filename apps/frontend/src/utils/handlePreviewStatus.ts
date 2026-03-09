import { draftMode } from 'next/headers';

export const mappedStatus = {
  draft: 'DRAFT',
  published: 'PUBLISHED',
} as const;

export const handlePreviewStatus = async (status: string) => {
  const { isEnabled } = await draftMode();
  const fullbackStatus = isEnabled ? 'DRAFT' : 'PUBLISHED';
  return mappedStatus[status as keyof typeof mappedStatus] || fullbackStatus;
};

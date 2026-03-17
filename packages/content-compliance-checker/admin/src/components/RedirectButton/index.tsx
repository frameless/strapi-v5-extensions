import { Button } from '@strapi/design-system';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
interface RedirectButtonProps {
  children?: ReactNode;
  redirectTo: string;
}

export const RedirectButton = ({ children, redirectTo }: RedirectButtonProps) => {
  const navigate = useNavigate();
  return (
    <Button onClick={() => navigate(redirectTo)} style={{ marginTop: '20px' }}>
      {children}
    </Button>
  );
};

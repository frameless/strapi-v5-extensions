import { Button } from '@strapi/design-system';
import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface GoBackButtonProps {
  children?: ReactNode;
}

export const GoBackButton = ({ children }: GoBackButtonProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/admin';

  return (
    <Button onClick={() => navigate(from)} style={{ marginTop: '20px' }}>
      {children}
    </Button>
  );
};

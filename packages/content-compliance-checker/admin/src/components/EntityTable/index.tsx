import { Box, Table, Tbody, Td, Th, Thead, Tr, Typography } from '@strapi/design-system';

import { RedirectButton } from '../RedirectButton';

const getNestedValue = (obj: any, path: string): any => {
  const keys = path.split('.');
  let current = obj;

  for (const key of keys) {
    if (current === null || current === undefined) {
      return undefined;
    }

    if (key === 'length') {
      return Array.isArray(current) ? current.length : undefined;
    }

    current = current[key];
  }

  return current;
};

interface Data {
  id: string | number;
  documentId: string;
  [key: string]: any;
}

interface EntityTableProps {
  headers: string[];
  data: Data[];
  dataKeys: string[];
  redirectBasePath: string;
  redirectLabel?: string;
  actionHeader?: string;
}

export const EntityTable: React.FC<EntityTableProps> = ({
  headers,
  data,
  dataKeys,
  redirectBasePath,
  redirectLabel = 'Bekijk details',
  actionHeader = 'Acties',
}) => {
  if (!data || data.length === 0) {
    return (
      <Box padding={8}>
        <Typography textColor="neutral600">Geen gegevens beschikbaar</Typography>
      </Box>
    );
  }

  // Determine which ID to use (documentId preferred in Strapi v5, fallback to id)
  const getRowId = (item: Data) => item.documentId || item.id;

  return (
    <Box padding={8}>
      <Table colCount={headers.length + 1} rowCount={data.length + 1}>
        <Thead>
          <Tr>
            {headers.map((header, index: number) => (
              <Th key={`header-${index}`}>{header}</Th>
            ))}
            <Th>{actionHeader}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((item, rowIndex) => {
            const rowId = getRowId(item);
            return (
              <Tr key={`row-${rowIndex}-${rowId}`}>
                {dataKeys.map((key, colIndex: number) => {
                  const value = getNestedValue(item, key);

                  return (
                    <Td key={`cell-${rowIndex}-${colIndex}`}>
                      <Typography>{value !== undefined && value !== null ? String(value) : '—'}</Typography>
                    </Td>
                  );
                })}
                <Td>
                  <RedirectButton redirectTo={`${redirectBasePath}/${rowId}`}>{redirectLabel}</RedirectButton>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Box>
  );
};

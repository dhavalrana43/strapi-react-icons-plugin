// src/plugins/strapi-react-icons-plugin/admin/src/pages/HomePage.tsx
import { useEffect, useState, useMemo } from 'react';
import { useFetchClient } from '@strapi/strapi/admin';
import {
  Main,
  Button,
  IconButton,
  Checkbox,
  Table,
  Box,
  Flex,
  Typography,
  VisuallyHidden,
} from '@strapi/design-system';
import { Trash } from '@strapi/icons';
import { Navigate } from 'react-router-dom';
import { useIntl } from 'react-intl';
import * as ReactIcons from '../all';
import { getTranslation } from '../utils/getTranslation';
import usePermissions from '../hooks/usePermissions';

interface IIconLibrary {
  id: string;
  name: string;
  abbreviation: string;
  isEnabled: boolean;
}

const HomePage = () => {
  const { formatMessage } = useIntl();
  const { canRead, loading } = usePermissions();
  const { get, put, del, post } = useFetchClient();
  const [iconLibraries, setIconLibraries] = useState<IIconLibrary[]>([]);
  const [isDefaultImported, setIsDefaultImported] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [importError, setImportError] = useState<string | null>(null);

  const getIconLibraries = async () => {
    try {
      setLoadingData(true);
      const response = await get('/react-icons/iconlibrary/find');
      setIconLibraries([...response.data]);
      setLoadingData(false);
    } catch (e) {
      setLoadingData(false);
      console.error('Failed to fetch icon libraries', e);
    }
  };

  const updateIconLibrary = async (id: string, isEnabled: boolean) => {
    try {
      await put(`/react-icons/iconlibrary/update/${id}`, {
        data: { isEnabled: isEnabled },
      });
      setIconLibraries((current) =>
        current.map((lib) => (lib.id === id ? { ...lib, isEnabled } : lib))
      );
    } catch (e) {
      console.error(`Failed to update icon library ${id}`, e);
    }
  };

  const deleteIconLibrary = async (id: string) => {
    try {
      await del(`/react-icons/iconlibrary/delete/${id}`);
      setIconLibraries((current) => current.filter((lib) => lib.id !== id));
    } catch (e) {
      console.error(`Failed to delete icon library ${id}`, e);
    }
  };

  const importDefaultIconLibraries = async () => {
    try {
      setImportError(null);
      const response = await post('/react-icons/iconlibrary/post');
      if (response) {
        await getIconLibraries();
        setIsDefaultImported(true);
      } else {
        setImportError(
          formatMessage({
            id: getTranslation('home.import_error'),
            defaultMessage: 'Failed to import default data',
          })
        );
      }
    } catch (e: any) {
      console.error('error', e);
      setImportError(
        formatMessage({
          id: getTranslation('home.import_error'),
          defaultMessage: 'Failed to import default data',
        })
      );
    }
  };

  useEffect(() => {
    if (canRead) {
      getIconLibraries();
    }
  }, [canRead]);

  useEffect(() => {
    const checkDefaultData = async () => {
      try {
        const response = await get('/react-icons/iconlibrary/find');
        if (response.data && response.data.length > 0) setIsDefaultImported(true);
      } catch (e) {
        console.log('Failed to check default data', e);
      }
    };
    checkDefaultData();
  }, [get]);

  const iconCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    iconLibraries.forEach((lib) => {
      counts[lib.abbreviation] = Object.keys(ReactIcons).filter((icon) =>
        icon.toLowerCase().startsWith(lib.abbreviation)
      ).length;
    });
    return counts;
  }, [iconLibraries]);

  if (loading) return null;
  if (!canRead) return <Navigate to="/" replace />;

  return (
    <Main>
      {/* Header Section */}
      <Box padding={6} marginTop={2}>
        <Flex gap={2} alignItems={'flex-end'} marginBottom={4}>
          <Typography variant="alpha">
            {formatMessage({ id: getTranslation('plugin.name'), defaultMessage: 'React Icons' })}
          </Typography>
          <Typography variant="epsilon" textColor="neutral600">
            {formatMessage({
              id: getTranslation('home.subtitle'),
              defaultMessage: 'Manage React Icon Libraries',
            })}
          </Typography>
        </Flex>
        {!isDefaultImported && (
          <Box marginBottom={4}>
            <Button onClick={importDefaultIconLibraries}>
              {formatMessage({
                id: getTranslation('home.import_default'),
                defaultMessage: 'Import Default Libraries',
              })}
            </Button>
          </Box>
        )}
        <Flex gap={2} marginBottom={4}>
          <Button
            onClick={() =>
              iconLibraries
                .filter((lib) => lib.isEnabled)
                .forEach((lib) => updateIconLibrary(lib.id, false))
            }
            disabled={iconLibraries.length === 0}
            variant="secondary"
            startIcon={<Trash />}
          >
            {formatMessage({
              id: getTranslation('home.disable_all'),
              defaultMessage: 'Disable All',
            })}
          </Button>
          <Button
            onClick={() => iconLibraries.forEach((lib) => deleteIconLibrary(lib.id))}
            disabled={iconLibraries.length === 0}
            variant="danger"
            startIcon={<Trash />}
          >
            {formatMessage({ id: getTranslation('home.delete_all'), defaultMessage: 'Delete All' })}
          </Button>
        </Flex>
      </Box>

      {/* Content Section */}
      <Box padding={6}>
        {loadingData ? (
          <Box padding={4}>
            <Typography variant="pi">
              {formatMessage({
                id: getTranslation('home.loading_libraries'),
                defaultMessage: 'Loading icon libraries...',
              })}
            </Typography>
          </Box>
        ) : iconLibraries.length > 0 ? (
          <Table.Root colCount={5}>
            <Table.Head>
              <Table.Row>
                <Table.HeaderCell>
                  <Typography variant="sigma">
                    {formatMessage({
                      id: getTranslation('home.enabled'),
                      defaultMessage: 'Enabled',
                    })}
                  </Typography>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <Typography variant="sigma">
                    {formatMessage({
                      id: getTranslation('home.abbreviation'),
                      defaultMessage: 'Abbreviation',
                    })}
                  </Typography>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <Typography variant="sigma">
                    {formatMessage({ id: getTranslation('home.name'), defaultMessage: 'Name' })}
                  </Typography>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <Typography variant="sigma">
                    {formatMessage({
                      id: getTranslation('home.icon_count'),
                      defaultMessage: 'Icon Count',
                    })}
                  </Typography>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <VisuallyHidden>
                    {formatMessage({
                      id: getTranslation('home.actions'),
                      defaultMessage: 'Actions',
                    })}
                  </VisuallyHidden>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {iconLibraries.map((iconLibrary) => (
                <Table.Row key={iconLibrary.id}>
                  <Table.Cell>
                    <Checkbox
                      aria-label={formatMessage(
                        {
                          id: getTranslation('home.toggle_library'),
                          defaultMessage: 'Toggle Library: {name}',
                        },
                        { name: iconLibrary.name }
                      )}
                      checked={iconLibrary.isEnabled}
                      onChange={() => updateIconLibrary(iconLibrary.id, !iconLibrary.isEnabled)}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <Typography>{iconLibrary.abbreviation}</Typography>
                  </Table.Cell>
                  <Table.Cell>
                    <Typography>{iconLibrary.name}</Typography>
                  </Table.Cell>
                  <Table.Cell>
                    <Typography>{iconCounts[iconLibrary.abbreviation]}</Typography>
                  </Table.Cell>
                  <Table.Cell>
                    <IconButton
                      onClick={() => deleteIconLibrary(iconLibrary.id)}
                      icon={<Trash />}
                      aria-label={formatMessage(
                        {
                          id: getTranslation('home.delete_library'),
                          defaultMessage: 'Delete Library: {name}',
                        },
                        { name: iconLibrary.name }
                      )}
                    />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        ) : (
          <Box padding={4}>
            <Typography variant="omega" textColor="neutral600">
              {formatMessage({
                id: getTranslation('home.no_libraries'),
                defaultMessage: 'No Icon Libraries Available',
              })}
            </Typography>
            {!isDefaultImported && (
              <Box marginTop={2}>
                <Button onClick={importDefaultIconLibraries}>
                  {formatMessage({
                    id: getTranslation('home.import_default'),
                    defaultMessage: 'Import Default Libraries',
                  })}
                </Button>
              </Box>
            )}
          </Box>
        )}
        {importError && (
          <Box padding={4}>
            <Typography variant="danger">{importError}</Typography>
          </Box>
        )}
      </Box>
    </Main>
  );
};

export { HomePage };

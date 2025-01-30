import { useEffect, useState } from 'react';
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
  Page,
} from '@strapi/design-system';
import { Trash } from '@strapi/icons';
import { Navigate } from 'react-router-dom';
import { useIntl } from 'react-intl';
import * as ReactIcons from '../all';
import { getTranslation } from '../utils/getTranslation';
import usePermissions from '../hooks/usePermissions';

const HomePage = () => {
  const { formatMessage } = useIntl();
  const { canRead, loading } = usePermissions();
  const { get, put, del, post } = useFetchClient();
  const [iconLibraries, setIconLibraries] = useState<IIconLibrary[]>([]);

  const getIconLibraries = async () => {
    setIconLibraries([...(await get('/react-icons/iconlibrary/find')).data]);
  };

  const updateIconLibrary = async (id: string, isEnabled: boolean) => {
    await put(`/react-icons/iconlibrary/update/${id}`, {
      data: { isEnabled: isEnabled },
    });
    setIconLibraries((current) =>
      current.map((lib) => (lib.id === id ? { ...lib, isEnabled } : lib))
    );
  };

  const deleteIconLibrary = async (id: string) => {
    await del(`/react-icons/iconlibrary/delete/${id}`);
    setIconLibraries((current) => current.filter((lib) => lib.id !== id));
  };

  const importDefaultIconLibraries = async () => {
    (await import('../data/default.json')).default.forEach(async (entry) => {
      await post('/react-icons/iconlibrary/post', { data: entry });
    });
    getIconLibraries();
  };

  useEffect(() => {
    if (canRead) getIconLibraries();
  }, [canRead]);

  const getIconCount = (abbreviation: string) => {
    return Object.keys(ReactIcons).filter((icon) => icon.toLowerCase().startsWith(abbreviation))
      .length;
  };

  if (loading) return null;
  if (!canRead) return <Navigate to="/" replace />;

  return (
    <Main>
      <Page.Root padding={6} marginTop={2}>
        <Page.Header
          title={formatMessage({ id: getTranslation('plugin.name') })}
          subtitle={formatMessage({ id: getTranslation('home.subtitle') })}
          primaryAction={
            <Button onClick={importDefaultIconLibraries}>
              {formatMessage({ id: getTranslation('home.import_default') })}
            </Button>
          }
        />

        <Page.Actions>
          <Flex gap={2}>
            <Button
              onClick={() =>
                iconLibraries
                  .filter((lib) => lib.isEnabled)
                  .forEach((lib) => updateIconLibrary(lib.id, false))
              }
              variant="secondary"
              startIcon={<Trash />}
            >
              {formatMessage({ id: getTranslation('home.disable_all') })}
            </Button>
            <Button
              onClick={() => iconLibraries.forEach((lib) => deleteIconLibrary(lib.id))}
              variant="danger"
              startIcon={<Trash />}
            >
              {formatMessage({ id: getTranslation('home.delete_all') })}
            </Button>
          </Flex>
        </Page.Actions>

        <Page.Content>
          <Table.Root colCount={5}>
            <Table.Head>
              <Table.Row>
                <Table.HeaderCell>
                  <Typography variant="sigma">
                    {formatMessage({ id: getTranslation('home.enabled') })}
                  </Typography>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <Typography variant="sigma">
                    {formatMessage({ id: getTranslation('home.abbreviation') })}
                  </Typography>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <Typography variant="sigma">
                    {formatMessage({ id: getTranslation('home.name') })}
                  </Typography>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <Typography variant="sigma">
                    {formatMessage({ id: getTranslation('home.icon_count') })}
                  </Typography>
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <VisuallyHidden>
                    {formatMessage({ id: getTranslation('home.actions') })}
                  </VisuallyHidden>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Head>

            <Table.Body>
              {iconLibraries.length > 0 ? (
                iconLibraries.map((iconLibrary) => (
                  <Table.Row key={iconLibrary.id}>
                    <Table.Cell>
                      <Checkbox
                        aria-label={formatMessage(
                          { id: getTranslation('home.toggle_library') },
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
                      <Typography>{getIconCount(iconLibrary.abbreviation)}</Typography>
                    </Table.Cell>
                    <Table.Cell>
                      <IconButton
                        onClick={() => deleteIconLibrary(iconLibrary.id)}
                        icon={<Trash />}
                        aria-label={formatMessage(
                          { id: getTranslation('home.delete_library') },
                          { name: iconLibrary.name }
                        )}
                      />
                    </Table.Cell>
                  </Table.Row>
                ))
              ) : (
                <Box padding={4}>
                  <Typography variant="pi">
                    {formatMessage({ id: getTranslation('home.no_libraries') })}
                  </Typography>
                </Box>
              )}
            </Table.Body>
          </Table.Root>
        </Page.Content>
      </Page.Root>
    </Main>
  );
};

export { HomePage };

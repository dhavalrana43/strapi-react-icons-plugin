import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  TextInput,
  Field,
  Modal,
  Typography,
  Grid,
  Searchbar,
  Button,
  Accordion,
  Flex,
  SingleSelect,
} from '@strapi/design-system';

import * as ReactIcons from '../../all';
import { MessageDescriptor, useIntl } from 'react-intl';
import { useFetchClient } from '@strapi/strapi/admin';
import { IconLibraryComponent } from './IconLibraryComponent';
import { IconComponent } from './IconComponent';
import { Minus, Plus } from '@strapi/icons';
import { getTranslation } from '../../utils/getTranslation';
import { TbSearch as SearchIcon, TbX as CloseIcon } from 'react-icons/tb';

interface IReactIconsSelector {
  description: null | MessageDescriptor;
  intlLabel: null | MessageDescriptor;
  placeholder: null | MessageDescriptor;
  name: string;
  error: string;
  required: boolean;
  onChange: any;
  value: string;
}

export type IReactIcon = keyof typeof ReactIcons;

const ReactIconsSelector: React.FC<IReactIconsSelector> = ({
  description,
  error,
  intlLabel,
  placeholder,
  name,
  required,
  onChange,
  value,
}) => {
  const { formatMessage } = useIntl();
  const { get } = useFetchClient();

  const [iconLibraries, setIconLibraries] = useState<IIconLibrary[]>([]);
  const [selectedIconLibrary, setSelectedIconLibrary] = useState<string | null>(null);
  const allReactIcons = Object.keys(ReactIcons) as IReactIcon[];
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedIDs, setExpandedID] = useState<string[]>([]);

  useEffect(() => {
    const getIconLibraries = async () => {
      try {
        const response = await get('/strapi-react-icons-plugin/iconlibrary/find');
        setIconLibraries(
          response.data.filter((iconLibrary: IIconLibrary) => iconLibrary.isEnabled)
        );
      } catch (e) {
        console.error('Failed to fetch icon libraries', e);
      }
    };

    getIconLibraries();
  }, [get]);

  const toggleModal = () => setIsModalVisible((prev) => !prev);
  const changeIcon = (newIcon: string) =>
    onChange({ target: { name, type: 'string', value: newIcon } });
  const onSelectIcon = (newIcon: string) => {
    toggleModal();
    changeIcon(newIcon);
  };
  const handleToggle = (id: string) => () =>
    setExpandedID((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  const handleExpand = () =>
    setExpandedID(
      iconLibraries.length === expandedIDs.length
        ? []
        : iconLibraries.map((_, index) => 'acc-' + index)
    );

  const filteredIcons = useMemo(
    () => allReactIcons.filter((icon) => icon.toLowerCase().includes(searchTerm.toLowerCase())),
    [allReactIcons, searchTerm]
  );

  return (
    <>
      <TextInput
        type="text"
        label={intlLabel && formatMessage(intlLabel)}
        placeholder={placeholder && formatMessage(placeholder)}
        hint={description && formatMessage(description)}
        disabled
        onChange={onChange}
        id={name}
        name={name}
        value={value || ''}
        required={required}
        error={error}
        startAction={
          <Field.Action onClick={toggleModal}>
            {value ? <IconComponent icon={value} /> : <SearchIcon />}
          </Field.Action>
        }
        endAction={
          !!value && (
            <Field.Action onClick={() => changeIcon('')}>
              <CloseIcon />
            </Field.Action>
          )
        }
      />

      {isModalVisible && (
        <Modal.Root onClose={toggleModal} labelledBy="title">
          <Modal.Header>
            <Typography fontWeight="bold" id="title">
              {formatMessage({
                id: getTranslation('react-icons.iconSelector.selectIcon'),
                defaultMessage: 'Select icon',
              })}
            </Typography>
          </Modal.Header>
          <Modal.Body>
            <Box>
              <Grid gap={2}>
                <Grid.Col span={10}>
                  <Searchbar
                    value={searchTerm}
                    onChange={(e: any) => setSearchTerm(e.target.value)}
                  />
                </Grid.Col>
                <Grid.Col span={2}>
                  <Button
                    onClick={handleExpand}
                    startIcon={expandedIDs.length === iconLibraries.length ? <Minus /> : <Plus />}
                  >
                    Toggle
                  </Button>
                </Grid.Col>
              </Grid>
              <Accordion.Root>
                {iconLibraries.map((iconLibrary, index) => (
                  <Accordion.Item key={iconLibrary.id} value={`acc-${index}`}>
                    <Accordion.Header>
                      <Accordion.Trigger description={iconLibrary.name}>
                        {`${iconLibrary.name} (${iconLibrary.abbreviation})`}
                      </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Content>
                      <Box padding={4}>
                        <Flex wrap="wrap" gap={1}>
                          <IconLibraryComponent icons={filteredIcons} onSelectIcon={onSelectIcon} />
                        </Flex>
                      </Box>
                    </Accordion.Content>
                  </Accordion.Item>
                ))}
              </Accordion.Root>
            </Box>
          </Modal.Body>
          <Modal.Footer>
            <Flex justifyContent="space-between">
              <SingleSelect
                value={selectedIconLibrary}
                onChange={(value: any) => setSelectedIconLibrary(value)}
              >
                {iconLibraries.map((iconLibrary) => (
                  <SingleSelect.Option key={iconLibrary.id} value={iconLibrary.id}>
                    {`${iconLibrary.name} (${iconLibrary.abbreviation})`}
                  </SingleSelect.Option>
                ))}
              </SingleSelect>
              <Button variant="tertiary" onClick={toggleModal}>
                Close
              </Button>
            </Flex>
          </Modal.Footer>
        </Modal.Root>
      )}
    </>
  );
};

export default ReactIconsSelector;

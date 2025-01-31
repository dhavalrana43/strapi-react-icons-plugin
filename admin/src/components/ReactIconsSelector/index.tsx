// File: admin/src/components/ReactIconsSelector/index.tsx
import React, { useEffect, useState, useMemo } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionGroup,
  AccordionTrigger,
  Badge,
  Box,
  Button,
  Field,
  Flex,
  Modal,
  Searchbar,
  Select,
  TextInput,
  Typography,
  Grid,
} from '@strapi/design-system';
// Updated import to reference the types correctly.
import * as ReactIcons from '../../all';
import { MessageDescriptor, useIntl } from 'react-intl';
import { useFetchClient } from '@strapi/strapi/admin';
import { IconLibraryComponent } from './IconLibraryComponent';
import { IconComponent } from './IconComponent';
import { Minus, Plus } from '@strapi/icons';
import { getTranslation } from '../../utils/getTranslation';

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

  const toggleModal = () => setIsModalVisible((prev) => !prev);

  const changeIcon = (newIcon: string) =>
    onChange({
      target: {
        name,
        type: 'string',
        value: newIcon,
      },
    });

  const onSelectIcon = (newIcon: string) => {
    toggleModal();
    changeIcon(newIcon);
  };

  useEffect(() => {
    const getIconLibraries = async () => {
      try {
        const response = await get('/react-icons/iconlibrary/find');
        setIconLibraries(
          response.data.filter((iconLibrary: IIconLibrary) => iconLibrary.isEnabled)
        );
      } catch (e) {
        console.error('Failed to fetch icon libraries', e);
      }
    };

    getIconLibraries();
  }, [get]);

  const [expandedIDs, setExpandedID] = useState<string[]>([]);
  const handleToggle = (id: string) => () => {
    expandedIDs?.includes(id)
      ? setExpandedID(expandedIDs.filter((i) => i !== id))
      : setExpandedID([...expandedIDs, id]);
  };

  const handleExpand = () => {
    if (iconLibraries.length === expandedIDs.length) {
      setExpandedID([]);
    } else {
      setExpandedID(iconLibraries.map((iconLibrary, index) => 'acc-' + index));
    }
  };

  const filteredIcons = useMemo(() => {
    return allReactIcons.filter((icon) => icon.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [allReactIcons, searchTerm]);

  return (
    <>
      <TextInput
        type="text"
        label={intlLabel && formatMessage(intlLabel)}
        placeholder={placeholder && formatMessage(placeholder)}
        hint={description && formatMessage(description)}
        disabled={true}
        onChange={onChange}
        id={name}
        name={name}
        value={value || ''}
        required={required}
        error={error}
        startAction={
          <Field.Action onClick={toggleModal}>
            {value ? <IconComponent icon={value} /> : <ReactIcons.TbSearch />}
          </Field.Action>
        }
        endAction={
          !!value && (
            <Field.Action onClick={() => changeIcon('')}>
              <ReactIcons.TbX />
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
                    onClear={() => setSearchTerm('')}
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setSearchTerm(e.target.value)
                    }
                    placeholder={formatMessage({
                      id: getTranslation('react-icons.iconSelector.search'),
                      defaultMessage: 'Search icons...',
                    })}
                  />
                </Grid.Col>
                <Grid.Col span={2}>
                  <Button
                    size="L"
                    onClick={handleExpand}
                    startIcon={expandedIDs.length === iconLibraries.length ? <Minus /> : <Plus />}
                  >
                    {expandedIDs.length === iconLibraries.length
                      ? formatMessage({
                          id: getTranslation('react-icons.iconSelector.collapse'),
                          defaultMessage: 'Collapse',
                        })
                      : formatMessage({
                          id: getTranslation('react-icons.iconSelector.expand'),
                          defaultMessage: 'Expand',
                        })}
                  </Button>
                </Grid.Col>
              </Grid>

              {iconLibraries.length > 0 ? (
                <Box padding={4} marginTop={2} background="neutral0">
                  <AccordionGroup>
                    {iconLibraries
                      .filter(
                        (iconLibrary) =>
                          !selectedIconLibrary || iconLibrary.abbreviation === selectedIconLibrary
                      )
                      .map((iconLibrary, index) => {
                        const libraryIcons = filteredIcons.filter((icon) =>
                          icon.toLowerCase().startsWith(iconLibrary.abbreviation)
                        );

                        return (
                          libraryIcons.length > 0 && (
                            <Accordion
                              key={iconLibrary.id}
                              value={`acc-${index}`}
                              expanded={expandedIDs.includes(`acc-${index}`)}
                              onToggle={handleToggle(`acc-${index}`)}
                              size="S"
                            >
                              <AccordionTrigger
                                position="left"
                                title={
                                  <Typography>{`${iconLibrary.name} (${iconLibrary.abbreviation})`}</Typography>
                                }
                                action={<Badge>{libraryIcons.length}</Badge>}
                              />
                              <AccordionContent>
                                <Box paddingLeft={3} paddingTop={3} paddingBottom={3}>
                                  <Flex wrap="wrap" gap={1}>
                                    <IconLibraryComponent
                                      icons={libraryIcons}
                                      onSelectIcon={onSelectIcon}
                                    />
                                  </Flex>
                                </Box>
                              </AccordionContent>
                            </Accordion>
                          )
                        );
                      })}
                  </AccordionGroup>
                  {iconLibraries
                    .filter(
                      (iconLibrary) =>
                        !selectedIconLibrary || iconLibrary.abbreviation === selectedIconLibrary
                    )
                    .every(
                      (iconLibrary) =>
                        filteredIcons.filter((icon) =>
                          icon.toLowerCase().startsWith(iconLibrary.abbreviation)
                        ).length === 0
                    ) && (
                    <Box padding={4}>
                      <Typography variant="pi">
                        {formatMessage({
                          id: getTranslation('react-icons.iconSelector.noIconsAvailable'),
                          defaultMessage: 'No icons available in this library.',
                        })}
                      </Typography>
                    </Box>
                  )}
                </Box>
              ) : (
                <Typography variant="pi">
                  {formatMessage({
                    id: getTranslation('react-icons.iconSelector.noIconLibrariesAvailable'),
                    defaultMessage:
                      'No icon libraries available. Please import them on the plugin page.',
                  })}
                </Typography>
              )}
            </Box>
          </Modal.Body>
          <Modal.Footer>
            <Flex justifyContent="space-between" width="100%">
              <Select
                width="500px"
                value={selectedIconLibrary}
                onChange={setSelectedIconLibrary}
                error={error}
              >
                <Select.Option value="">
                  {formatMessage({
                    id: getTranslation('react-icons.iconSelector.allIconLibraries'),
                    defaultMessage: 'All icon libraries',
                  })}
                </Select.Option>
                {iconLibraries.map((iconLibrary) => (
                  <Select.Option key={iconLibrary.id} value={iconLibrary.abbreviation}>
                    {iconLibrary.name}
                  </Select.Option>
                ))}
              </Select>
              <Button variant="tertiary" onClick={toggleModal}>
                {formatMessage({
                  id: getTranslation('react-icons.iconSelector.close'),
                  defaultMessage: 'Close',
                })}
              </Button>
            </Flex>
          </Modal.Footer>
        </Modal.Root>
      )}
    </>
  );
};

export default ReactIconsSelector;

import React, { useEffect, useState } from 'react';
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
      setIconLibraries(
        (await get('/react-icons/iconlibrary/find')).data.filter(
          (iconLibrary: IIconLibrary) => iconLibrary.isEnabled
        )
      );
    };

    getIconLibraries();
  }, []);

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
              Select icon
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
                    })}
                  />
                </Grid.Col>
                <Grid.Col span={2}>
                  <Button
                    size="L"
                    onClick={handleExpand}
                    startIcon={expandedIDs.length === iconLibraries.length ? <Minus /> : <Plus />}
                  >
                    {expandedIDs.length === iconLibraries.length ? 'Collapse' : 'Expand'}
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
                        const iconCount = allReactIcons.filter(
                          (icon) =>
                            icon.toLowerCase().startsWith(iconLibrary.abbreviation) &&
                            icon.toLowerCase().includes(searchTerm.toLowerCase())
                        ).length;

                        return (
                          iconCount > 0 && (
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
                                action={<Badge>{iconCount}</Badge>}
                              />
                              <AccordionContent>
                                <Box paddingLeft={3} paddingTop={3} paddingBottom={3}>
                                  <Flex wrap="wrap" gap={1}>
                                    <IconLibraryComponent
                                      icons={allReactIcons.filter(
                                        (icon) =>
                                          icon.toLowerCase().startsWith(iconLibrary.abbreviation) &&
                                          icon.toLowerCase().includes(searchTerm.toLowerCase())
                                      )}
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
                </Box>
              ) : (
                <Typography variant="pi">
                  {formatMessage({
                    id: getTranslation('react-icons.iconSelector.noIconLibrariesAvailable'),
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
                  })}
                </Select.Option>
                {iconLibraries.map((iconLibrary) => (
                  <Select.Option key={iconLibrary.id} value={iconLibrary.abbreviation}>
                    {iconLibrary.name}
                  </Select.Option>
                ))}
              </Select>
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

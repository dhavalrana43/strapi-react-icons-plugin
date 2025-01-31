import { getTranslation } from './utils/getTranslation';
import { PLUGIN_ID } from './pluginId';
import { Initializer } from './components/Initializer';

import pluginPkg from '../../package.json';
import { PluginIcon } from './components/PluginIcon';

type TradOptions = Record<string, string>;

const prefixPluginTranslations = (trad: TradOptions, pluginId: string): TradOptions => {
  if (!pluginId) {
    throw new TypeError("pluginId can't be empty");
  }
  return Object.keys(trad).reduce((acc, current) => {
    acc[`${pluginId}.${current}`] = trad[current];
    return acc;
  }, {} as TradOptions);
};
const name = pluginPkg.strapi.name;

export default {
  register(app: any) {
    // Register custom field
    app.customFields.register({
      name: 'icon',
      pluginId: PLUGIN_ID,
      icon: PluginIcon,
      type: 'string',
      intlLabel: {
        id: getTranslation('react-icons.label'),
        defaultMessage: 'react-icon',
      },
      intlDescription: {
        id: getTranslation('react-icons.description'),
        defaultMessage: 'Select a react-icon',
      },
      components: {
        Input: async () =>
          import(
            /* webpackChunkName: "react-icons-input-component" */ './components/ReactIconsSelector'
          ),
      },
      options: {
        advanced: [
          {
            sectionTitle: {
              id: 'global.settings',
              defaultMessage: 'Settings',
            },
            items: [
              {
                name: 'required',
                type: 'checkbox',
                intlLabel: {
                  id: getTranslation('react-icons.options.advanced.requiredField'),
                  defaultMessage: 'Required field',
                },
                description: {
                  id: getTranslation('react-icons.options.advanced.requiredField.description'),
                  defaultMessage: "You won't be able to create an entry if this field is empty",
                },
              },
            ],
          },
        ],
      },
    });

    // Add menu link
    app.addMenuLink({
      to: `plugins/${PLUGIN_ID}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${PLUGIN_ID}.plugin.name`,
        defaultMessage: name,
      },
      Component: async () => {
        const { App } = await import('./pages/App');
        return App;
      },
      permissions: [
        {
          action: `plugin::${PLUGIN_ID}.read`,
          subject: null,
        },
      ],
    });

    // Register plugin
    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name,
    });
  },

  async registerTrads({ locales }: { locales: string[] }) {
    return Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await import(`./translations/${locale}.json`);
          return {
            data: prefixPluginTranslations(data, PLUGIN_ID),
            locale,
          };
        } catch {
          return {
            data: {},
            locale,
          };
        }
      })
    );
  },
};

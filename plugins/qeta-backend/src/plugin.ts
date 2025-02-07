import { getRootLogger } from '@backstage/backend-common';
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { createRouter } from './service/router';
import { DatabaseQetaStore } from './database/DatabaseQetaStore';

const logger = getRootLogger();

/**
 * Qeta backend plugin
 *
 * @public
 */
export const qetaPlugin = createBackendPlugin({
  pluginId: 'qeta',
  register(env) {
    env.registerInit({
      deps: {
        config: coreServices.rootConfig,
        httpRouter: coreServices.httpRouter,
        identity: coreServices.identity,
        database: coreServices.database,
      },
      async init({ config, httpRouter, identity, database }) {
        const qetaStore = await DatabaseQetaStore.create({
          database,
        });

        httpRouter.use(
          await createRouter({
            config,
            logger,
            identity,
            database: qetaStore,
          }),
        );
      },
    });
  },
});

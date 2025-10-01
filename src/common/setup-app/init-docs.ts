import { DocumentBuilder } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { apiReference } from '@scalar/nestjs-api-reference';
import { readPackageJSON } from 'pkg-types';

import * as CONTROLLERS from '@contract/api/controllers';

const controllersInfo = Object.entries<{ tag: string, description: string }>(CONTROLLERS as any)
    .filter(([key]) => key.endsWith('_INFO'))
    .map(([, value] ) => [
        value.tag,
        value.description,
    ]);

const description = `
Squidward is proxy management tool, built on top of squid, with a focus on simplicity and ease of use.
`;

export async function initDocs(app: INestApplication<unknown>, config: ConfigService) {
    const isSwaggerEnabled = config.getOrThrow<string>('IS_DOCS_ENABLED');
    
    if (isSwaggerEnabled === 'true') {
        const pkg = await readPackageJSON();

        const configSwagger = new DocumentBuilder()
            .setTitle(`Squidward API v${pkg.version}`)
            .addBearerAuth(
                {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    name: 'Authorization',
                    description: 'JWT obtained login.',
                },
                'Authorization',
            )
            .addBasicAuth(
                {
                    type: 'http',
                    scheme: 'basic',
                    name: 'Prometheus',
                    description: 'Prometheus Basic Auth',
                },
                'Prometheus',
            )
            .setDescription(description)
            .setVersion(pkg.version!)
            .setLicense('AGPL-3.0', 'https://github.com/squidward/panel?tab=AGPL-3.0-1-ov-file');

        controllersInfo.forEach(([tag, description]) => {
            configSwagger.addTag(tag, description);
        });

        const builtConfigSwagger = configSwagger.build();

        const documentFactory = () => SwaggerModule.createDocument(app, builtConfigSwagger);

        // const theme = new SwaggerTheme();
        const options = {
            explorer: false,
            // customCss: theme.getBuffer(SwaggerThemeNameEnum.ONE_DARK),
            customSiteTitle: 'Squidward API Schema',
            swaggerOptions: {
                persistAuthorization: true,
            },
        };

        SwaggerModule.setup(
            config.getOrThrow<string>('SWAGGER_PATH'),
            app,
            documentFactory,
            options,
        );
        
        app.use(
            config.getOrThrow<string>('SCALAR_PATH'),

            apiReference({
                showSidebar: true,
                layout: 'modern',
                hideModels: false,
                hideDownloadButton: false,
                hideTestRequestButton: false,
                isEditable: false,
                isLoading: false,
                hideDarkModeToggle: false,
                withDefaultFonts: true,
                hideSearch: false,
                theme: 'bluePlanet',
                hideClientButton: false,
                darkMode: true,
                hiddenClients: [
                    'asynchttp',
                    'nethttp',
                    'okhttp',
                    'unirest',
                    'nsurlsession',
                    'httr',
                    'native',
                    'libcurl',
                    'httpclient',
                    'restsharp',
                    'clj_http',
                    'webrequest',
                    'restmethod',
                    'cohttp',
                ],
                defaultHttpClient: {
                    targetKey: 'js',
                    clientKey: 'axios',
                },

                content: documentFactory,
            }),
        );
    }
}

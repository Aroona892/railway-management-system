import swaggerJSDoc from 'swagger-jsdoc'

export function createOpenApiSpec() {
  return swaggerJSDoc({
    definition: {
      openapi: '3.0.3',
      info: {
        title: 'Railway Management System API',
        version: '1.0.0',
      },
      servers: [{ url: 'http://localhost:4000' }],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
    apis: [],
  })
}


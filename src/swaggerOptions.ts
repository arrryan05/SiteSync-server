// src/swaggerOptions.ts
export const swaggerOptions = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "SiteSync API",
        version: "1.0.0",
        description: "API documentation for SiteSync backend",
      },
      servers: [
        {
          url: "http://localhost:8080/api",
        },
      ],
    },
    apis: ["./src/routes/*.ts"], // Where your route files are
  };
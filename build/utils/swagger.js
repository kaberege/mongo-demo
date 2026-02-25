import express from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { PORT } from "./config.js";
const router = express.Router();
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Mongo-Demo Express API with Swagger",
            version: "1.0.0",
            description: "This is a simple CRUD API application made with Express and documented with Swagger",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
                name: "Kaberege Godard Nestor",
                url: "https://kaberege-portfolio.vercel.app",
                email: "nestor.godard.kaberege@gmail.com",
            },
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: "Developement server",
            },
        ],
        components: {
            securitySchemes: {
                Bearer: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "JWT key authorization for API",
                },
                ApiKeyAuth: {
                    type: "apikey",
                    in: "header",
                    name: "x-api-key",
                    description: "API key authorization for API",
                },
            },
        },
    },
    apis: [".src/routers/*.{ts,js}", ".build/routers/*.{ts,js}"],
};
const specs = swaggerJSDoc(options);
router.get("/json", (req, res) => {
    res.json(specs);
});
router.use("/", swaggerUi.serve, swaggerUi.setup(specs));
export default router;
//# sourceMappingURL=swagger.js.map
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
        tags: [
            {
                name: "Auth",
                description: "User registration, login, and account management",
            },
            {
                name: "Posts",
                description: "Operations related to feed posts and image uploads",
            },
        ],
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: "Developement server",
            },
        ],
        components: {
            schemas: {
                User: {
                    type: "object",
                    required: ["email", "password", "name"],
                    properties: {
                        email: {
                            type: "string",
                            format: "email",
                            example: "test@test.com",
                        },
                        password: {
                            type: "string",
                            format: "password",
                            example: "s3cret!",
                        },
                        name: { type: "string", example: "John Doe" },
                        status: { type: "string", default: "I am new!" },
                    },
                },
                UserResponse: {
                    type: "object",
                    properties: {
                        _id: { type: "string" },
                        email: { type: "string", format: "email" },
                        name: { type: "string" },
                        status: { type: "string" },
                        posts: {
                            type: "array",
                            items: { $ref: "#/components/schemas/Post" },
                        },
                    },
                },
                Post: {
                    type: "object",
                    required: ["title", "content", "imageURL"],
                    properties: {
                        _id: { type: "string" },
                        title: { type: "string", example: "My First Post" },
                        content: { type: "string", example: "Post content here" },
                        imageURL: { type: "string", example: "public/uploads/image.jpg" },
                        creator: {
                            oneOf: [
                                { type: "string", description: "User ID" },
                                { $ref: "#/components/schemas/UserResponse" },
                            ],
                        },
                        createdAt: { type: "string", format: "date-time" },
                    },
                },
            },
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
    apis: ["./src/routes/*.{ts,js}", "./build/routes/*.{ts,js}"],
};
const specs = swaggerJSDoc(options);
router.get("/json", (req, res) => {
    res.json(specs);
});
router.use("/", swaggerUi.serve, swaggerUi.setup(specs));
export default router;
//# sourceMappingURL=swagger.js.map
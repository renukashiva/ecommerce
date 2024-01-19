import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "My E-commerce API",
    description: "contains all project related APIs",
  },
  host: "localhost:8080",
};

const outputFile = "./swagger-ouput.json";
const routes = [
  "./src/routes/userRoutes.js",
  "./src/routes/productRoutes.js",
  "./src/routes/orderRoutes.js",
  "./src/routes/categoryRoutes.js",
  "./src/routes/cartRoutes.js",
];

swaggerAutogen(outputFile, routes, doc);

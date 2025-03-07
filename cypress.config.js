import { defineConfig } from "cypress";
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    env: process.env,
    baseUrl: 'https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod',
  },
});

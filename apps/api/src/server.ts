
import { buildApp } from "./app.js";
import { healthRoutes } from "./routes/health.js";


const app = buildApp();

app.listen({
    port:3001,
    host:"0.0.0.0"
});
app.register(healthRoutes);
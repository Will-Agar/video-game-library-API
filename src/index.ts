import express from "express";
import featuredRoutes from "./routes/featuredRoutes";
import discoverRoute from "./routes/discoverRoutes";
import favoriteRoute from "./routes/favoriteRoutes";
import authRoute from "./routes/authenticationRoutes";
import suggestionsRoute from "./routes/suggestionsRoute";
import gameRoutes from "./routes/gameRoutes";

const port = process.env.PORT || 8080;
const app = express();

app.use(express.json());
app.use('/auth', authRoute);
app.use('/featured', featuredRoutes);
app.use('/discover', discoverRoute);
app.use('/favorite', favoriteRoute);
app.use('/suggestions', suggestionsRoute);
app.use('/games', gameRoutes);

app.listen(port);
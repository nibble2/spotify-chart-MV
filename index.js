import express from 'express';
const app = express();

import { apiRouter, getAuthorize, getAuthorizeCallback } from './routes/userRouter';

const PORT = 4000;

const handleListening = () =>
    console.log(`Listening on: http://localhost:${PORT}`);

const handleHome = (req, res) => res.send("Hello home");

const handleProfile = (req, res) => res.send("You are on my profile");


app.get('/', handleHome);
app.get('/login', getAuthorize);
app.get('/callback', getAuthorizeCallback);
app.get("/profile", handleProfile);
app.listen(PORT, handleListening);
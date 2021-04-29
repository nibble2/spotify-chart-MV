import axios from 'axios'
import dotenv from 'dotenv';
import { response } from 'express';
import SpotifyWebApi from 'spotify-web-api-node';

dotenv.config();


export const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: 'http://localhost:4000/callback'
});

// spotifyApi.setAccessToken(process.env.ACCESS_TOKEN);

const scopes = [''],
    state = '';


export const getAuthorize = (req, res) => {
    res.redirect(spotifyApi.createAuthorizeURL(scopes, state));
}



export const getAuthorizeCallback = (req, res) => {
    const {
        query: {
            error,
            code
        }
    } = req;

    if (error) {
        console.error('Callback Error:', error);
        res.send(`Callback Error: ${error}`);
        return;
    }

    spotifyApi
        .authorizationCodeGrant(code)
        .then(data => {
            const access_token = data.body['access_token'];
            const refresh_token = data.body['refresh_token'];
            const expires_in = data.body['expires_in'];

            spotifyApi.setAccessToken(access_token);
            spotifyApi.setRefreshToken(refresh_token);

            console.log('access_token:', access_token);
            console.log('refresh_token:', refresh_token);

            console.log(
                `Sucessfully retreived access token. Expires in ${expires_in} s.`
            );

            res.redirect('/');

            setInterval(async() => {
                const data = await spotifyApi.refreshAccessToken();
                const access_token = data.body['access_token'];

                console.log('The access token has been refreshed!');
                console.log('access_token:', access_token);
                spotifyApi.setAccessToken(access_token);
            }, expires_in / 2 * 1000);

        })
        .catch(error => {
            console.error('Error getting Tokens:', error);
            res.send(`Error getting Tokens: ${error}`);
        });
}


// console.log(access_token);
// const getPlaylist = () => {
//     spotifyApi.getPlaylist('37i9dQZEVXbNxXF4SkHj9F')
//         .then((data) => {
//             // console.log('Some information about this playlist', data.body);
//             const contryDes = data.body.name;
//             const items = data.body.tracks.items;

//             items.forEach((element, index) => {
//                 const rank = index + 1;
//                 const artist = element.track.artists[0].name;
//                 const music = element.track.name;
//                 // console.log(rank, artist, music);
//             });
//         }, (err) => {
//             console.log('Something went wrong!', err);
//         });
// }


// getPlaylist();
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

const code;

export const getAuthorizeCallback = (req, res) => {
    const error = req.query.error;
    code = req.query.code;
    const state = req.query.state;

    if (error) {
        console.error('Callback Error:', error);
        res.send(`Callback Error: ${error}`);
        return;
    }
    try {
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
                res.send('Success! You can now close the window.');

                setInterval(async() => {
                    const data = await spotifyApi.refreshAccessToken();
                    const access_token = data.body['access_token'];

                    console.log('The access token has been refreshed!');
                    console.log('access_token:', access_token);
                    spotifyApi.setAccessToken(access_token);
                }, expires_in / 2 * 1000);
            })
        res.redirect('/');

    } catch (error) {
        console.error('Error getting Tokens:', error);
        res.send(`Error getting Tokens: ${error}`);
    }

};

const authorizationCode = code;

let tokenExpirationEpoch;

// First retrieve an access token
spotifyApi.authorizationCodeGrant(authorizationCode).then(
    function(data) {
        // Set the access token and refresh token
        spotifyApi.setAccessToken(data.body['access_token']);
        spotifyApi.setRefreshToken(data.body['refresh_token']);

        // Save the amount of seconds until the access token expired
        tokenExpirationEpoch =
            new Date().getTime() / 1000 + data.body['expires_in'];
        console.log(
            'Retrieved token. It expires in ' +
            Math.floor(tokenExpirationEpoch - new Date().getTime() / 1000) +
            ' seconds!'
        );
    },
    function(err) {
        console.log(
            'Something went wrong when retrieving the access token!',
            err.message
        );
    }
);

// Continually print out the time left until the token expires..
let numberOfTimesUpdated = 0;

setInterval(function() {
    console.log(
        'Time left: ' +
        Math.floor(tokenExpirationEpoch - new Date().getTime() / 1000) +
        ' seconds left!'
    );

    // OK, we need to refresh the token. Stop printing and refresh.
    if (++numberOfTimesUpdated > 5) {
        clearInterval(this);

        // Refresh token and print the new time to expiration.
        spotifyApi.refreshAccessToken().then(
            function(data) {
                tokenExpirationEpoch =
                    new Date().getTime() / 1000 + data.body['expires_in'];
                console.log(
                    'Refreshed token. It now expires in ' +
                    Math.floor(tokenExpirationEpoch - new Date().getTime() / 1000) +
                    ' seconds!'
                );
            },
            function(err) {
                console.log('Could not refresh the token!', err.message);
            }
        );
    }
}, 1000);


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


getPlaylist();
import axios from 'axios'
import dotenv from 'dotenv';
import SpotifyWebApi from 'spotify-web-api-node';

dotenv.config();

// 자격 증명은 선택 사항입니다. 
var spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: 'http://www.example.com/callback'
});

spotifyApi.setAccessToken(process.env.ACCESS_TOKEN);



// export const getAuthorize = async(req, res) => {
//     try {
//         const URL = 'https://accounts.spotify.com/authorize'
//         return await axios.get(URL, {
//                 params: {
//                     client_id: "97eb62bd05044dc59be89ac8a3c23e0c",
//                     response_type: "code",
//                     redirect_uri: 'http://example.com/callback/'
//                 }
//             })
//     } catch (error) {
//         console.error(error);
//         res.status(400);
//     } finally {
//         res.end();
//     }

// }


const getPlaylist = () => {
    spotifyApi.getPlaylist('37i9dQZEVXbNxXF4SkHj9F')
        .then((data) => {
            console.log('Some information about this playlist', data.body);
            const contryDes = data.body.name;
            const items = data.body.tracks.items;

            items.forEach((element, index) => {
                const rank = index + 1;
                const artist = element.track.artists[0].name;
                const music = element.track.name;
                console.log(rank, artist, music);
            });
        }, (err) => {
            console.log('Something went wrong!', err);
        });
}


getPlaylist();
// getAuthorize();
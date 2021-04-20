import axios from 'axios'
import dotenv from 'dotenv';

dotenv.config();

const accessToken = 'Bearer ' + process.env.ACCESS_TOKEN;
console.log(accessToken);

const getSpotifyChart = () => {
    console.log("Spotify Chart");
    const FETCH_URL = 'https://api.spotify.com/v1/playlists/37i9dQZEVXbNxXF4SkHj9F';
    axios.get(FETCH_URL, { headers: { 'Authorization': accessToken } })
        .then((response) => {
            const contryDes = response.data.name;
            const items = response.data.tracks.items;
            // console.log(items);

            items.forEach((element, index) => {
                const rank = index + 1;
                const artist = element.track.artists[0].name;
                const music = element.track.name;
                console.log(rank, artist, music);
            });
        })
        .catch((error) => {
            console.log(error);
        })
}

getSpotifyChart();
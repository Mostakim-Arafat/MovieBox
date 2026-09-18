const movieId = 12; // Example: Star Wars ID
const url = `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`;

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NGRmYTg2ZTEyYjZiZTNmMTE2Y2E2ZTY0OGZhNzFkNSIsIm5iZiI6MTc4OTY1NjY0OC41Nzc5OTk4LCJzdWIiOiI2YWFiZmU0ODY4Y2U3ZTM4YzMxMzA0MGUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.VwJbAwHxwwrkz1AHxj5XI_0RfqngJbYb2bRY8sbtLCc'
  }
};

interface Videos {
    site : string;
    type : string;
}

fetch(url, options)
  .then(res => res.json())
  .then(json => {
    // Find the official YouTube trailer from the results array
    const youtubeTrailer = json.results.find(
      (video: Videos) => video.site === 'YouTube' && video.type === 'Trailer'
    );

    if (youtubeTrailer) {
      console.log("YouTube Key:", youtubeTrailer.key);
      console.log(`Watch here: https://www.youtube.com/watch?v=${youtubeTrailer.key}`);
    }
  })
  .catch(err => console.error(err));
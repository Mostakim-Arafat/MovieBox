
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NGRmYTg2ZTEyYjZiZTNmMTE2Y2E2ZTY0OGZhNzFkNSIsIm5iZiI6MTc4OTY1NjY0OC41Nzc5OTk4LCJzdWIiOiI2YWFiZmU0ODY4Y2U3ZTM4YzMxMzA0MGUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.VwJbAwHxwwrkz1AHxj5XI_0RfqngJbYb2bRY8sbtLCc'
  }
};

// face problem to get data if use .env variable

export async function fetchPopularMovies() {
  try {
    const res = await fetch(`${TMDB_BASE_URL}/movie/popular?language=en-US&page=1`, options);
    if (!res.ok) throw new Error('Failed to fetch movies from TMDB');
    const data = await res.json();
    console.log(data)
    return data.results; // Returns an array of movie objects
  } catch (error) {
    console.error(error);
    return [];
  }
}

// fetchPopularMovies()


// const url = 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1';
// const options = {
//   method: 'GET',
//   headers: {
//     accept: 'application/json',
//     Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NGRmYTg2ZTEyYjZiZTNmMTE2Y2E2ZTY0OGZhNzFkNSIsIm5iZiI6MTc4OTY1NjY0OC41Nzc5OTk4LCJzdWIiOiI2YWFiZmU0ODY4Y2U3ZTM4YzMxMzA0MGUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.VwJbAwHxwwrkz1AHxj5XI_0RfqngJbYb2bRY8sbtLCc'
//   }
// };

// fetch(url, options)
//   .then(res => res.json())
//   .then(json => console.log(json))
//   .catch(err => console.error(err));
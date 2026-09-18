import { fetchPopularMovies } from "@/lib/fetchPopularTv"
import Image from 'next/image';
import Link from 'next/link';

interface Movie {
  id: string;
  title: string;
  poster_path: string;
  release_date: string
}

export default async function random() {
  const data = await fetch('http://localhost:3000/api/movies/TMDB/popular');
  const movies = await data.json()
  // console.log(movies)

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Trending Movies</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map((movie: Movie) => (
          <div key={movie.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            {/* TMDB Image Base URL setup */}
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              width={500}
              height={750}
              className="w-full h-auto object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold truncate">{movie.title}</h2>
              <p className="text-sm text-gray-400">{movie.release_date?.split('-')[0]}</p>
            </div>
          </div>
        ))}
        <iframe
          src="https://player.mux.com/Dy401555Qion9udLXKxY7bbRaziOW00zbM1pTp5iGEm1A"
          style={{ width: '100%', border: 'none', aspectRatio: '16 / 9' }}
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          allowFullScreen
        ></iframe>
      </div>
    </main>
  );
}
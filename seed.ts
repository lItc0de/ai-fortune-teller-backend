import { createClient } from "edgedb";

const client = createClient();

const INSERT_MOVIE = `
  with movies := <array<tuple<title: str, year: int64>>>$movies
  for movie in array_unpack(movies) union (
    insert Movie {
      title := movie.title,
      releaseYear := movie.year,
    }
  )
`;

const movies = [
  { title: "The Matrix", year: 1999 },
  { title: "The Matrix Reloaded", year: 2003 },
  { title: "The Matrix Revolutions", year: 2003 },
];

await client.execute(INSERT_MOVIE, { movies });

console.log(`Seeding complete.`);
process.exit();

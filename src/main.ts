import { fetchData } from "./libs/fetch";
import { IMovie } from "./types/entity";

interface IMovieResult {
  data: IMovie[];
}

const API_URL = "https://v1.appbackend.io/v1/rows/pw5dRPLwPNES";

async function renderMovies() {
  const movies = await fetchData<IMovieResult>(API_URL);

  if (!movies) {
    console.log(`Fetch data failed`);
    return;
  }

  movies.data.map((movie) => {
    const newMovie = document.createElement("div");
    const newMovieTitle = document.createElement("h3");
    const newMovieReview = document.createElement("p");
    const newMovieRating = document.createElement("p");
    const deleteButton = document.createElement("button");

    deleteButton.innerText = "delete";
    newMovieTitle.textContent = movie.title;
    newMovieReview.textContent = movie.review;
    newMovieRating.textContent = movie.rating.toString();

    newMovie.append(
      newMovieTitle,
      newMovieReview,
      newMovieRating,
      deleteButton
    );
    document.body.append(newMovie);
  });
}

renderMovies();

//Create new Movie

const titleInput = document.getElementById("title") as HTMLInputElement;
const reviewInput = document.getElementById("review") as HTMLTextAreaElement;
const ratingInput = document.getElementById("rating") as HTMLInputElement;
const submitBtn = document.getElementById("submitBtn");

submitBtn?.addEventListener("click", async () => {
  const title = titleInput.value;
  const review = reviewInput.value;
  const rating = ratingInput.value;

  try {
    await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([{ title, review, rating }]),
    });
  } catch (error) {
    console.log(error);
  } finally {
    window.location.reload();
  }
});

//Delete Movie

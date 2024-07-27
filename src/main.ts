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

  movies.data.forEach((movie) => {
    const newMovie = document.createElement("div");
    newMovie.classList.add("movie-card");
    const newMovieTitle = document.createElement("h3");
    const newMovieReview = document.createElement("p");
    const newMovieRating = document.createElement("div");
    newMovieRating.classList.add("movie-rating");
    const deleteButton = document.createElement("button");

    deleteButton.innerText = "Delete";
    deleteButton.classList.add("delete");

    newMovieTitle.textContent = movie.title;
    newMovieReview.textContent = movie.review;

    // Render star buat rating
    for (let i = 1; i <= 5; i++) {
      const star = document.createElement("span");
      star.classList.add("fa", "fa-star");
      if (i <= movie.rating) {
        star.classList.add("checked");
      }
      newMovieRating.appendChild(star);
    }

    deleteButton.addEventListener("click", async () => {
      await deleteMovie(movie._id);
      window.location.reload();
    });

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

const titleInput = document.getElementById("title") as HTMLInputElement;
const reviewInput = document.getElementById("review") as HTMLTextAreaElement;
const submitBtn = document.getElementById("submitBtn");

// Rating using stars
const stars = document.querySelectorAll("#rating .fa-star");
let selectedRating = 0;

stars.forEach((star, index) => {
  star.addEventListener("mouseover", () => {
    resetStars();
    highlightStars(index);
  });

  star.addEventListener("mouseout", resetStars);

  star.addEventListener("click", () => {
    selectedRating = index + 1;
    highlightStars(index);
  });
});

function resetStars() {
  stars.forEach((star) => star.classList.remove("checked"));
  stars.forEach((star, index: number) => {
    if (index < selectedRating) {
      star.classList.add("checked");
    }
  });
}

function highlightStars(index: number) {
  for (let i = 0; i <= index; i++) {
    stars[i].classList.add("checked");
  }
}

submitBtn?.addEventListener("click", async (e) => {
  e.preventDefault();
  const title = titleInput.value;
  const review = reviewInput.value;
  const rating = selectedRating; // Get the selected rating

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

async function deleteMovie(movieId: string) {
  try {
    await fetch(API_URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([movieId]),
    });
  } catch (error) {
    console.log(error);
  }
}

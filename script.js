document.addEventListener("DOMContentLoaded", function () {
    getRandomMeal();

    const searchInput = document.getElementById("searchInput");
    const prepareButton = document.getElementById("prepareButton");
    const backButton = document.getElementById("backButton");
    const mealContainer = document.getElementById("mealContainer");
    const mealContainers = document.getElementById("mealContainers");
    const main = document.getElementById("main");
    const mealContainers1 = document.getElementById("mealContainers1");
    const dishOfTheDay = document.querySelector(".dish");

    searchInput.addEventListener("keypress", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            searchMeal();
        }
    });

    prepareButton.addEventListener("click", getRandomMeal);
    backButton.addEventListener("click", goBack);

    function getRandomMeal() {
        const url = 'https://www.themealdb.com/api/json/v1/1/random.php';

        axios
            .get(url)
            .then((response) => {
                const randomMeal = response.data.meals[0];
                displayRandomMeal(randomMeal);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    function searchMeal() {
        const searchValue = searchInput.value;
        if (searchValue.trim() !== "") {
            const searchUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchValue}`;

            fetch(searchUrl)
                .then((response) => response.json())
                .then((data) => displayMealResults(data.meals))
                .catch((error) => console.log(error));
        }
    }

    function displayRandomMeal(meal) {
        dishOfTheDay.innerHTML = `<p>${meal.strMeal}</p><img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        `;
    }

    function displayMealContainers(mealId) {
        mealContainer.style.filter = "blur(12px)";
        dishOfTheDay.style.display = "none";
        mealContainers.style.display = "block";
        mealContainers1.style.display = "block";
        getIngredients(mealId);
    }

    function displayMealResults(meals) {
        mealContainer.innerHTML = "";
        mealContainer.style.display = "flex";

        meals.forEach((meal) => {
            const card = document.createElement("div");
            card.classList.add("card");

            const mealImage = document.createElement("img");
            mealImage.src = meal.strMealThumb;
            mealImage.alt = meal.strMeal;

            const mealName = document.createElement("h3");
            mealName.textContent = meal.strMeal;

            const cookButton = document.createElement("button");
            cookButton.classList.add("cook-btn");
            cookButton.dataset.mealid = meal.idMeal;
            cookButton.textContent = "Cook";

            card.appendChild(mealImage);
            card.appendChild(mealName);
            card.appendChild(cookButton);

            mealContainer.appendChild(card);

            cookButton.onclick = () => {
                console.log("hello world");
                displayMealContainers(meal.idMeal);
            };
        });
    }

    function getIngredients(mealId) {
        const ingredientsUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;

        fetch(ingredientsUrl)
            .then((response) => response.json())
            .then((data) => displayIngredients(data.meals[0]))
            .catch((error) => console.log(error));
    }

    function displayIngredients(meal) {
        mealContainers.innerHTML = "";

        const backBtn = document.createElement("button");
        backBtn.id = "backButton";
        backBtn.textContent = "Back";
        backBtn.onclick = () => {
            mealContainers.innerHTML = "";
            mealContainer.style.display = "flex";
            mealContainer.style.filter = "blur(0px)";
            dishOfTheDay.style.display = "block";
            mealContainers.style.display = "none";
            mealContainers1.style.display = "none";
        };

        const mealImage = document.createElement("img");
        mealImage.src = meal.strMealThumb;
        mealImage.alt = meal.strMeal;

        const mealName = document.createElement("p");
        mealName.innerHTML = meal.strMeal;

        const instructions = document.createElement("p");
        instructions.innerHTML = meal.strInstructions;

        const ingredientsList = document.createElement("p");
        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            if (ingredient) {
                const listItem = document.createElement("p");
                listItem.textContent = `${ingredient}: ${meal[`strMeasure${i}`]}`;
                ingredientsList.appendChild(listItem);
            } else {
                break;
            }
        }

        mealContainers.appendChild(backBtn);
        mealContainers.appendChild(mealImage);
        mealContainers.appendChild(mealName);
        mealContainers.appendChild(instructions);
        mealContainers.appendChild(ingredientsList);
    }
});

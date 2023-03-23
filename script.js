const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");

const savedTodoList = JSON.parse(localStorage.getItem("saved-items"));
const savedWeatherData = JSON.parse(localStorage.getItem("saved-weather"));

const createTodo = (storageData) => {
  let todoContents = todoInput.value;
  if (storageData) {
    todoContents = storageData.contents;
  }

  const newList = document.createElement("li");
  const newSpan = document.createElement("span");
  const newBtn = document.createElement("button");

  newBtn.addEventListener("click", () => {
    newList.classList.toggle("complete"); //toggle이기 때문에 클래스 생겼다 사라졌다함
    saveItemsFn();
  });

  newList.addEventListener("dblclick", () => {
    newList.remove();
    saveItemsFn();
  });

  //storageData && storageData.complete와 같다.
  if (storageData?.complete) {
    //storageData가 undefined가 아니고 실제로 존재할 때만
    newList.classList.add("complete");
  }

  newSpan.textContent = todoContents;
  newList.appendChild(newBtn);
  newList.appendChild(newSpan);
  todoList.appendChild(newList);
  todoInput.value = "";
  saveItemsFn();
};

const keyCodeCheck = () => {
  if (window.event.keyCode === 13 && todoInput.value.trim() !== "") {
    createTodo();
  }
};

const deleteAll = () => {
  const liList = document.querySelectorAll("li");
  for (let i = 0; i < liList.length; i++) {
    liList[i].remove();
  }
  saveItemsFn();
};

const saveItemsFn = () => {
  const saveItems = [];
  for (let i = 0; i < todoList.children.length; i++) {
    const todoObj = {
      contents: todoList.children[i].querySelector("span").textContent,
      complete: todoList.children[i].classList.contains("complete"),
    };
    saveItems.push(todoObj);
  }

  saveItems.length === 0
    ? localStorage.removeItem("saved-items")
    : localStorage.setItem("saved-items", JSON.stringify(saveItems));
};

const weatherDataActive = ({ location, weather }) => {
  const weatherMainList = [
    "Clear",
    "Cloud",
    "Drizzle",
    "Rain",
    "Snow",
    "Thunderstorm",
  ];
  weather = weatherMainList.includes(weather) ? weather : "Fog";
  const locationNameTag = document.querySelector("#location-name-tag");

  locationNameTag.textContent = location;
  document.body.style.backgroundImage = `url(./images/${weather}.jpg)`;

  // 이전에 통신했던 지역과 지금의 지역이 다르다면 혹은 지역은 같은데 날씨가 다를 경우
  if (
    !savedWeatherData ||
    savedWeatherData.location !== location ||
    savedWeatherData.weather !== weather
  ) {
    localStorage.setItem(
      "saved-weather",
      JSON.stringify({ location, weather })
    );
  }
};

const weatherSearch = ({ latitude, longitude }) => {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=dfdde8911b4fd61d3cbd48fc46902e13`
  )
    .then((res) => {
      // JSON.parse() response body만 존재할 때 사용가능, 응답 header도 존재하면 사용 불가
      return res.json();
    })
    .then((json) => {
      const weatherData = {
        location: json.name,
        weather: json.weather[0].main,
      };
      weatherDataActive(weatherData);
    })
    .catch((err) => {
      console.error(err);
    });
};

// 구조 분해 할당 !!
const accessToGeo = ({ coords }) => {
  const { latitude, longitude } = coords;
  // Key와 value의 이름이 똑같을 때, shorthand property라고 한다.
  const positionObj = {
    latitude,
    longitude,
  };

  weatherSearch(positionObj);
};

const askForLocation = () => {
  navigator.geolocation.getCurrentPosition(accessToGeo, (err) => {
    console.log(err);
  });
};

if (savedTodoList) {
  for (let i = 0; i < savedTodoList.length; i++) {
    createTodo(savedTodoList[i]);
  }
}

askForLocation();

if (savedWeatherData) {
  weatherDataActive(savedWeatherData);
}

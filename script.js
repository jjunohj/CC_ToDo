const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");

const savedTodoList = JSON.parse(localStorage.getItem("saved-items"));

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
  console.log(saveItemsFn());
};

const keyCodeCheck = () => {
  if (window.event.keyCode === 13 && todoInput.value !== "") {
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
    ? localStorage.removeItem("save-items")
    : localStorage.setItem("saved-items", JSON.stringify(saveItems));
};

if (savedTodoList) {
  for (let i = 0; i < savedTodoList.length; i++) {
    createTodo(savedTodoList[i]);
  }
}

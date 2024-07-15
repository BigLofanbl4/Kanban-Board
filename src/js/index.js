"use strict";

import { getId } from "./utils/generate_id.js";

const TASKS = {};

function Task(id, name, desc) {
  this.id = id;
  this.name = name;
  this.desc = desc;
}

const board = document.getElementById("board");

const clearTaskManagerInput = (taskManager) => {
  taskManager.querySelector(".taskManager__nameInp").value = "";
  taskManager.querySelector(".taskManager__descInp").value = "";
};

const openTaskManager = (event) => {
  if (!event.target.classList.contains("board__openTaskManagerBtn")) {
    return;
  }
  const taskManager = event.target.previousElementSibling;
  taskManager.hidden = false;

  // Скрыть кнопку "Add Task"
  event.target.hidden = true;
};

const closeTaskManager = (event) => {
  if (!event.target.classList.contains("taskManager__cancelBtn")) {
    return;
  }
  const taskManager = event.target.closest(".taskManager");
  taskManager.hidden = true;
  clearTaskManagerInput(taskManager);


  // Показать кнопку "Add Task"
  const openTaskManagerBtn = taskManager.nextElementSibling;
  openTaskManagerBtn.hidden = false;
};

const getTaskHTML = (id, taskName, taskDesc) => { 
  return `
    <div class="task" data-id="${id}">
      <div class="taskName">${taskName}</div>
      <div class="taskDesc">${
        taskDesc.length > 20 ? taskDesc.slice(0, 20) + "..." : taskDesc
      }</div>
    </div>`;
};

const addNewTask = (event) => {
  if (!event.target.classList.contains("task__saveBtn")) {
    return;
  }

  const taskManager = event.target.closest(".taskManager");
  
  const id = getId();
  const taskName = taskManager.querySelector(".taskManager__nameInp").value;
  const taskDesc = taskManager.querySelector(".taskManager__descInp").value;

  TASKS[id] = new Task(id, taskName, taskDesc);

  const taskHTML = getTaskHTML(id, taskName, taskDesc);
  taskManager.insertAdjacentHTML("beforebegin", taskHTML);

  clearTaskManagerInput(taskManager)
};

const dragTask = (event) => {
  event.target.ondragstart = function() {
    return false;
  };

  if (!event.target.closest(".task")) {
    return;
  }
    
  document.body.style.userSelect = "none";

  let target = event.target.closest(".task");

  let shiftX = event.clientX - target.getBoundingClientRect().left;
  let shiftY = event.clientY - target.getBoundingClientRect().top;

  target.style.position = "absolute";
  target.zIndex = 1000;

  const moveAt = (clientX, clientY) => {
    target.style.left = clientX - shiftX + "px";
    target.style.top = clientY - shiftY + "px";
  };

  let currentDroppable = null;

  const onMouseMove = (event) => {
    moveAt(event.clientX, event.clientY);
    
    target.hidden = true;
    let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
    target.hidden = false;

    if (!elemBelow) {
      currentDroppable = target.closest(".board__column");
      return;
    };

    let droppableBelow = elemBelow.closest(".board__column");

    if (currentDroppable != droppableBelow) {
      if (currentDroppable) {
        // leave
      }
      currentDroppable = droppableBelow;
      if (currentDroppable) {
        // enter
      }
    }
  };

  const onMouseUp = (event) => {
    if (target) {
      currentDroppable.querySelector(".board__column-tasks").prepend(target);
      target.style.position = "";
      target.style.zIndex = "";
    }
    
    document.body.style.userSelect = "";

    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
};

board.addEventListener("click", openTaskManager);
board.addEventListener("click", closeTaskManager);
board.addEventListener("click", addNewTask);

document.addEventListener("mousedown", dragTask);

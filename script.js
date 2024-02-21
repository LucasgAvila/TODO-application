const taskForm = document.getElementById("task-form");
const confirmCloseDialog = document.getElementById("confirm-close-dialog");
const openTaskFormBtn = document.getElementById("open-task-form-btn");
const closeTaskFormBtn = document.getElementById("close-task-form-btn");
const addOrUpdateTaskBtn = document.getElementById("add-or-update-task-btn");
const cancelBtn = document.getElementById("cancel-btn");
const discardBtn = document.getElementById("discard-btn");
const tasksContainer = document.getElementById("tasks-container");
const titleInput = document.getElementById("title-input");
const dateInput = document.getElementById("date-input");
const descriptionInput = document.getElementById("description-input");

//Esta matriz almacenará todas las tareas junto con sus datos asociados, incluido el título, la fecha de entrega y la descripción. Este almacenamiento le permitirá realizar un seguimiento de las tareas, mostrarlas en la página y guardarlas en localStorage.
const taskData = JSON.parse(localStorage.getItem("data")) || []; //Configure taskData para la recuperación de datos del almacenamiento local o de una matriz vacía. Asegúrese de analizar los datos que vienen con JSON.parse() porque los guardó como una cadena.


//Esta variable se utilizará para realizar un seguimiento del estado al editar y descartar tareas.
let currentTask = {}

//Puede mejorar la legibilidad y el mantenimiento del código refactorizando el detector de eventos de envío en dos funciones separadas.

const addOrUpdateTask = () => {
  addOrUpdateTaskBtn.innerText = "Add Task"
  const dataArrIndex = taskData.findIndex((item) => item.id === currentTask.id);
  const taskObj = {
    id: `${titleInput.value.toLowerCase().split(" ").join("-")}-${Date.now()}`,
    title: titleInput.value,
    date: dateInput.value,
    description: descriptionInput.value,
  };

   if (dataArrIndex === -1) {
    taskData.unshift(taskObj);
  }else {
    taskData[dataArrIndex] = taskObj;
  }

  localStorage.setItem("data", JSON.stringify(taskData));
  updateTaskContainer();
  reset();
}

const updateTaskContainer = () => {
  tasksContainer.innerHTML = ''; //para que no duplique la tarea
  taskData.forEach(({id, title, date, description}) => {
      (tasksContainer.innerHTML += `
        <div class="task" id="${id}">
          <p><strong>Title:</strong> ${title}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Description:</strong> ${description}</p>
          <button type="button" class="btn" onclick="editTask(this)" >Edit</button> 
          <button type="button" class="btn" onclick="deleteTask(this)">Delete</button> 
        </div>
      `)
    } 
  );
}
const deleteTask = (buttonEl) => {
  const dataArrIndex = taskData.findIndex(
    (item) => item.id === buttonEl.parentElement.id
  );
  buttonEl.parentElement.remove();
  taskData.splice(dataArrIndex, 1)
  localStorage.setItem("data", JSON.stringify(taskData));
}

const editTask = (buttonEl) => {
  const dataArrIndex = taskData.findIndex(
  (item) => item.id === buttonEl.parentElement.id
);

currentTask = taskData[dataArrIndex];

titleInput.value = currentTask.title;
dateInput.value = currentTask.date;
descriptionInput.value = currentTask.description;

addOrUpdateTaskBtn.innerText = "Update Task";
taskForm.classList.toggle("hidden");

}

//currentTask se completará con la tarea que el usuario pudo haber agregado.
const reset = () => {
  titleInput.value ="";
  dateInput.value ="";
  descriptionInput.value ="";
  taskForm.classList.toggle("hidden");
  currentTask = {}
}

//Puede verificar si hay una tarea dentro de taskData usando la longitud de la matriz. Como 0 es un valor falso, todo lo que necesita para la condición es la longitud de la matriz.
if(taskData.length){
  updateTaskContainer()
}

openTaskFormBtn.addEventListener("click", () =>
taskForm.classList.toggle("hidden")
); 

//Se utiliza para mostrar un cuadro de diálogo modal en una página web.
closeTaskFormBtn.addEventListener("click", () => {
  confirmCloseDialog.showModal();

  const formInputsContainValues =  titleInput.value || dateInput.value || descriptionInput.value; 

  const formInputValuesUpdated = titleInput.value !== currentTask.title || dateInput.value !== currentTask.date || descriptionInput.value !== currentTask.description; //Si el usuario intenta editar una tarea pero decide no realizar ningún cambio antes de cerrar el formulario, no es necesario mostrar el modal con los botones Cancelar y Descartar.
  
  if(formInputsContainValues){
    confirmCloseDialog.showModal() && formInputValuesUpdated () //This way, the Cancel and Discard buttons in the modal won't be displayed to the user if they haven't made any changes to the input fields while attempting to edit a task.
  }else{
    reset();
  }
});

//Si el usuario hace clic en el botón Cancelar, desea cancelar el proceso (cerrar el modal que muestra los dos botones) para que el usuario pueda continuar editando.
cancelBtn.addEventListener("click", () =>
confirmCloseDialog.close()
)

//Si el usuario hace clic en el botón Descartar, desea cerrar el modal que muestra los botones Cancelar y Descartar y luego ocultar el modal del formulario.
discardBtn.addEventListener('click', () => {
    confirmCloseDialog.close()
    reset();
  })

//obtener los valores de los campos de entrada, guardarlos en la matriz taskData y mostrarlos en la página.
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addOrUpdateTask()
});

// const myTaskArr = [
//   { task: "Walk the Dog", date: "22-04-2022" },
//   { task: "Read some books", date: "02-11-2023" },
//   { task: "Watch football", date: "10-08-2021" },
// ];

// localStorage.setItem("data", JSON.stringify(myTaskArr)); // para guardar los datos en el almacenamiento local

// const getTaskArr = localStorage.getItem("data"); //Utilice el método getItem() para recuperar la matriz myTaskArr y asignarla a la variable getTaskArr.

// const getTaskArrObj = JSON.parse(localStorage.getItem('data'));

// localStorage.removeItem('data')
// localStorage.clear();
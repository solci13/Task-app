window.onload = function() {
  const nombreUsuario = prompt("Ingresa tu Nombre.");
  document.getElementById("welcome").innerHTML = `Bienvenido/a ${nombreUsuario} ¡Gracias por usar nuestra Aplicación de Tareas!`;

  setFechaYHoraActual(); // Establecer fecha y hora actuales al cargar
  getTasks(); // Mostrar tareas existentes
}

document.getElementById('formTask').addEventListener('submit', saveTask);

function setFechaYHoraActual() {
  const ahora = new Date();
  document.getElementById('fecha').value = ahora.toISOString().split('T')[0];
  document.getElementById('hora').value = ahora.toTimeString().slice(0, 5);
}

function saveTask(e) {
  e.preventDefault();

  const task = {
    id: Date.now(),
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    fecha: document.getElementById('fecha').value,
    hora: document.getElementById('hora').value,
    done: false
  };

  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  const editIndex = localStorage.getItem('editIndex');
  if (editIndex !== null) {
    tasks[editIndex] = task;
    localStorage.removeItem('editIndex');
  } else {
    tasks.push(task);
  }

  localStorage.setItem('tasks', JSON.stringify(tasks));
  getTasks();
  setFechaYHoraActual();

  // Limpiar campos
  document.getElementById('title').value = '';
  document.getElementById('description').value = '';
  document.getElementById('submitButton').textContent = 'Guardar';
}

function deleteTask(index) {
  const confirmDelete = confirm("¿Quieres eliminar la tarea?");
  if (!confirmDelete) return;

  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.splice(index, 1);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  getTasks();
}
//funcion editar tareas
function editTask(index) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const task = tasks[index];

  document.getElementById('title').value = task.title;
  document.getElementById('description').value = task.description;
  document.getElementById('fecha').value = task.fecha;
  document.getElementById('hora').value = task.hora;
  localStorage.setItem('editIndex', index);

  document.getElementById('submitButton').textContent = 'Actualizar';
}
//funcion tareas hechas 
function toggleDone(index) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks[index].done = !tasks[index].done;
  localStorage.setItem('tasks', JSON.stringify(tasks));
  getTasks();
}

function getTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const tasksView = document.getElementById('tasks');

  tasksView.innerHTML = `
    <h1>Mis Tareas</h1>
    ${tasks.map((task, index) => {
      const [year, month, day] = task.fecha ? task.fecha.split("-") : ['0000','00','00'];
      const fechaSimple = `${day}/${month}/${year}`;
      const horaSimple = task.hora || '--:--';
      
      const claseTitulo = `titulo-tarea ${task.done ? 'tarea-hecha' : 'tarea-pendiente'}`;
      const claseCard = `lista-de-tareas ${task.done ? 'tarea-hecha-bg' : 'tarea-pendiente-bg'}`;

      return `
        <div class="${claseCard}">
          <div class="card-body">
            <p>
              <span class="${claseTitulo}">${task.title}</span> ${task.description}
              <br> ${fechaSimple} - ${horaSimple}
              <a href="#" title="Eliminar" onclick="deleteTask(${index})" class="fas fa-trash-alt" style="color:black; margin-left:10px;"></a>
              <a href="#" title="Editar" onclick="editTask(${index})" class="far fa-edit" style="color:white; margin-left:10px;"></a>
              <a href="#" title="Marcar como ${task.done ? 'pendiente' : 'hecha'}" onclick="toggleDone(${index})" class="fas fa-check" style="color:black; margin-left:10px;"></a>
            </p>
          </div>
        </div>
      `;
    }).join('')}
  `;
}
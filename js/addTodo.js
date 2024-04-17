const addTaskForm = document.getElementById('addTaskForm');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');

function validateTitle() {
  const title = titleInput.value.trim();
  if (title.length === 0) {
    titleInput.classList.add('error');
  } else {
    titleInput.classList.remove('error');
    titleInput.classList.add('success');
  }
}

function validateDescription() {
  const description = descriptionInput.value.trim();
  if (description.length === 0) {
    descriptionInput.classList.add('error');
  } else {
    descriptionInput.classList.remove('error');
    descriptionInput.classList.add('success');
  }
}

titleInput.addEventListener('input', validateTitle);
descriptionInput.addEventListener('input', validateDescription);

addTaskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();
  if (!titleInput.classList.contains('success') || !descriptionInput.classList.contains('success')) {
    alert('Please fill out the form correctly.');
    return;
  }
  const taskData = { title, description };
  console.log(taskData);
  addTaskForm.reset();
});
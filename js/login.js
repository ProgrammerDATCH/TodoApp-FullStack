
const serverLink = "http://localhost:9090/api";

const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const signupBtn = document.getElementById('signupBtn');
const loginBtn = document.getElementById('loginBtn');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const nameInput = document.getElementById('name');
const signupEmailInput = document.getElementById('signupEmail');
const signupPasswordInput = document.getElementById('signupPassword');
const signupPasswordConfirmInput = document.getElementById('signupPasswordConfirm');

function validateName() {
  const name = nameInput.value.trim();
  const nameRegex = /^(?![0-9])[a-zA-Z0-9]{5,}$/;
  if (!nameRegex.test(name)) {
    nameInput.classList.remove('success');
    nameInput.classList.add('error');
    return false;
  } else {
    nameInput.classList.remove('error');
    nameInput.classList.add('success');
    return true;
  }
}

function validateEmail(input) {
  const email = input.value.trim();
  const emailRegex = /^[a-zA-Z][a-zA-Z0-9._]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isValid = emailRegex.test(email);
  if (!isValid) {
    input.classList.remove('success');
    input.classList.add('error');
    return false;
  } else {
    input.classList.remove('error');
    input.classList.add('success');
    return true;
  }
}

function validatePassword(input) {
  const password = input.value.trim();
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
  if (!passwordRegex.test(password)) {
    input.classList.remove('success');
    input.classList.add('error');
    return false;
  } else {
    input.classList.remove('error');
    input.classList.add('success');
    return true;
  }
}
function checkPasswordsEquality(firstPassword, secondPassword) {
  if(firstPassword.value.trim().length < 1 || (firstPassword.value.trim() != secondPassword.value.trim())) {
    secondPassword.classList.remove('success');
    secondPassword.classList.add('error');
    return false;
  }
  else{
    secondPassword.classList.remove('error');
    secondPassword.classList.add('success');
    return true;
  }
}

function showSignupForm() {
  loginForm.style.display = 'none';
  signupForm.style.display = 'block';
}

function showLoginForm() {
  signupForm.style.display = 'none';
  loginForm.style.display = 'block';
}

nameInput.addEventListener('input', validateName);
emailInput.addEventListener('input', () => validateEmail(emailInput));
signupEmailInput.addEventListener('input', () => validateEmail(signupEmailInput));
passwordInput.addEventListener('input', () => validatePassword(passwordInput));
signupPasswordInput.addEventListener('input', () => checkPassword(signupPasswordInput.value.trim()));
signupPasswordConfirmInput.addEventListener('input', () => checkPasswordsEquality(signupPasswordInput, signupPasswordConfirmInput));


signupBtn.addEventListener('click', showSignupForm);
loginBtn.addEventListener('click', showLoginForm);

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  let hasError = false;
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  if(!validateEmail(emailInput)){
    document.getElementById('emailError').innerText = 'Invalid email';
    hasError = true;
  }
  if(!validatePassword(passwordInput)){
    document.getElementById('passwordError').innerText = 'Weak password';
    hasError = true;
  }
  if(emailInput.value.trim() == ""){
    document.getElementById('emailError').innerText = 'Enter email please';
    hasError = true;
  }
  if(passwordInput.value.trim() == ""){
    document.getElementById('passwordError').innerText = 'Enter password please';
    hasError = true;
  }
  if(hasError) return;
  const userData = { email, password };
  const apiData = await callAPI("/user/login", "POST", userData)
  if(apiData.status){
    document.cookie = `token=${apiData.message.token}; path=/`;
    window.location.href = "/index.html";
  }  
  else{
    alert("Login Failed: " + apiData.message)
  }
});

signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  let hasError = false;
  const name = nameInput.value.trim();
  const email = signupEmailInput.value.trim();
  const password = signupPasswordInput.value.trim();
  if(!validateName(nameInput)){
    document.getElementById('nameError').innerText = 'Invalid Name';
    hasError = true;
  }
  if(!validateEmail(signupEmailInput)){
    document.getElementById('signupEmailError').innerText = 'Invalid email';
    hasError = true;
  }
  if(!checkPasswordsEquality(signupPasswordInput, signupPasswordConfirmInput)){
    document.getElementById('signupPasswordConfirmError').innerText = 'Passwords do not match';
    hasError = true;
  }
  if(nameInput.value.trim() == ""){
    document.getElementById('nameError').innerText = 'Enter your names please';
    hasError = true;
  }
  if(signupEmailInput.value.trim() == ""){
    document.getElementById('signupEmailError').innerText = 'Enter email please';
    hasError = true;
  }
  if(signupPasswordInput.value.trim() == ""){
    document.getElementById('signupPasswordError').innerText = 'Enter password please';
    hasError = true;
  }
  if(signupPasswordConfirmInput.value.trim() == ""){
    document.getElementById('signupPasswordConfirmError').innerText = 'Enter confirm password please';
    hasError = true;
  }
  if(hasError) return;
  const userData = { name, email, password };
  const apiData = await callAPI("/user/register", "POST", userData)
  if(apiData.status){
    showLoginForm();
  }
});



function checkPassword(passwordValue) {
  const requirements = [
      { regex: /[A-Z]/g, message: " Uppercase | " },
      { regex: /[a-z]/g, message: "Lowercase | " },
      { regex: /\d/g, message: "Digit | " },
      { regex: /[^A-Za-z0-9]/g, message: "Special Char | " },
      { regex: /.{8,}/g, message: "8 Chars" }
  ];
  errorPassword.innerHTML = "";
  passwordError.innerText = "";
  let allMatches = true;
  requirements.forEach(requirement => {
      const span = document.createElement("span");
      span.classList.add("single-error-span");
      const isValid = requirement.regex.test(passwordValue);
      span.classList.add(isValid ? "validPass" : "invalidPass");
      span.innerHTML = ` ${requirement.message} `;
      errorPassword.appendChild(span);
      allMatches = allMatches && isValid;
  });
  if (allMatches) {
      signupPasswordInput.classList.remove("error");
      signupPasswordInput.classList.add("success");
      errorPassword.innerHTML = "";
  } else {
      signupPasswordInput.classList.remove("success");
      signupPasswordInput.classList.add("error");
  }
}





async function callAPI(apiLink, apiMethod, apiData){
  const res = await fetch(`${serverLink}${apiLink}`, {
      method: apiMethod,
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(apiData),
  });
  if (!res.ok) {
      console.error('Failed to call API');
      return false;
  }
  const data = await res.json();
  return data;
}
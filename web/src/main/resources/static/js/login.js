var signupBtn = document.getElementById('signup-btn');
var loginBtn = document.getElementById('login-btn');

var cover = document.getElementById('cover');
var popup = document.getElementById('popup');
var loginForm = document.getElementById('login-form');
var regForm = document.getElementById('reg-form');

var reg = document.getElementById('reg');
var login = document.getElementById('login');

// signup
var username = document.getElementById('username');
var email = document.getElementById('email');
var password = document.getElementById('password');

// login
var usernameLogin = document.getElementById('user');
var passwordLogin = document.getElementById('pass');

var cancel = document.getElementById('cancel');

signupBtn.addEventListener('click', function () {
	// Show the popup
	cover.style.display = 'block';
	loginForm.style.display = 'none';
	regForm.style.display = 'grid';
	popup.style.display = 'block';
});
loginBtn.addEventListener('click', function () {
	// Show the popup
	cover.style.display = 'block';
	regForm.style.display = 'none';
	loginForm.style.display = 'grid';

	popup.style.display = 'block';
});

reg.addEventListener('click', function (event) {
	// Prevent the default behavior of the form submission
	event.preventDefault();
	// Get the input values
	var usernameValue = username.value;
	var passwordValue = password.value;
	var emailValue = email.value;
	console.log(usernameValue);
	// Validate the input values
	if (usernameValue && passwordValue && emailValue) {
		// Send the login data to a server using the fetch method
		fetch('http://localhost:8080/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				username: usernameValue,
				email: emailValue,
				password: passwordValue,
			}),
		})
			.then(function (response) {
				// Handle the response
				if (response.ok) {
					// Login successful
					alert('Register successful');
					window.location.href = "./login";
				} else {
					// Login failed
					alert('Register failed');
				}
			})
			.catch(function (error) {
				// Handle the error
				alert('Error: ' + error);
			});
	} else {
		// Input values are empty
		alert('Please enter your username and password');
	}
});

login.addEventListener('click', function (event) {
	// Prevent the default behavior of the form submission
	event.preventDefault();
	// Get the input values

	var usernameValue = usernameLogin.value;
	var passwordValue = passwordLogin.value;

	// Validate the input values
	if (usernameValue && passwordValue) {
		// Send the login data to a server using the fetch method
		fetch('http://localhost:8080/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				username: usernameValue,
				password: passwordValue,
			}),
		})
			.then(function (response) {
				// Handle the response
				if (response.ok) {
					// Login successful
					alert('Login successful');
					window.location.href = "./play";
				} else {
					// Login failed
					alert('Login failed');
				}
			})
			.catch(function (error) {
				// Handle the error
				alert('Error: ' + error);
			});
	} else {
		// Input values are empty
		alert('Please enter your username and password');
	}
});

document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var message = document.getElementById('message').value;
    var feedback = document.getElementById('form-feedback');

    // Simple Validation
    if (name.trim() === '' || email.trim() === '' || message.trim() === '') {
        feedback.textContent = 'Please fill out all fields.';
        feedback.className = 'alert alert-danger';
        return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        feedback.textContent = 'Please enter a valid email address.';
        feedback.className = 'alert alert-danger';
        return;
    }
    name = name.split(" ").join("%20");
    message = message.split(" ").join("%20");
    console.log("Opening");
    fetch();
    // Success message
    feedback.textContent = 'Thank you for your message!';
    feedback.className = 'alert alert-success';

    // Reset the form
    this.reset();
});
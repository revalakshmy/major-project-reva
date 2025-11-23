// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

//for toggle button
document.addEventListener("DOMContentLoaded", () => {

    const toggleBtn = document.getElementById("theme-toggle");
    const icon = document.getElementById("theme-icon");

    // Load saved theme
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");
    }

    // Toggle theme
    toggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");

        if (document.body.classList.contains("dark-mode")) {
            // Switch to dark mode
            icon.classList.remove("fa-moon");
            icon.classList.add("fa-sun");
            localStorage.setItem("theme", "dark");
        } else {
            // Switch to light mode
            icon.classList.remove("fa-sun");
            icon.classList.add("fa-moon");
            localStorage.setItem("theme", "light");
        }
    });
});

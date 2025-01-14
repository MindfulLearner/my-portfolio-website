"use strict"

document.addEventListener('DOMContentLoaded', async () => {

    // Fetch and append the template content to both navbars
    const templateContent = document.querySelector('#navbar-template').content;

    const mainNavbar = document.getElementById('main-navbar');
    const lowerNavbar = document.getElementById('lower-navbar');

    if (mainNavbar) {
        const mainNavbarContent = templateContent.cloneNode(true);
        const mainThemeToggler = mainNavbarContent.querySelector('.navbar__theme-toggler');
        mainThemeToggler.id = 'theme-toggler-main'; // Assign a unique ID
        mainNavbar.appendChild(mainNavbarContent);
    }

    if (lowerNavbar) {
        const lowerNavbarContent = templateContent.cloneNode(true);
        const lowerThemeToggler = lowerNavbarContent.querySelector('.navbar__theme-toggler');
        lowerThemeToggler.id = 'theme-toggler-lower'; // Assign a unique ID
        lowerNavbar.appendChild(lowerNavbarContent);
    }

    // Fetch the theme togglers after appending the content
    const themeTogglerMain = document.getElementById('theme-toggler-main');
    const themeTogglerLower = document.getElementById('theme-toggler-lower');



    // Check if the required elements exist in the DOM
    if (!lowerNavbar || !themeTogglerMain || !themeTogglerLower) {
        console.error('Required elements are missing from the DOM.');
        return;
    }

    let lastScrollY = window.scrollY;
    const threshold = 80;

    lowerNavbar.classList.remove('visible');

    // Throttled scroll event listener
    let isThrottled = false;
    const throttleDuration = 80;

    window.addEventListener('scroll', () => {
        if (isThrottled) return;

        isThrottled = true;
        setTimeout(() => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > threshold) {
                lowerNavbar.classList.add('visible');
            } else if (currentScrollY <= threshold) {
                lowerNavbar.classList.remove('visible');
            }

            lastScrollY = currentScrollY;
            isThrottled = false;
        }, throttleDuration);
    });

    // Theme toggle function
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark_mode');
    } else if (savedTheme === 'light') {
        document.body.classList.remove('dark_mode');
    }

    // Function to handle theme toggle for both buttons
    function toggleTheme(themeToggler) {
        themeToggler.addEventListener('click', () => {
            document.body.classList.toggle('dark_mode');
            const currentTheme = document.body.classList.contains('dark_mode') ? 'dark' : 'light';
            localStorage.setItem('theme', currentTheme);
        });
    }

    // Initialize theme toggle for both main and lower navbar
    toggleTheme(themeTogglerMain);
    toggleTheme(themeTogglerLower);

    // Select navbar links AFTER appending template content
    const navLinks = document.querySelectorAll(".navbar__links a");
    console.log(navLinks);

    const images = document.querySelectorAll('img');

    images.forEach(image => {
        // Ensure the images are loaded before applying the transition
        if (image.complete) {
            image.classList.add('loaded');
        } else {
            image.addEventListener('load', () => {
                image.classList.add('loaded');
            });
        }
    });

    // Populating projects
    const projectsSection = document.getElementById("projects-section");
    const projectTemplate = document.getElementById("project-template");

    try {
        // Fetch the JSON data
        const response = await fetch("data/projects.json");
        if (!response.ok) {
            throw new Error("Failed to fetch project data");
        }
        const projects = await response.json();

        console.log(projects);

        // Loop through each project and populate the template
        Object.values(projects).forEach(project => {
            const clone = projectTemplate.content.cloneNode(true);
            const link = clone.querySelector("a");
            const title = clone.querySelector("h3");
            const stack = clone.querySelector("p");

            // Populate the template with data
            link.href = project.url;
            title.textContent = project.title;
            stack.textContent = `Stack: ${project.stack}`;

            // Append the populated template to the section
            projectsSection.appendChild(clone);
        });
    } catch (error) {
        console.error("Error loading projects:", error);
    }


    setTimeout(() => {
        // Remove "preload" class and add "loaded" class
        document.body.classList.remove("preload");
        document.body.classList.add("loaded");

        // Remove the preloader element
        const preloader = document.querySelector(".preloader");
        if (preloader) {
            preloader.remove();
        }

        adjustProjectWidth();
    }, 50);

});


function adjustProjectWidth() {
    const projects = document.querySelectorAll('.project');
    let maxWidth = 0;

    // Find the maximum width of the projects
    projects.forEach(project => {
        const projectWidth = project.offsetWidth;
        if (projectWidth > maxWidth) {
            maxWidth = projectWidth;
        }
    });

    // Apply the maximum width to all projects
    projects.forEach(project => {
        project.style.width = `${maxWidth}px`;
    });
}

// adjustable 768px threshold
let lastWidth = window.innerWidth;

window.addEventListener('resize', function () {
    const currentWidth = window.innerWidth;

    if ((lastWidth > 768 && currentWidth <= 768) || (lastWidth <= 768 && currentWidth > 768)) {
        location.reload(); // Reload the page
    }

    lastWidth = currentWidth;
});

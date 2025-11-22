// Project Data
const projects = [
    {
        title: "DATA_STRUCTURES",
        description: "A comprehensive collection of Data Structures and Algorithms implementations in C++. Includes Linked Lists, Trees, Graphs, and Sorting algorithms.",
        tags: ["C++", "DSA", "Algorithms"],
        link: "https://github.com/ishtiaq-ahmed-dev/DATA_STRUCTURES"
    },
    {
        title: "Cpp",
        description: "A custom C++ library providing utility functions and helper classes for efficient coding and problem solving.",
        tags: ["C++", "Library", "Utils"],
        link: "https://github.com/ishtiaq-ahmed-dev/Cpp-Library"
    },
    {
        title: "Python",
        description: "A documented journey of learning Python, containing configuration files, basic scripts, and learning resources.",
        tags: ["Python", "Config", "Learning"],
        link: "https://github.com/ishtiaq-ahmed-dev/PYTHON_Basics_Learning_Journey"
    }
];

// Render Projects
const projectsGrid = document.getElementById('projects-grid');

function renderProjects() {
    projectsGrid.innerHTML = projects.map(project => `
        <article class="project-card">
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                </div>
                <p class="project-desc">${project.description}</p>
                <a href="${project.link}" target="_blank" rel="noopener noreferrer" class="btn btn-outline project-link">View Code</a>
            </div>
        </article>
    `).join('');
}

// Mobile Menu Toggle
const mobileBtn = document.querySelector('.mobile-menu-btn');
const navList = document.querySelector('.nav-list');
const navLinks = document.querySelectorAll('.nav-link');

mobileBtn.addEventListener('click', () => {
    navList.classList.toggle('active');
    mobileBtn.classList.toggle('active');
});

// Close menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navList.classList.remove('active');
        mobileBtn.classList.remove('active');
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderProjects();
});

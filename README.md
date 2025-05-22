# Escuela de Surf Website

A modern, responsive website for a surf school featuring class details, instructor profiles, scheduling information, and contact options. The website uses a dark mode theme for better visibility and a more modern look.

## Features

- Responsive design
- Dark mode theme
- Class descriptions and information
- Instructor profiles
- Class schedule
- Contact form
- Dynamic navigation with scroll effects
- Modern, clean UI
- Animations

## Project Structure

```
├── index.html            # Main landing page
├── classes.html          # Classes information page
├── instructors.html      # Instructor profiles page
├── schedule.html         # Class schedule page
├── contact.html          # Contact information page
├── styles/               # CSS and SCSS stylesheets
│   ├── style.scss        # Main SCSS source file
│   ├── style.css         # Compiled CSS file
│   └── style.css.map     # Source map for debugging
├── js/                   # JavaScript files
│   └── main.js           # Main JavaScript functionality
├── images/               # Image assets
└── README.md             # Project documentation
```

## Setup

1. Clone the repository
2. Open `index.html` in your browser
3. For development, use a local server (e.g., Live Server in VS Code)

## Development

### Sass Compilation

This project uses Sass for styling. To compile the Sass files:

```bash
sass styles/style.scss:styles/style.css
```

For automatic compilation during development:

```bash
sass --watch styles/style.scss:styles/style.css
```

## Technologies Used

- HTML5
- CSS3
- Sass/SCSS
- JavaScript
- Responsive design principles
- CSS variables for theming

## Version Control

This project uses Git for version control. Follow these steps to contribute:

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

MIT License 
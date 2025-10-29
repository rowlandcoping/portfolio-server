# Portfolio Site - Server

Welcome to the Readme for my portfolio server. This is the REST API platform for my portfolio site and also hosts the admin front end, written in vanilla JS using ESM syntax.  I made this design choice for a couple of reasons - one is that it provides a neat separation of concerns, and the other that is significantly simplifies the front end and the security of the platform.  Rather than passing JWTs between front-end and back-end the server has session based authentication and the front-end simply consumes the appropriate APIs.  

Please note the admin front-end is very much in an MVP state - whilst fully functional and fully validated in the various controllers, front-end form validation is spotty and by no means complete.  Whilst roles are included in the data models they are not yet active; the styling is rudimentary, it is not html5 compliant and page responsiveness has not been refined. This means that whilst this project could easily be scaled to support multiple users, and could certainly provide a platform for more than one similar site even in its current state, it is not yet ready to provide access to third parties.

## Live Demo
You can view the live server [here](https://server.rowlandnet.online).

## Features
- Smart and comprehensive data structure.
- Session-based authentication.
- API returns user-specific data, potential supporting multiple front-ends.
- Prisma schema for tight schema management in dev, pg queries for compatibility and speed.
- Complex image handling managed with JS and Multer.

## Technologies Used
- HTML
- CSS3 (Flexbox)
- JavaScript (ES6+)
- Node.js (Express, Multer)
- PostgreSQL (pg, Prisma)
- Currently hosted on shared hosting by NameCheap

## Local Installation Instructions

The great thing about using Node.js is how easy it is to set up and implement.

1) Clone this repository.
2) I have used VS code on Linux Mint in dev, and simply saved the repository to my local machine using:
    - `crtl/shift/p`
    - `git:Clone` (please note you will need to connect VS Code to Github first)
    - select your cloned repository and where you want to save it locally.
3) I've been using Node Version Manager to keep the version updated and also avoid clutter, so once you have the repo open, in the terminal:
    - `nvm install node`
    - `npm install`
    - `npm run dev`: runs the server
4) Install the postgres on your local machine:
    - `sudo apt update` (update packages)
    - `sudo apt install postgresql postgresql-contrib`
5) In the terminal switch to the superuser and access the postgres shell:
    - `sudo -i -u postgres`
    - `psql`
6) Create the database and the user (as required)
    - `CREATE DATABASE portfolio;`
    - `CREATE USER myUser WITH PASSWORD myPassword;`
    - `GRANT ALL PRIVILEDGES ON DATABASE portfolio TO myUser;`
7) Extended priviledges (!important!) - you may not need all of these but this should alleviate many permissions issues you may have, especially on a shared host. Postgres is picky about who it gives access to.
    - `GRANT ALL ON SCHEMA public TO myUser;`;
    - `GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO myUser;`
    - `GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO myUser;`
    - `GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO myUser;`
    - `GRANT ALL PRIVILEGES ON SCHEMA _prisma_migrations TO myUser;` (shouldn't need this initially)
8) Set up database connection details in your .env file (note the port number may vary but this is default).  Note there is both a string and seperate values here - the code currently uses both at various points so I'm sure there is room for a refactor here:
    - `DATABASE_URL=postgresql://myUser:myPassword@localhost:5432/portfolio`
    - `DB_USER=myUser`
    - `DB_PASS=myPass`
    - `DB_HOST=localhost`
    - `DB_PORT=5432`
    - `DB_NAME=portfolio`
    - `DB_SSL=false`
9) You *should* now be ready to apply the Prisma schema to your virgin database. If something goes wrong at this point I'm not surprised.  Setting this up took a lot of wrangling and I tried many things before I got it running.
    - `npx prisma db push`
10) Finally, apply the other .env settings:
    - `NODE_ENV=development` (assuming this is a dev server)
    - `ORIGINS=http://localhost:5173,http://localhost:3500` (allowed origins for CORS - client and server.  In dev they ought to look like this)
    - `SESSION_SECRET=yourSecretKey` (you should generate this yourself, it's for managing secure sessions)
11) You will need to create your first user manually, I suggest using postman for this. When you create this user take note of the UUID that is echoed back - this needs to be entered into the environment variables of your client so that it can pull in your projects and profile.

If you are interested in using the node server as a back-end for your own portfolio please [contact me](https://rowlandnet.online/profile/contact), I'm always happy to help (although I'll need to to a bunch of work to make it ready for such things!)
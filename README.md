# Docker Panel
A simple web panel that allows you to run Docker containers.

## Setup
Firstly you must have Docker installed as this app requires it (for obvious reasons) and you need to have Node.js running on your computer. To start you can pull the image and run it via Docker or simply run the start commands in your command prompt. 

### If not using Docker nagviate to the root directory and insert the following commands in seperate sessions:
```
cd api
npm start
------
cd client
npm start
```
The web server should now be accessible from http://localhost:3000

The api runs on port 8080 but can be changed in the .env file


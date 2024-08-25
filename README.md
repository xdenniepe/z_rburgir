# README #

This README would normally document whatever steps are necessary to get your application up and running.

### What is this repository for? ###

* Quick summary
* Version
* [Learn Markdown](https://bitbucket.org/tutorials/markdowndemo)

### How do I get set up? ###
# Setup Database
Run Database from Docker

- **Step 1:** Run docker-compose with `docker-compose up`
- **Step 2:** Open MySQL Workbench in your applications
- **Step 3:** Create a database `burgerman`
- **Step 4:** Run DDL scripts from `../DDL`

# How to Install and Run the Project
Install the dependencies and start the server.

- **Step 1:** Clone this repository
- **Step 2:** Go to cloned repository directory:
- **Step 3:** Install dependencies with `./mvnw install`
- **Step 4:** Create the env file and get env variables
- **Step 5:** Export environment variables using `export $(cat .env | tr -d ' ' | grep -v "#" | xargs)`

```
cd api
./mvnw install
export $(cat .env | tr -d ' ' | grep -v "#" | xargs)
export $(cat .env | xargs)
```

### Using .SH for windows:
```
bash run-install.sh
```

### Run
### Run Authentication Service
- **Step 1:** Go to auth directory with `cd auth`
- **Step 2:** Run development server locally with `./mvnw spring-boot:run`

### Using .SH for windows:
```
bash run-auth.sh
```

For Production Environment :
```
No Production Environment Yet
```
### Contribution guidelines ###

* Writing tests
* Code review
* Other guidelines

### Who do I talk to? ###

* Repo owner or admin
* Other community or team contact# z_rburgir

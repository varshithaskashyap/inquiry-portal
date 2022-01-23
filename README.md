<!Doctype HTML>
<h1 align="center">Inquiry Portal</h1>
<h3 align="center">A chat application to interact with Client/Agent!</h3>

A Realtime Inquiry portal built on **NodeJS**  with **MySQL** database backend to chat with clients/Agents  in realtime and ask any inquiry related to anything built using **websockets** without using any **external libraries** for front end.

<kbd>![preview](preview/preivew.gif?raw=true)</kbd>

### Login System (Built not using any external libraries) :
<kbd>![nodejsloginsystem](https://raw.githubusercontent.com/kushtej/my-miscellaneous-projects/master/nodejs-login-system/preview.gif?raw=true " ")</kbd>


### Agent Portal :
<kbd>![preview](preview/agent.png?raw=true " ")</kbd>

### Visitor Portal : 

<kbd>![preview](preview/visitor.png?raw=true " ")</kbd>

## Setting up the project :

**Step-01 :** **Cloning the project**
```
$ git clone https://github.com/kushtej/nodejs-inquiry-portal.git
```
**Step-02 :** **Setting up the Database**

1. Change DB username and DB password in **`database/db_auth.js`** 
2. Run the following file to setup database `./database/db_exec.sh`

**Step-03 :** **Installing Node Dependencies and Running the Server**

```
$ npm install
$ npx nodemon
```

The Node Server will run on **PORT:3000** and Websocket will run on **PORT:3001**


**Step-04:**  **Now open your Web-Browser and paste the following url :**

```
http://127.0.0.1:3000/
```

# BookMyNanny

### Group: Fantastic 4

**Members:**

- Sushil Rajeeva Bhandary (20015528)
- Sabitha Rachel Nazareth (20012150)
- Sai Bandla (20011577)
- Kavitha Siratla (20012554)

---

## Function and General Overview

Our project, titled **BookMyNanny**, is a full-stack application designed to bridge the gap between parents and potential nannies. With the growing demand for trusted child-care services, our platform aims to provide a reliable space where parents can discover, interact with, and hire nannies based on multiple criteria. Our platform allows users to post listing when they need a nanny. The nannies which are verified by the admin are allowed to apply for the posted listings by parents. Then once the parents have seen and approved one of the interested nannies.

With an in-built messaging system, parents and nannies can communicate effortlessly, ensuring clarity in requirements and schedules. Once the job is completed by the nanny. The nanny will be able to click complete job and enter the hours worked prompting a payment amount for the parent which posted the listing. If the parent does not approve the job completion the nanny can re-enter a hours worked. One the parent approves the job will be set to completed. The dynamics of the payment are expected to decided by the nanny and parent through the chat. Nannies prefer to be paid through cash or zele. The website and the developers don't take any cut or interfer in this process.

## Different Roles in this app:

There are three possible roles in this app. A user can be a parent, nanny or admin. A user can sign up as a parent or nanny. There will be only one admin account used to verify nannies who have signed up.

Admin Credentials:
email: booknanny7@gmail.com
pswd:

---

## How to run the application with docker

1. In order to run the app in local machine user will need to use docker. User will need to install docker:
   Mac users: https://docs.docker.com/desktop/install/mac-install/
   Windows users: https://docs.docker.com/desktop/install/windows-install/
   You can use these links to download the docker installer and user must sign up to create a docker account. Once this is done user can use docker from their terminal.
2. Once user has docker. User can open this app in their id and start new terminal or they can cd to this directory from the terminal.
3. In the terminal run the following commands:

   > docker-compose build

   > docker compose up

4. Once the docker containers are running the server is binded to localhost:3000 and the client will be binded to localhost:4001.
   The website can be accessed from: http://localhost:4001/

## How to run the application in your local machine without docker:

1. cd to the BookMyNanny root directory and run the following commands in the terminal:

   > cd server

   > npm i

   > cd ..

   > npm i

   > npm start

   Note: npm start will start both the client and server

## Course Technologies & Their Uses

1. **React:** React will serve as the backbone of our front-end development. It will be used to create a single-page application and reusable UI components that will be included on our pages.
2. **Firebase:** Firebase authentication will be pivotal in user management. By offering options to log in or sign up using email IDs, Google, and Facebook, we aim to cater to a broader audience, ensuring security and a personalized user experience.

3. **Redis:** Redis, an in-memory data structure store, will be used for caching purposes. It will optimize our platform's performance, ensuring faster data retrieval, and reduced database load. We are using redis cloud.
4. **GraphQL:** GraphQL will manage and query our data. Unlike traditional REST APIs, GraphQL allows for precise data retrieval. It will enable intricate data structures to be fetched seamlessly, such as nanny listings with associated ratings and reviews.

---

## Independent Technologies & Their Uses

- **Amazon S3:** Amazon S3 will serve as media storage solution. It's designed to store larger files, like images and videos. In the context of **BookMyNanny**, Amazon S3 will host nanny profile images and any other media files our platform requires.

- **Docker:** Docker offers platform-as-a-service products, using OS-level virtualization for software delivery in containers. We'll utilize Docker for seamless deployments, ensuring **BookMyNanny** behaves consistently across various environments.

- **Firebase FireStore:** Firestore acts as our main document type cloud database supporting all CRUD operations for **BookMyNanny** app.

---

With **BookMyNanny**, we aim to revolutionize child-care services, offering a reliable and efficient solution for parents and nannies alike.

---

### GitHub Repository

[BookMyNanny GitHub Repository](https://github.com/sushilrajeeva/BookMyNanny)

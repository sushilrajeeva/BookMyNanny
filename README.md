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
pswd: Bookmynanny7!

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

5. Once you are done using the docker container to bring down the container use the command.

   > docker compose down
   
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

---

## Independent Technologies & Their Uses

- **Amazon S3:** Amazon S3 will serve as media storage solution. It's designed to store larger files, like images and videos. In the context of **BookMyNanny**, Amazon S3 will host nanny profile images and any other media files our platform requires.

- **Docker:** Docker offers platform-as-a-service products, using OS-level virtualization for software delivery in containers. We'll utilize Docker for seamless deployments, ensuring **BookMyNanny** behaves consistently across various environments.

- **Firebase FireStore:** Firestore acts as our main document type cloud database supporting all CRUD operations for **BookMyNanny** app.

---

With **BookMyNanny**, we aim to revolutionize child-care services, offering a reliable and efficient solution for parents and nannies alike.

---

## Stripe Setup for Payment Processing

Stripe is a powerful payment processing tool that we've integrated into **BookMyNanny** for handling transactions. To set up Stripe in your local environment and ensure smooth payment functionalities, follow these steps:

### Setting Up Stripe Account

1. **Create a Stripe Account:**
   - Visit [Stripe's website](https://stripe.com/) and sign up for an account.
   - Fill in the required details and verify your email address.

2. **Retrieve API Keys:**
   - Once your account is set up, go to the Stripe Dashboard.
   - Navigate to the "Developers" section in the sidebar.
   - Under the "API Keys" tab, you'll find two keys: a publishable key and a secret key. 
   - Make a note of both keys; you'll need them to configure Stripe in the application.

### Configuring Stripe in BookMyNanny

1. **Setting Environment Variables:**
   - In the root folder of the server part of your **BookMyNanny** application, create a `.env` file (if not already present).
   - Add the following lines to the file:
     ```
     STRIPE_SECRET_KEY=your_stripe_secret_key_here
     STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here
     ```
   - Replace `your_stripe_secret_key_here` with your Stripe secret key.
   - The webhook secret will be obtained in the next steps.

2. **Setting up Stripe Webhook:**
   - Go back to the Stripe Dashboard.
   - Navigate to the "Webhooks" section under "Developers".
   - Click on “+ Add endpoint” and add the URL where you want to receive the webhook events. For local development, this will be your local server URL, e.g., `http://localhost:3000/webhook`.
   - Select the event `checkout.session.completed` to be sent to this endpoint.
   - After adding the endpoint, Stripe will generate a signing secret. Add this secret to your `.env` file as the value for `STRIPE_WEBHOOK_SECRET`.

3. **Running the Application:**
   - Ensure that all environment variables are set correctly.
   - Start your application. Stripe should now be configured to handle payments and send webhook events to your application.

### Testing Stripe Integration

1. **Using Stripe Test Cards:**
   - Stripe provides [test card numbers](https://stripe.com/docs/testing) for you to simulate different payment scenarios without using real money.
   - Use these test card numbers to make payments and ensure your application handles these transactions correctly.

2. **Verifying Webhook Receipt:**
   - When a test transaction is completed, check if your application receives the webhook event and handles it as expected.
   - For debugging, you can log the received events in your server logs.

---

By following these steps, you should have Stripe fully integrated and functional within your **BookMyNanny** application for both payment processing and webhook event handling.

---

**Note:** Remember to switch to live mode (with live API keys and webhook secret) for your production application once you are ready to accept real payments.

---

### Additional Resources

- [Stripe API Documentation](https://stripe.com/docs/api)
- [Stripe Testing and Debugging](https://stripe.com/docs/testing)



### GitHub Repository

[BookMyNanny GitHub Repository](https://github.com/sushilrajeeva/BookMyNanny)

### Click Here! [Project Walkthrough Video Link](https://youtu.be/gHj9tL7KoC4)


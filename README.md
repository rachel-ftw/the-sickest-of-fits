# Sick Fits

A demo react storefront.

Store content pulled from [Witchsy](https://www.witchsy.com/). Go buy something from them and support women run businesses!

## Stack

Front End

- [react.js](https://reactjs.org/)
- [next.js](https://nextjs.org/)
- [styled components](https://www.styled-components.com/)
- [Apollo Client](https://www.apollographql.com/docs/react/)
- [Cloudinary](https://cloudinary.com)

Back End

- [GraphQL](https://graphql.org/)
- [graphql-yoga](https://github.com/prisma/graphql-yoga)🧘‍♀️
- [prisma](https://github.com/prisma/prisma)
- [Nodemailer](https://nodemailer.com/about/) & [mailTrap](https://mailtrap.io)
- [heroku](https://www.heroku.com)

## Run the Project Locally

1. clone the repo
1. `npm i` in both the front end and back end folders
1. Back End:

- sign up for [prisma](https://www.prisma.io/) and install prisma globally `npm i -g prisma`
- add this `variables.env` file to the backend directory

  ```js
  FRONTEND_URL = "http://localhost:7777";
  PRISMA_ENDPOINT = "getThisFromPrismaSetup";
  PRISMA_SECRET = "youShouldMakeUpYourOwnSecret";
  APP_SECRET = "jwtsecret123";
  STRIPE_SECRET = "youChangeThisSrsly";
  PORT = 4444;
  ```

# Adidas Challenge - Node/Microservices

Build and run a Subscription service in a microservices infrastructure.

This repository contains the main service called Subscription, and the accessory services to represent the microservices structure.

![alt text](https://github.com/rodrigoclp/adidas-microservices/blob/master/architecture2.png?raw=true)

### Goal

- Build as much as possible in a short period of time;
- Try to keep the code as simple as possible, readable with a good level of decoupling;
- Build from scratch.

### Caveats

- Subscription is the main service. Mailing service is only a representation of real service to simulate the communication with the stream broker;
- The api-gateway has a really simple implementation, only to represent the infrastructure proposed;
- No Service/Domain layer on the Subscription service. Not enough business rules for data;
- For this specific case, a reverse proxy with Nginx would be enough, but I assumed we already have an api-gateway structure at the company.

### Todo

- Improve everything... but mainly, add the gRPC for the inter-service communication including with the api-gateway;
- Add HTTPS and SSL, including in the stream broker communication.
Unfortunately, not enough time for that.

## Stack

**Express**
Simple, clean, lightweight, and straightforward; Nice for microservices.

**Mongo**
For convenience (I use to use it), but any other DB would fit in this case (SQL or noSQL). With more time, I would add Cassandra (saw it on the Adidas stack list);

**Kafka**
Market choice and best stream platform, but any other solution would fit this case. For this challenge, I added a single node just to represent the infrastructure. I assumed we already have a streaming platform at the company (saw it on the Adidas stack list);

## Running it

Clone or download this repository into your machine:
`git clone git@github.com:rodrigoclp/adidas-node-microservices.git`

### Staging mode

**Requirements**

- docker/docker-compose

**How to**

- In the root folder, execute:
`docker-compose up`

**Reaching the service**

`http://localhost:4000/subscription/api/v1`

### Developing mode

**Requirements**

- docker/docker-compose
- NodeJS version 16+ (most likely works fine with 12+ / not checked)

**How to**

- In the root folder, execute:
`docker-compose -f docker-compose.dev.yml up`
- Run the node services individually executing the following command in the root folder of each service:
`npm run dev`

**Reaching the service**
`http://localhost:4000/subscription/api/v1`

## API Doc (Swagger)

Available only on Developing mode.

- Run the Subscription service (locally, out of the docker);
- From a web browser, enter:
`http://localhost:4001/api/v1/doc`

## CI/CD pipeline proposal

**Ticket branch**
Step 1

- Run all unit tests

Step 2

- Build

Step 3

- Push the docker image

**Pull Request of the branch**
Step 1 (in parallel)

- Run all unit tests
- Lint (check style and other marks)
- Code coverage
- Tag the code as healthy (or not)

Step 2

- Build

Step 3

- Push the docker image

Step 4

- Run all integration tests

Result

- PR available to be merged into git solution (all checks passed)

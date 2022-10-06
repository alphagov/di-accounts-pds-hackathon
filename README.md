# Personal Data Store hackathon prototype

_This repository is archived_

This prototype was created for a cross-public sector event looking at personal data stores (PDS) and how to use them to model relationships between users in September 2022.
We wanted to explore an online vouching system for people to prove their identity, using personal data stores, linked data and verifiable credentials (VCs).

We thought it would be interesting to assume that any user could vouch for anyone else by removing the list of 'allowed professions'. This would potentially mean users could ask more people to vouch for them, or in turn vouch for more people, which would allow us to place them in a web of trust based on their relationships to other people.

We also thought a system like this would allow DI (as the identity issuer) to evaluate and 'weight' each vouch differently depending on the contents of the voucher's pod.
For example, if the civil service issued a VC to civil servant's personal data stores, we could treat vouches from users
with those credentials as 'stronger' than those from users without them. We ran out of time at the event to explore this
topic in more detail however.

Supporting material can be found on [Google Drive](https://drive.google.com/drive/folders/1FJm-azglfwbVEepQJlq3jGTkMJIA_e2B)

This prototype contains two journeys:

## Requesting a vouch

A user starts in their GOV.UK Account and has a new card available to request a vouch. They go through the journey and at the
end, the app creates a new container in their PDS, writes a `VouchRequest` VC to it and adds permisssions to let the person
they requested the vouch from write into that container.

## Vouching for someone

The user being asked to vouch for someone starts the journey by getting a email which links them into the vouching service.
They go through the journey and are asked a few questions about how they know the person they're vouching for - we thought
these would be the basis of how we'd evaluate the 'strength' of their vouch.

Once they've conpleted the journey, the app writes a VC into both users' PDS, using the permissions set up before to access the
other person's. These VCs link to each other and would allow us to build a graph of users who have vouched for each other to
aid in things like fraud detection.

## Running the prototype app

1. Run `npm ci` to install dependencies
2. Run `npm run build` to build the app
3. Run `npm start` to start the local server
4. Visit `http://localhost:3000` in your browser

## Deploying the app

There's a Dockerfile and CloudFormation template in `/deploy`.
To deploy the app, make sure you have AWS SAM installed and run `/deploy/deploy.sh` with the appropriate AWS credentials:

```bash
cd deploy
gds aws di-solid-protoype -- ./deploy.sh
```

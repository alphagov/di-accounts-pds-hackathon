# Personal Data Store hackathon prototype

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


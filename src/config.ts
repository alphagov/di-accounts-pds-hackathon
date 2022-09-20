export function getPort() {
  return process.env.LOGS_LEVEL || 3000;
}

export function getSessionKeys() {
  return ["key1", "key2"];
}

export function getDeployedDomain() {
  return "hackathon.solid.integration.account.gov.uk";
}

export function getProtocol() {
  return process.env.NODE_ENV === "production" ? "https" : "http";
}

export function getHostname() {
  const hostname =
    process.env.NODE_ENV === "production"
      ? getDeployedDomain()
      : `localhost:${getPort()}`;
  return `${getProtocol()}://${hostname}`;
}

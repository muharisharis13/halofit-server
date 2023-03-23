class url {
  pathRouterClient = (nameRouter) => `/api/v1/client/${nameRouter}`;
  pathRouterAdmin = (nameRouter) => `/api/v1/admin/${nameRouter}`;
}

module.exports = new url();

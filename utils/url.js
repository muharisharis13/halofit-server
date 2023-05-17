class url {
  pathRouterClient = (nameRouter) => `/api/v1/client/${nameRouter}`;
  pathRouterAdmin = (nameRouter) => `/api/v1/admin/${nameRouter}`;
  pathRouterSuperAdmin = (nameRouter) => `/api/v1/superadmin/${nameRouter}`;

  pathBanner = "/view/image/banner";
  fullURL = (req) => {
    const protocol = req.protocol;
    const host = req.hostname;
    const port = process.env.PORT;

    const fullUrl = `${protocol}://${host}:${port}`;
    return fullUrl;
  };
}

module.exports = new url();

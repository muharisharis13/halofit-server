class url {
  pathRouterClient = (nameRouter) => `/api/v1/client/${nameRouter}`;
  pathRouterAdmin = (nameRouter) => `/api/v1/admin/${nameRouter}`;
  pathRouterSuperAdmin = (nameRouter) => `/api/v1/superadmin/${nameRouter}`;
  pathRouterPublic = (nameRouter) => `/api/v1/public/${nameRouter}`;

  pathBanner = "/view/image/banner";
  pathProfile = "/view/image/profile";
  pathBannerTask = "/view/image/task";
  pathPromo = "/view/image/promo";
  pathMerchant = "/view/image/merchant";

  fullURL = (req) => {
    const protocol = req.protocol;
    const host = req.hostname;
    const port = process.env.PORT;

    const fullUrl = `${protocol}://${host}:${port}`;
    return fullUrl;
  };
  // fullURL = (req) => {
  //   const isSecure = req.headers["x-forwarded-proto"] === "https"; // Check if the request was made over HTTPS

  //   const host = req.hostname;
  //   const port = process.env.PORT;

  //   const protocol = isSecure ? "https" : "http"; // Use 'https' if the request was made over HTTPS, otherwise use 'http'

  //   const fullUrl = `${protocol}://${host}:${port}`;
  //   return fullUrl;
  // };
}

module.exports = new url();

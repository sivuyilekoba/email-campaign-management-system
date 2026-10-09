// Development environment. apiUrl is empty so requests use relative /api paths
// and are forwarded to Laravel by the dev-server proxy (src/proxy.conf.json).
export const environment = {
  production: false,
  apiUrl: '',
};

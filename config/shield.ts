const shieldConfig = {
  enabled: true,
  exceptPaths: ['/', '/api/auth/register', '/api/auth/login'],
  enableXsrfCookie: true,
}

export default shieldConfig

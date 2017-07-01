export default {
  storageKey: 'ngParrotToken',
  url: 'https://parrot.com',
  tokenPath: '/api/v1/auth/token',
  translationPath: '/api/v1/projects/{{project_id}}/locales/{{locale}}/export/keyvaluejson',
  key: 'en_US',
  grant_type: 'client_credentials'
};

// Node's --env-file-if-exists flag loads local .env without replacing host secrets.
process.env.NODE_ENV = 'production';
await import('../server.js');

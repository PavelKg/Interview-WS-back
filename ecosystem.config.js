module.exports = {
  apps : [{
    name      : 'Interview-WS-back',
    script    : 'server.js',
    env: {
      NODE_ENV: 'development',
      NODE_PORT: 8765
    },
    env_production : {
      NODE_ENV: 'production',
      NODE_PORT: 8765
    }
  }],
  deploy : {
    production : {
      user : 'interview',
      host : 'dev.pepex.kg',
      ref  : 'origin/master',
      repo : 'git@github.com:PavelKg/Interview-WS-back.git',
      path : '~/services/interview-backend',
      'post-deploy' : 'npm i && pm2 startOrRestart ecosystem.config.js --env production'
    },
    development : {
      user : 'interview',
      host : 'dev.pepex.kg',
      ref  : 'origin/development',
      repo : 'git@github.com:PavelKg/Interview-WS-back.git',
      path : '~/services/interview-backend',
      'post-deploy' : 'npm i &&  pm2 startOrRestart ecosystem.config.js --env development'
    }
  }
}; 
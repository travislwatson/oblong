// TODO is there a way to avoid having this file? I don't see it in some places like Redux. How do they resolve the typescript error?

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production'
    }
  }
}

export {}

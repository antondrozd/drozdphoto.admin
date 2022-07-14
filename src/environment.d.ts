declare global {
  namespace NodeJS {
    interface ProcessEnv {
      REACT_APP_FIREBASE_API_KEY: string
    }
  }
}

export {}

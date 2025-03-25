/// <reference types="vite/client" />

interface Window {
  gapi: {
    load: (api: string, callback: () => void) => void;
    client: {
      init: (config: any) => Promise<void>;
      calendar: {
        events: {
          insert: (params: any) => Promise<any>;
        };
      };
    };
    auth2: {
      getAuthInstance: () => {
        signIn: () => Promise<void>;
      };
    };
  };
}
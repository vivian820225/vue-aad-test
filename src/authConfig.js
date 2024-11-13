import { PublicClientApplication, LogLevel } from "@azure/msal-browser";

/**
 * 註冊應用程式和識別碼可參照官方文件
 * https://learn.microsoft.com/zh-tw/entra/identity-platform/quickstart-single-page-app-javascript-sign-in#register-the-application-and-record-identifiers
 */

const msalConfig = {
  auth: {
    // clientId: "CLIENT_ID", // 請替換為應用程式 (用戶端) 識別碼 (Client ID)
    // authority: "https://login.microsoftonline.com/TENANT_ID", // 請替換為目錄 (租用戶) 識別碼 (Tenant ID)
    clientId: "f7a9c383-c54b-406f-8de5-09ca947ff683",
    authority:
      "https://login.microsoftonline.com/54aa2fea-ecb3-4c71-80b3-de9a356e77c1",
    redirectUri: "http://localhost:5173", // 請替換為應用程式申請的重新導向 URI
    navigateToLoginRequestUrl: true,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
        }
      },
    },
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);

export const initializeMsal = async () => {
  try {
    await msalInstance.initialize();
    console.log("MSAL initialized successfully");
  } catch (error) {
    console.error("Failed to initialize MSAL:", error);
  }
};

export const loginRequest = {
  scopes: ["User.Read"], // 定義所需的範圍，可根據需求更改
};

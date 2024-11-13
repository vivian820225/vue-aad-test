# Azure Active Directory (AAD) 串接範例

啟用此專案前請先確認：

1. 已在註冊 [Microsoft Entra 系統管理中心](https://entra.microsoft.com/) 應用程式 ([官方文件](https://app.heptabase.com/ed682aa7-0316-47ed-bbce-a7a13a0b3239/card/5727b3c3-9273-46e3-8d27-b50b0125cc93))取得：
   - 應用程式(用戶端)識別碼
   - 目錄(租用戶)識別碼
2. 設定應用程式的重新導向 URI，在此預設使用 http://localhost:5173

## 開始執行

串接 AAD 服務需安裝 MSAL.js 套件

```bash
npm install @azure/msal-browser
```

此專案已安裝，可以直接執行以下指令

```bash
npm install
npm run dev
```

---

### 範例檔案說明

authConfig.js - 用來設定 MSAL 並配置 AAD 資訊

```javascript
const msalConfig = {
  auth: {
    clientId: "CLIENT_ID", // 請替換為應用程式 (用戶端) 識別碼 (Client ID)
    authority: "https://login.microsoftonline.com/TENANT_ID", // 請替換為目錄 (租用戶) 識別碼 (Tenant ID)
    redirectUri: "http://localhost:5173", // 請替換為應用程式申請的重新導向 URI
    navigateToLoginRequestUrl: true,
  },
};
```

scopes 定義在 AAD 中請求的權限範圍，決定此應用程式可存取哪些資源。範例中的 User.Read 權限範圍允許應用讀取使用者的基本個人資料。
其他可使用的範圍可參考[官方文件](https://learn.microsoft.com/zh-tw/entra/identity-platform/scopes-oidc)

```javascript
export const loginRequest = {
  scopes: ["User.Read"], // 定義所需的範圍，可根據需求更改
};
```

authService.js - Token 管理刷新與錯誤處理範例程式

> MSAL.js 支援自動更新 token 功能。當 access token 即將過期時，可透過 acquireTokenSilent 取得最新的 token，而無需重新登入。

### 補充

- 注意錯誤處理：在應用中捕捉 user_cancelled 等錯誤，避免使用者操作被中斷。

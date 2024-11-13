import { msalInstance, loginRequest } from "./authConfig";

export async function getToken() {
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length === 0) {
    throw new Error("No user account is logged in.");
  }

  try {
    const response = await msalInstance.acquireTokenSilent({
      ...loginRequest,
      account: accounts[0],
    });
    return response.accessToken;
  } catch (error) {
    console.warn(
      "Silent token acquisition failed. Attempting to refresh.",
      error
    );

    if (error instanceof InteractionRequiredAuthError) {
      // 若取得失敗，則重導向至 loginRedirect
      await msalInstance.loginRedirect(loginRequest);
    } else {
      throw error;
    }
  }
}

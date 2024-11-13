<script setup>
import { ref, onMounted } from "vue";
import { msalInstance, loginRequest, initializeMsal } from "./authConfig";
import { getToken } from "./authService";

const isAuthenticated = ref(false);
const user = ref(null);
const loginType = ref("popup"); // or "redirect"

const login = async () => {
  if (loginType.value === "redirect") {
    msalInstance.loginRedirect(loginRequest);
    return;
  }

  try {
    const loginResponse = await msalInstance.loginPopup(loginRequest);
    isAuthenticated.value = true;
    user.value = loginResponse.account;
  } catch (error) {
    console.error("Login error:", error);
  }
};

const logout = () => {
  if (loginType.value === "redirect") {
    msalInstance.logoutRedirect();
    return;
  }

  msalInstance.logoutPopup();
  isAuthenticated.value = false;
  user.value = null;
};

const printToken = async () => {
  const token = await getToken();
  console.log("token:", token);
};

onMounted(async () => {
  await initializeMsal();
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length > 0) {
    isAuthenticated.value = true;
    user.value = accounts[0];
  } else {
    if (loginType.value !== "redirect") return;
    // 重新導回後處理
    msalInstance
      .handleRedirectPromise()
      .then((response) => {
        if (response && response.account) {
          isAuthenticated.value = true;
          user.value = response.account;
        }
      })
      .catch((error) => {
        console.error("Error handling redirect:", error);
      });
  }
});
</script>

<template>
  <div>
    <button v-if="!isAuthenticated" @click="login">Login with AAD</button>
    <button
      v-if="isAuthenticated"
      :style="{ marginRight: '16px' }"
      @click="logout"
    >
      Logout
    </button>
    <button v-if="isAuthenticated" @click="printToken">Get Token</button>
    <p v-if="isAuthenticated">Welcome, {{ user.name }}</p>
  </div>
</template>

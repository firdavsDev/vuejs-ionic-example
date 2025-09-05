import { SocialLogin } from "@capgo/capacitor-social-login";

const webClientId = "YOUR_GOOGLE_CLIENT_ID";
const iOSClientId = "YOUR_IOS_CLIENT_ID";

class AuthService {
  async initializeGoogleAuth() {
    await SocialLogin.initialize({
      google: {
        webClientId: webClientId, // Use Web Client ID for all platforms
        iOSClientId: iOSClientId, // replace with your iOS client ID
        mode: "offline", // replaces grantOfflineAccess
        // scopes: [
        //   "profile",
        //   "email",
        //   "https://www.googleapis.com/auth/drive.file",
        // ],
      },
    });
  }

  async signInWithGoogle() {
    try {
      const res = await SocialLogin.login({
        provider: "google",
        options: {
          scopes: [
            "email",
            "profile",
            "https://www.googleapis.com/auth/drive.file",
          ],
          forceRefreshToken: true, // if you need refresh token
        },
      });
      return res;
    } catch (error) {
      console.error("Google sign-in error:", error);
      throw error;
    }
  }

  async signOut() {
    await GoogleAuth.signOut();
  }
}

export default new AuthService();

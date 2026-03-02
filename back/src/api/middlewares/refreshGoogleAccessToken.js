import axios from "axios";

export const refreshGoogleAccessToken = async (googleRefreshToken) => {
    try {
      const response = await axios.post(process.env.COSMOS_GOOGLE_TOKEN_URL, {
        grant_type: 'refresh_token',
        refresh_token: googleRefreshToken,
        client_id: process.env.COSMOS_GOOGLE_CLIENT_ID,
        client_secret: process.env.COSMOS_GOOGLE_CLIENT_SECRET,
      });
      const newAccessToken = response.data.access_token;
      return newAccessToken;
    } catch (error) {
      error.name = commonErrors.refreshGoogleAccessTokenError;
      throw error;
    }
  }
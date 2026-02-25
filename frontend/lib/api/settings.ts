import axios from "./axios";
import { API } from "./endpoints";

export interface UserSettings {
  _id?: string;
  userId?: string;
  language: string;
  timezone: string;
  profileVisibility: "public" | "private";
  reviewVisibility: boolean;
  progressVisibility: boolean;
  savedContentVisibility: boolean;
  showActivity: boolean;
  emailNotifications: boolean;
  notificationFrequency: "instant" | "daily" | "weekly" | "never";
  notifyAchievements: boolean;
  notifyRecommendations: boolean;
  notifyAnnouncements: boolean;
  theme: "light" | "dark" | "auto";
  accentColor: string;
  fontSize: "small" | "medium" | "large";
  reduceMotion: boolean;
  dataCollection: boolean;
}

const getClientAuthToken = () => {
  if (typeof document === "undefined") return null;
  const cookieName = "auth_token=";
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const trimmedCookie = cookie.trim();
    if (trimmedCookie.startsWith(cookieName)) {
      return trimmedCookie.substring(cookieName.length);
    }
  }
  return null;
};

const getAuthHeaders = () => {
  const token = getClientAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const toErrorMessage = (err: Error | any, fallback: string) => (
  err?.response?.data?.message || err?.message || fallback
);

/**
 * Get user settings
 */
export const getSettings = async (): Promise<UserSettings> => {
  try {
    const response = await axios.get<{ success: boolean; data: UserSettings }>(
      API.SETTINGS.GET,
      { headers: getAuthHeaders() }
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(toErrorMessage(error, "Failed to fetch settings"));
  }
};

/**
 * Update all settings at once
 */
export const updateSettings = async (settings: Partial<UserSettings>): Promise<UserSettings> => {
  try {
    const response = await axios.put<{ success: boolean; data: UserSettings }>(
      API.SETTINGS.UPDATE,
      settings,
      { headers: getAuthHeaders() }
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(toErrorMessage(error, "Failed to update settings"));
  }
};

/**
 * Update general settings
 */
export const updateGeneralSettings = async (data: {
  language?: string;
  timezone?: string;
}): Promise<UserSettings> => {
  try {
    const response = await axios.put<{ success: boolean; data: UserSettings }>(
      API.SETTINGS.GENERAL,
      data,
      { headers: getAuthHeaders() }
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(toErrorMessage(error, "Failed to update general settings"));
  }
};

/**
 * Update privacy settings
 */
export const updatePrivacySettings = async (data: {
  profileVisibility?: "public" | "private";
  reviewVisibility?: boolean;
  progressVisibility?: boolean;
  savedContentVisibility?: boolean;
  showActivity?: boolean;
}): Promise<UserSettings> => {
  try {
    const response = await axios.put<{ success: boolean; data: UserSettings }>(
      API.SETTINGS.PRIVACY,
      data,
      { headers: getAuthHeaders() }
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(toErrorMessage(error, "Failed to update privacy settings"));
  }
};

/**
 * Update notification settings
 */
export const updateNotificationSettings = async (data: {
  emailNotifications?: boolean;
  notificationFrequency?: "instant" | "daily" | "weekly" | "never";
  notifyAchievements?: boolean;
  notifyRecommendations?: boolean;
  notifyAnnouncements?: boolean;
}): Promise<UserSettings> => {
  try {
    const response = await axios.put<{ success: boolean; data: UserSettings }>(
      API.SETTINGS.NOTIFICATIONS,
      data,
      { headers: getAuthHeaders() }
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(toErrorMessage(error, "Failed to update notification settings"));
  }
};

/**
 * Update appearance settings
 */
export const updateAppearanceSettings = async (data: {
  theme?: "light" | "dark" | "auto";
  accentColor?: string;
  fontSize?: "small" | "medium" | "large";
  reduceMotion?: boolean;
}): Promise<UserSettings> => {
  try {
    const response = await axios.put<{ success: boolean; data: UserSettings }>(
      API.SETTINGS.APPEARANCE,
      data,
      { headers: getAuthHeaders() }
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(toErrorMessage(error, "Failed to update appearance settings"));
  }
};

/**
 * Update data collection preferences
 */
export const updateDataPreferences = async (dataCollection: boolean): Promise<UserSettings> => {
  try {
    const response = await axios.put<{ success: boolean; data: UserSettings }>(
      API.SETTINGS.DATA,
      { dataCollection },
      { headers: getAuthHeaders() }
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(toErrorMessage(error, "Failed to update data preferences"));
  }
};

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  getSettings,
  updateGeneralSettings,
  updatePrivacySettings,
  updateNotificationSettings,
  updateAppearanceSettings,
  updateDataPreferences,
  type UserSettings,
} from "@/lib/api/settings";
import { toast } from "react-toastify";
import { ChevronLeft, Save, AlertCircle, Check } from "lucide-react";

type SettingsTab = "general" | "privacy" | "notifications" | "appearance" | "data";

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<UserSettings | null>(null);

  const [changes, setChanges] = useState<Partial<UserSettings>>({});

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (error) {
        toast.error("Failed to load settings");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleChange = (key: keyof UserSettings, value: any) => {
    setChanges((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSaveGeneral = async () => {
    setSaving(true);
    try {
      const result = await updateGeneralSettings({
        language: changes.language || settings?.language,
        timezone: changes.timezone || settings?.timezone,
      });
      setSettings(result);
      setChanges({});
      toast.success("General settings saved");
    } catch (error: any) {
      toast.error(error.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleSavePrivacy = async () => {
    setSaving(true);
    try {
      const result = await updatePrivacySettings({
        profileVisibility:
          (changes.profileVisibility as any) || settings?.profileVisibility,
        reviewVisibility:
          changes.reviewVisibility !== undefined
            ? changes.reviewVisibility
            : settings?.reviewVisibility,
        progressVisibility:
          changes.progressVisibility !== undefined
            ? changes.progressVisibility
            : settings?.progressVisibility,
        savedContentVisibility:
          changes.savedContentVisibility !== undefined
            ? changes.savedContentVisibility
            : settings?.savedContentVisibility,
        showActivity:
          changes.showActivity !== undefined
            ? changes.showActivity
            : settings?.showActivity,
      });
      setSettings(result);
      setChanges({});
      toast.success("Privacy settings saved");
    } catch (error: any) {
      toast.error(error.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setSaving(true);
    try {
      const result = await updateNotificationSettings({
        emailNotifications:
          changes.emailNotifications !== undefined
            ? changes.emailNotifications
            : settings?.emailNotifications,
        notificationFrequency:
          (changes.notificationFrequency as any) ||
          settings?.notificationFrequency,
        notifyAchievements:
          changes.notifyAchievements !== undefined
            ? changes.notifyAchievements
            : settings?.notifyAchievements,
        notifyRecommendations:
          changes.notifyRecommendations !== undefined
            ? changes.notifyRecommendations
            : settings?.notifyRecommendations,
        notifyAnnouncements:
          changes.notifyAnnouncements !== undefined
            ? changes.notifyAnnouncements
            : settings?.notifyAnnouncements,
      });
      setSettings(result);
      setChanges({});
      toast.success("Notification settings saved");
    } catch (error: any) {
      toast.error(error.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAppearance = async () => {
    setSaving(true);
    try {
      const result = await updateAppearanceSettings({
        theme: (changes.theme as any) || settings?.theme,
        accentColor: changes.accentColor || settings?.accentColor,
        fontSize: (changes.fontSize as any) || settings?.fontSize,
        reduceMotion:
          changes.reduceMotion !== undefined
            ? changes.reduceMotion
            : settings?.reduceMotion,
      });
      setSettings(result);
      setChanges({});
      toast.success("Appearance settings saved");
    } catch (error: any) {
      toast.error(error.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDataPreferences = async () => {
    setSaving(true);
    try {
      const result = await updateDataPreferences(
        changes.dataCollection !== undefined
          ? changes.dataCollection
          : settings?.dataCollection || true
      );
      setSettings(result);
      setChanges({});
      toast.success("Data preferences saved");
    } catch (error: any) {
      toast.error(error.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const currentValue = (key: keyof UserSettings) =>
    changes[key] !== undefined ? changes[key] : settings?.[key];

  const hasChanges = Object.keys(changes).length > 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
            <p className="text-slate-600">Manage your preferences and account settings</p>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Tabs */}
          <div className="w-48">
            <nav className="sticky top-20 space-y-1 bg-white rounded-lg border border-slate-200 p-2 shadow-sm">
              {[
                { id: "general", label: "General" },
                { id: "privacy", label: "Privacy" },
                { id: "notifications", label: "Notifications" },
                { id: "appearance", label: "Appearance" },
                { id: "data", label: "Data & Privacy" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as SettingsTab)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition ${
                    activeTab === tab.id
                      ? "bg-indigo-100 text-indigo-700 font-semibold"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
              {/* General Settings */}
              {activeTab === "general" && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-slate-900 mb-6">General Settings</h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-800 mb-2">
                        Language
                      </label>
                      <select
                        value={(currentValue("language") as string) || "en"}
                        onChange={(e) => handleChange("language", e.target.value)}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                        <option value="hi">हिंदी</option>
                      </select>
                      <p className="text-sm text-slate-500 mt-1">
                        Choose your preferred language for the interface
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-800 mb-2">
                        Timezone
                      </label>
                      <input
                        type="text"
                        placeholder="UTC"
                        value={(currentValue("timezone") as string) || "UTC"}
                        onChange={(e) => handleChange("timezone", e.target.value)}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <p className="text-sm text-slate-500 mt-1">
                        Set your timezone for accurate scheduling
                      </p>
                    </div>

                    {hasChanges && (
                      <button
                        onClick={handleSaveGeneral}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-60"
                      >
                        <Save className="w-4 h-4" />
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Privacy Settings */}
              {activeTab === "privacy" && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-slate-900 mb-6">Privacy Settings</h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-800 mb-2">
                        Profile Visibility
                      </label>
                      <select
                        value={(currentValue("profileVisibility") as string) || "private"}
                        onChange={(e) => handleChange("profileVisibility", e.target.value)}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="private">Private</option>
                        <option value="public">Public</option>
                      </select>
                      <p className="text-sm text-slate-500 mt-1">
                        Control who can see your profile
                      </p>
                    </div>

                    {[
                      { key: "reviewVisibility", label: "Show your reviews", desc: "Allow others to see your reviews and ratings" },
                      { key: "progressVisibility", label: "Show your progress", desc: "Allow others to see your learning progress" },
                      { key: "savedContentVisibility", label: "Show saved content", desc: "Allow others to see your saved items" },
                      { key: "showActivity", label: "Show activity", desc: "Let others see your recent activity" },
                    ].map(({ key, label, desc }) => (
                      <div key={key}>
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id={key}
                            checked={(currentValue(key as keyof UserSettings) as boolean) ?? true}
                            onChange={(e) => handleChange(key as keyof UserSettings, e.target.checked)}
                            className="w-4 h-4 rounded border-slate-300"
                          />
                          <label htmlFor={key} className="text-sm font-medium text-slate-800">
                            {label}
                          </label>
                        </div>
                        <p className="text-sm text-slate-500 ml-7 mt-1">{desc}</p>
                      </div>
                    ))}

                    {hasChanges && (
                      <button
                        onClick={handleSavePrivacy}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-60"
                      >
                        <Save className="w-4 h-4" />
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === "notifications" && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-slate-900 mb-6">Notification Settings</h2>

                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <input
                          type="checkbox"
                          id="emailNotifications"
                          checked={(currentValue("emailNotifications") as boolean) ?? true}
                          onChange={(e) => handleChange("emailNotifications", e.target.checked)}
                          className="w-4 h-4 rounded border-slate-300"
                        />
                        <label htmlFor="emailNotifications" className="text-sm font-medium text-slate-800">
                          Email Notifications
                        </label>
                      </div>
                      <p className="text-sm text-slate-500 ml-7">
                        Receive email notifications for important updates
                      </p>
                    </div>

                    {(currentValue("emailNotifications") as boolean) !== false && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-slate-800 mb-2">
                            Notification Frequency
                          </label>
                          <select
                            value={(currentValue("notificationFrequency") as string) || "daily"}
                            onChange={(e) => handleChange("notificationFrequency", e.target.value)}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="instant">Instant</option>
                            <option value="daily">Daily Digest</option>
                            <option value="weekly">Weekly Digest</option>
                            <option value="never">Never</option>
                          </select>
                        </div>

                        <div className="space-y-3">
                          {[
                            { key: "notifyAchievements", label: "Achievements", desc: "Get notified when you earn achievements" },
                            { key: "notifyRecommendations", label: "Recommendations", desc: "Receive personalized content recommendations" },
                            { key: "notifyAnnouncements", label: "Announcements", desc: "Receive platform announcements" },
                          ].map(({ key, label, desc }) => (
                            <div key={key}>
                              <div className="flex items-center gap-3">
                                <input
                                  type="checkbox"
                                  id={key}
                                  checked={(currentValue(key as keyof UserSettings) as boolean) ?? true}
                                  onChange={(e) => handleChange(key as keyof UserSettings, e.target.checked)}
                                  className="w-4 h-4 rounded border-slate-300"
                                />
                                <label htmlFor={key} className="text-sm font-medium text-slate-800">
                                  {label}
                                </label>
                              </div>
                              <p className="text-sm text-slate-500 ml-7 mt-1">{desc}</p>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {hasChanges && (
                      <button
                        onClick={handleSaveNotifications}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-60"
                      >
                        <Save className="w-4 h-4" />
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Appearance Settings */}
              {activeTab === "appearance" && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-slate-900 mb-6">Appearance Settings</h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-800 mb-2">
                        Theme
                      </label>
                      <select
                        value={(currentValue("theme") as string) || "auto"}
                        onChange={(e) => handleChange("theme", e.target.value)}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="auto">Auto (System)</option>
                      </select>
                      <p className="text-sm text-slate-500 mt-1">
                        Choose your preferred color theme
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-800 mb-2">
                        Font Size
                      </label>
                      <select
                        value={(currentValue("fontSize") as string) || "medium"}
                        onChange={(e) => handleChange("fontSize", e.target.value)}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </select>
                      <p className="text-sm text-slate-500 mt-1">
                        Adjust the default text size
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="reduceMotion"
                          checked={(currentValue("reduceMotion") as boolean) ?? false}
                          onChange={(e) => handleChange("reduceMotion", e.target.checked)}
                          className="w-4 h-4 rounded border-slate-300"
                        />
                        <label htmlFor="reduceMotion" className="text-sm font-medium text-slate-800">
                          Reduce Motion
                        </label>
                      </div>
                      <p className="text-sm text-slate-500 ml-7 mt-1">
                        Minimize animations and transitions for accessibility
                      </p>
                    </div>

                    {hasChanges && (
                      <button
                        onClick={handleSaveAppearance}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-60"
                      >
                        <Save className="w-4 h-4" />
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Data & Privacy */}
              {activeTab === "data" && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-slate-900 mb-6">Data & Privacy</h2>

                  <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                      <div className="flex gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-blue-900">
                            Your data is important to us
                          </p>
                          <p className="text-sm text-blue-700 mt-1">
                            We use your data to improve your experience and provide personalized recommendations. You can control what data we collect.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="dataCollection"
                          checked={(currentValue("dataCollection") as boolean) ?? true}
                          onChange={(e) => handleChange("dataCollection", e.target.checked)}
                          className="w-4 h-4 rounded border-slate-300"
                        />
                        <label htmlFor="dataCollection" className="text-sm font-medium text-slate-800">
                          Allow Data Collection
                        </label>
                      </div>
                      <p className="text-sm text-slate-500 ml-7 mt-1">
                        Help us improve by allowing analytics and usage data collection
                      </p>
                    </div>

                    <div className="border-t border-slate-200 pt-6">
                      <h3 className="font-semibold text-slate-900 mb-4">More Options</h3>
                      <div className="space-y-3">
                        <button className="w-full text-left px-4 py-3 text-slate-700 hover:bg-slate-100 rounded-lg transition">
                          📥 Download Your Data
                        </button>
                        <button className="w-full text-left px-4 py-3 text-slate-700 hover:bg-slate-100 rounded-lg transition">
                          📋 View Activity Log
                        </button>
                        <button className="w-full text-left px-4 py-3 text-slate-700 hover:bg-slate-100 rounded-lg transition">
                          🔐 Manage Sessions
                        </button>
                        <button className="w-full text-left px-4 py-3 text-red-700 hover:bg-red-50 rounded-lg transition font-medium">
                          🗑️ Delete Account
                        </button>
                      </div>
                    </div>

                    {hasChanges && (
                      <button
                        onClick={handleSaveDataPreferences}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-60"
                      >
                        <Save className="w-4 h-4" />
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

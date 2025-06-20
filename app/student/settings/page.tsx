"use client"

import type React from "react"
import { useState } from "react"

const StudentSettingsPage = () => {
  const [accountPreferences, setAccountPreferences] = useState({
    language: "English",
    theme: "Light",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
  })

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "Public",
    dataSharing: false,
  })

  const handleAccountPreferencesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAccountPreferences({
      ...accountPreferences,
      [e.target.name]: e.target.value,
    })
  }

  const handleNotificationSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNotificationSettings({
      ...notificationSettings,
      [e.target.name]: e.target.checked,
    })
  }

  const handlePrivacySettingsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPrivacySettings({
      ...privacySettings,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Student Settings</h1>

      {/* Account Preferences */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Account Preferences</h2>
        <div className="mb-2">
          <label htmlFor="language" className="block text-gray-700 text-sm font-bold mb-2">
            Language:
          </label>
          <select
            id="language"
            name="language"
            value={accountPreferences.language}
            onChange={handleAccountPreferencesChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
          </select>
        </div>
        <div className="mb-2">
          <label htmlFor="theme" className="block text-gray-700 text-sm font-bold mb-2">
            Theme:
          </label>
          <select
            id="theme"
            name="theme"
            value={accountPreferences.theme}
            onChange={handleAccountPreferencesChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option>Light</option>
            <option>Dark</option>
          </select>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Notification Settings</h2>
        <div className="mb-2">
          <label htmlFor="emailNotifications" className="inline-flex items-center">
            <input
              type="checkbox"
              id="emailNotifications"
              name="emailNotifications"
              checked={notificationSettings.emailNotifications}
              onChange={handleNotificationSettingsChange}
              className="form-checkbox h-5 w-5 text-indigo-600"
            />
            <span className="ml-2 text-gray-700">Email Notifications</span>
          </label>
        </div>
        <div className="mb-2">
          <label htmlFor="pushNotifications" className="inline-flex items-center">
            <input
              type="checkbox"
              id="pushNotifications"
              name="pushNotifications"
              checked={notificationSettings.pushNotifications}
              onChange={handleNotificationSettingsChange}
              className="form-checkbox h-5 w-5 text-indigo-600"
            />
            <span className="ml-2 text-gray-700">Push Notifications</span>
          </label>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Privacy Settings</h2>
        <div className="mb-2">
          <label htmlFor="profileVisibility" className="block text-gray-700 text-sm font-bold mb-2">
            Profile Visibility:
          </label>
          <select
            id="profileVisibility"
            name="profileVisibility"
            value={privacySettings.profileVisibility}
            onChange={handlePrivacySettingsChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option>Public</option>
            <option>Private</option>
            <option>Friends Only</option>
          </select>
        </div>
        <div className="mb-2">
          <label htmlFor="dataSharing" className="inline-flex items-center">
            <input
              type="checkbox"
              id="dataSharing"
              name="dataSharing"
              checked={privacySettings.dataSharing}
              onChange={handlePrivacySettingsChange}
              className="form-checkbox h-5 w-5 text-indigo-600"
            />
            <span className="ml-2 text-gray-700">Allow Data Sharing</span>
          </label>
        </div>
      </div>
    </div>
  )
}

export default StudentSettingsPage

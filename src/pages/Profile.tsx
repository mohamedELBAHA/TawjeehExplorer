import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProfileLayout from './profile/ProfileLayout';
import ProfileOverview from './profile/ProfileOverview';
import ProfileDetails from './profile/ProfileDetails';
import ProfileAcademic from './profile/ProfileAcademic';
import ProfilePreferences from './profile/ProfilePreferences';
import ProfileNotifications from './profile/ProfileNotifications';

export default function Profile() {
  return (
    <Routes>
      <Route path="/" element={<ProfileLayout />}>
        <Route index element={<ProfileOverview />} />
        <Route path="details" element={<ProfileDetails />} />
        <Route path="academic" element={<ProfileAcademic />} />
        <Route path="preferences" element={<ProfilePreferences />} />
        <Route path="notifications" element={<ProfileNotifications />} />
      </Route>
    </Routes>
  );
}

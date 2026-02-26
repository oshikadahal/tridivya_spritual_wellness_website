"use client";

import AdminContentCrudPage from "@/app/admin/_components/AdminContentCrudPage";

export default function AdminMeditationPage() {
  return (
    <AdminContentCrudPage
      type="meditation"
      title="Meditation Management"
      subtitle="Create, update, and manage all meditation content"
    />
  );
}

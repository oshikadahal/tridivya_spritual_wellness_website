"use client";

import AdminContentCrudPage from "@/app/admin/_components/AdminContentCrudPage";

export default function AdminLibraryPage() {
  return (
    <AdminContentCrudPage
      type="library"
      title="Library Management"
      subtitle="Create, update, and manage all library items"
    />
  );
}

"use client";

import CreateUserForm from "./_components/CreateUserForm";

export default function CreateUserPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Create New User</h1>
                <p className="text-slate-600 mt-1">Add a new user account to your platform</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <CreateUserForm />
            </div>
        </div>
    );
}


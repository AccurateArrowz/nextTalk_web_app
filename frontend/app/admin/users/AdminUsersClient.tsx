"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createAdminUser,
  deleteAdminUser,
  listAdminUsers,
  updateAdminUser,
  type AdminUserListItem,
  type AdminUserPayload
} from "@/app/_lib/auth";
import { useUser } from "@/app/_lib/UserContext";
import { useRouter } from "next/navigation";

type FormState = {
  id: string | null;
  fullName: string;
  email: string;
  password: string;
  role: "user" | "admin";
  status: "active" | "inactive";
  profileImageUrl: string;
};

const emptyForm: FormState = {
  id: null,
  fullName: "",
  email: "",
  password: "",
  role: "user",
  status: "active",
  profileImageUrl: ""
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function toPayload(form: FormState): AdminUserPayload {
  return {
    fullName: form.fullName.trim(),
    email: form.email.trim(),
    password: form.password.trim() ? form.password : undefined,
    role: form.role,
    status: form.status,
    profileImageUrl: form.profileImageUrl.trim() || null
  };
}

function validate(form: FormState, isEdit: boolean) {
  const errors: Partial<Record<keyof FormState, string>> = {};
  if (form.fullName.trim().length < 2) errors.fullName = "Full name must be at least 2 characters.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = "Enter a valid email address.";
  if (!isEdit && form.password.trim().length < 8) errors.password = "Password must be at least 8 characters.";
  if (form.password.trim() && form.password.length < 8) errors.password = "Password must be at least 8 characters.";
  return errors;
}

function Modal({
  open,
  title,
  children,
  onClose
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 px-4 py-6">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-black/40">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-700 px-3 py-1 text-sm text-slate-300 hover:bg-slate-800"
          >
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function AdminUsersClient() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const [items, setItems] = useState<AdminUserListItem[]>([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<AdminUserListItem | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const isAdmin = user?.role === "admin";
  const isEdit = Boolean(form.id);

  const pageButtons = useMemo(() => {
    const pages: number[] = [];
    for (let page = 1; page <= meta.totalPages; page += 1) pages.push(page);
    return pages;
  }, [meta.totalPages]);

  useEffect(() => {
    if (!userLoading && !isAdmin) {
      router.replace("/");
    }
  }, [userLoading, isAdmin, router]);

  const loadUsers = async (page = meta.page, nextSearch = search) => {
    try {
      setLoading(true);
      setError(null);
      const response = await listAdminUsers({ page, limit: meta.limit, search: nextSearch });
      setItems(response.data);
      setMeta(response.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      void loadUsers(1, "");
    }
  }, [isAdmin]);

  const openCreate = () => {
    setForm(emptyForm);
    setFormErrors({});
    setFormOpen(true);
  };

  const openEdit = (item: AdminUserListItem) => {
    setForm({
      id: item.id,
      fullName: item.fullName,
      email: item.email,
      password: "",
      role: item.role,
      status: item.status,
      profileImageUrl: item.profileImageUrl ?? ""
    });
    setFormErrors({});
    setFormOpen(true);
  };

  const saveUser = async () => {
    const nextErrors = validate(form, isEdit);
    setFormErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      setActionLoading(true);
      const payload = toPayload(form);
      if (isEdit && form.id) {
        await updateAdminUser(form.id, payload);
      } else {
        await createAdminUser({ ...payload, password: payload.password ?? "" });
      }
      setFormOpen(false);
      await loadUsers(meta.page, search);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save user");
    } finally {
      setActionLoading(false);
    }
  };

  const removeUser = async () => {
    if (!confirmDelete) return;
    try {
      setActionLoading(true);
      await deleteAdminUser(confirmDelete.id);
      setConfirmDelete(null);
      await loadUsers(meta.page, search);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user");
    } finally {
      setActionLoading(false);
    }
  };

  if (userLoading || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-300">
        Loading admin users...
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center text-slate-200">
        <h1 className="text-3xl font-semibold">Admin access required</h1>
        <p className="mt-3 text-slate-400">You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-black/30 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Admin panel</p>
            <h1 className="mt-2 text-3xl font-semibold">User management</h1>
            <p className="mt-2 text-slate-400">Search, create, edit, and delete users from one place.</p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-300"
          >
            Create user
          </button>
        </div>

        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <label className="w-full max-w-xl">
            <span className="mb-2 block text-sm text-slate-400">Search by name or email</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") void loadUsers(1, search);
              }}
              placeholder="Search users..."
              className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none ring-0 placeholder:text-slate-500 focus:border-cyan-400"
            />
          </label>
          <button
            type="button"
            onClick={() => void loadUsers(1, search)}
            className="self-start rounded-2xl border border-slate-700 px-4 py-3 text-sm text-slate-200 hover:bg-slate-900"
          >
            Search
          </button>
        </div>

        {error && (
          <div className="mb-5 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-rose-200">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 shadow-xl shadow-black/30">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-800">
              <thead className="bg-slate-950/60">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">ID</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Name</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Email</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Role</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Status</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Created</th>
                  <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-16 text-center text-slate-400">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-950/50">
                      <td className="px-4 py-4 text-sm text-slate-400">{item.id.slice(0, 10)}...</td>
                      <td className="px-4 py-4 text-sm font-medium text-white">{item.fullName}</td>
                      <td className="px-4 py-4 text-sm text-slate-300">{item.email}</td>
                      <td className="px-4 py-4 text-sm text-slate-300 capitalize">{item.role}</td>
                      <td className="px-4 py-4 text-sm text-slate-300 capitalize">{item.status}</td>
                      <td className="px-4 py-4 text-sm text-slate-400">{formatDate(item.createdAt)}</td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(item)}
                            className="rounded-full border border-slate-700 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-800"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDelete(item)}
                            className="rounded-full border border-rose-500/30 px-3 py-1.5 text-sm text-rose-200 hover:bg-rose-500/10"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-400">
            Page {meta.page} of {meta.totalPages} · {meta.total} total users
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={meta.page <= 1}
              onClick={() => void loadUsers(meta.page - 1, search)}
              className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            {pageButtons.map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => void loadUsers(page, search)}
                className={`rounded-full px-4 py-2 text-sm ${
                  page === meta.page
                    ? "bg-cyan-400 text-slate-950"
                    : "border border-slate-700 text-slate-200 hover:bg-slate-900"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              disabled={meta.page >= meta.totalPages}
              onClick={() => void loadUsers(meta.page + 1, search)}
              className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <Modal open={formOpen} title={isEdit ? "Edit user" : "Create user"} onClose={() => setFormOpen(false)}>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { label: "Full name", key: "fullName" as const, type: "text" },
            { label: "Email", key: "email" as const, type: "email" },
            { label: "Password", key: "password" as const, type: "password" }
          ].map((field) => (
            <label key={field.key} className={field.key === "password" ? "md:col-span-2" : ""}>
              <span className="mb-2 block text-sm text-slate-300">{field.label}</span>
              <input
                type={field.type}
                value={form[field.key]}
                onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))}
                placeholder={field.label}
                className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-cyan-400"
              />
              {formErrors[field.key] && <p className="mt-2 text-sm text-rose-300">{formErrors[field.key]}</p>}
            </label>
          ))}

          <label>
            <span className="mb-2 block text-sm text-slate-300">Role</span>
            <select
              value={form.role}
              onChange={(event) =>
                setForm((current) => ({ ...current, role: event.target.value as FormState["role"] }))
              }
              className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </label>

          <label>
            <span className="mb-2 block text-sm text-slate-300">Status</span>
            <select
              value={form.status}
              onChange={(event) =>
                setForm((current) => ({ ...current, status: event.target.value as FormState["status"] }))
              }
              className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>

          <label className="md:col-span-2">
            <span className="mb-2 block text-sm text-slate-300">Profile image URL</span>
            <input
              value={form.profileImageUrl}
              onChange={(event) => setForm((current) => ({ ...current, profileImageUrl: event.target.value }))}
              placeholder="https://..."
              className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-cyan-400"
            />
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setFormOpen(false)}
            className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void saveUser()}
            disabled={actionLoading}
            className="rounded-full bg-cyan-400 px-5 py-2 text-sm font-semibold text-slate-950 disabled:opacity-60"
          >
            {actionLoading ? "Saving..." : "Save user"}
          </button>
        </div>
      </Modal>

      <Modal
        open={Boolean(confirmDelete)}
        title="Delete user"
        onClose={() => setConfirmDelete(null)}
      >
        <p className="text-slate-300">
          Are you sure you want to delete <span className="font-semibold text-white">{confirmDelete?.fullName}</span>?
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setConfirmDelete(null)}
            className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void removeUser()}
            disabled={actionLoading}
            className="rounded-full bg-rose-500 px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {actionLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Modal>
    </main>
  );
}

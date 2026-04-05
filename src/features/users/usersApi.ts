import { apiFetch } from "../../api/apiClient";
import type { UserSearchFilters } from "./components/UserFilters/UserFilters";
import type { UserListPagination } from "./components/UserList/UsersList";

export type UsersListResult = {
  users: UserListDto[];
  totalCount: number;
};

export type UserListDto = {
  userId: number;
  username: string;
  email: string;
  roleName: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string;
  savedShrineCount: number;
};

// GET /api/users/admin/list?page=...&pageSize=...&role=...&searchQuery=...&sort=...
export async function getUserList(filters: UserSearchFilters | null, pagination: UserListPagination): Promise<UsersListResult> {
  const page = pagination?.pageNumber ? `?page=${pagination.pageNumber}` : "?page=1";
  const pageSize = pagination?.pageSize ? `&pageSize=${pagination.pageSize}` : "&pageSize=5";
  const role = filters?.role ? `&role=${filters.role}` : "";
  const searchQuery = filters?.searchValue ? `&searchQuery=${filters.searchValue}` : "";
  const sort = filters?.sorting ? `&sort=${filters.sorting}` : "";
  
  return await apiFetch<UsersListResult>(`/api/users/admin/list${page}${pageSize}${role}${searchQuery}${sort}`);
}

// UPDATE User Role
export type UpdateUserRoleRequest = {
  userRole: string;
};

export async function updateUserRole(userId: number, payload: UpdateUserRoleRequest): Promise<void> {
  await apiFetch<void>(`/api/users/admin/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

// DELETE User
export async function deleteUser(userId: number): Promise<void> {
  await apiFetch<void>(`/api/users/admin/${userId}`, {
    method: "DELETE",
  });
}

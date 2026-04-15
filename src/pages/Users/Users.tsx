import { useState } from "react";
import UserFilters, {
  type UserSearchFilters,
} from "../../features/users/components/UserFilters/UserFilters";
import UsersList from "../../features/users/components/UserList/UsersList";
import UsersHeader from "../../features/users/components/UsersHeader/UsersHeader";
import BaseModal from "../../shared/components/modal/BaseModal";
import UpdateUserRoleForm from "../../features/users/components/UpdateUserRoleForm/UpdateUserRoleForm";
import ConfirmationModal from "../../shared/components/confirmationModal/ConfirmationModal";
import { deleteUser, updateUserRole, type UpdateUserRoleRequest, type UserListDto } from "../../features/users/usersApi";
import toast from "react-hot-toast";

export default function UsersPage() {
  const [filters, setFilters] = useState<UserSearchFilters | null>(null);

  const [onUpdate, setOnUpdate] = useState(0);
  const [selectedUser, setSelectedUser] = useState<UserListDto | null>(null);
  const [isHandlingAction, setIsHandlingAction] = useState(false);

  // Update User Role
  const [newUserRole, setNewUserRole] = useState("");
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isConfirmUpdateOpen, setIsConfirmUpdateOpen] = useState(false);
  const isInvalidRole =
    !selectedUser ||
    newUserRole === "" ||
    newUserRole === selectedUser.roleName;

  function openUserRoleEditor(user: UserListDto) {
    setSelectedUser(user);
    setIsUpdateModalOpen(true);
  }
  function closeUpdateModal() {
    setSelectedUser(null);
    setIsUpdateModalOpen(false);
  }
  function confirmUpdate() {
    if (isInvalidRole) return;
    setIsConfirmUpdateOpen(true);
  }
  async function handleUpdate() {
    if(selectedUser == null) return;
    if(newUserRole === "" || newUserRole === selectedUser.roleName) return;

    const body: UpdateUserRoleRequest = {
      userRole: newUserRole
    };

    try {
      setIsHandlingAction(true);

      await updateUserRole(selectedUser?.userId, body);
      toast.success("Role updated successfully!");

      setNewUserRole("");
      setIsConfirmUpdateOpen(false);
      setIsUpdateModalOpen(false);
      setOnUpdate((prev) => prev + 1); // refresh list
    } catch (error) {
      console.error("Failed to update user role:", error);
      const err = error as { message?: string };
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setIsHandlingAction(false);
    }
  }
  function cancelUpdate() {
    setIsConfirmUpdateOpen(false);
  }

  // Delete User
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  function openConfirmDelete(user: UserListDto) {
    setSelectedUser(user);
    setIsConfirmDeleteOpen(true);
  }
  async function handleRemove() {
    if(selectedUser == null) return;

    try {
      setIsHandlingAction(true);

      await deleteUser(selectedUser?.userId);
      toast.success("User deleted successfully!");

      setIsConfirmDeleteOpen(false);
      setOnUpdate((prev) => prev + 1); // refresh list
    } catch (error) {
      console.error("Failed to delete user:", error);
      const err = error as { message?: string };
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setIsHandlingAction(false);
    }
  }
  function cancelRemove() {
    setIsConfirmDeleteOpen(false);
  }

  return (
    <>
      <div>
        <UsersHeader />
        <div className="p-xl">
          <UserFilters onSearch={setFilters} />
          <UsersList
            filters={filters}
            onEdit={openUserRoleEditor}
            onRemove={openConfirmDelete}
            onUpdate={onUpdate}
            isDeleting={false}
          />
        </div>
      </div>

      <BaseModal
        isOpen={isUpdateModalOpen}
        title={"Update User Role"}
        onClose={closeUpdateModal}
        footer={
          <>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={closeUpdateModal}
              disabled={isHandlingAction}
            >
              Cancel
            </button>

            <button
              type="button"
              className="btn btn-primary"
              onClick={confirmUpdate}
              disabled={isHandlingAction || isInvalidRole}
            >
              Update User
            </button>
          </>
        }
      >
        <UpdateUserRoleForm
          user={selectedUser!}
          onRole={setNewUserRole}
        />
      </BaseModal>

      {/* Confirm Update Modal */}
      <ConfirmationModal
        isOpen={isConfirmUpdateOpen}
        variant="constructive"
        actionLabel={`Update "${selectedUser?.username}" to ${newUserRole} Role`}
        confirmLabel={isHandlingAction ? "Updating..." : "Update"}
        onConfirm={handleUpdate}
        onCancel={cancelUpdate}
      />

      {/* Confirm Delete Modal */}
      <ConfirmationModal
        isOpen={isConfirmDeleteOpen}
        variant="destructive"
        actionLabel="remove"
        title={`Remove User: ${selectedUser?.username}?`}
        message={`Are you sure you want to remove "${selectedUser?.username}" as a user? This action cannot be undone.`}
        subjectName={selectedUser?.username}
        confirmLabel={isHandlingAction ? "Removing..." : "Remove"}
        onConfirm={handleRemove}
        onCancel={cancelRemove}
      />
    </>
  );
}

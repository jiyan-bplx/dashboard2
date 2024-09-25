import { User } from "../auth/responses";

export interface CreateWorkspaceRequest {
	name: string;
	description?: string;
}

export interface InviteUsersRequest {
	emails: string[];
}

export interface RemoveUserFromWorkspaceRequest {
	user_id: User["id"];
}

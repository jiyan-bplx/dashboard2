import { FormItem } from "../forms/responses";
import { BaseResponse } from "../types/responses";

export interface GetWorkspacesResponse
	extends BaseResponse<WorkspaceListResponseItem> {}

export interface WorkspaceListResponseItem {
	forms: FormItem[];
	workspaces: Workspace[];
}

export interface Workspace {
	id: number;
	name: string;
	description: string;
	owner_id: number;
	users: User[];
	owner?: {
		id: number;
		name: string;
		email: string;
	};
}

export interface CreateWorkspaceResponse extends BaseResponse<Workspace> {}

export interface GetWorkspaceResponse extends BaseResponse<GetWorkspace> {}
export interface GetWorkspaceInvitesResponse
	extends BaseResponse<WorkspaceInviteItem[]> {}

export interface GetWorkspace {
	forms: FormItem[];
	workspace: Workspace;
}

export interface User {
	id: number;
	name: string;
	email: string;
}
export interface GetWorkspaceInvitedMembersResponse
	extends BaseResponse<WorkspaceInvitedMember[]> {}

export interface GetWorkspaceMembersResponse
	extends BaseResponse<{
		members: WorkspaceMemberItem[];
		owner: WorkspaceMemberItem;
	}> {}

export interface WorkspaceInvitedMember {
	id: number;
	workspace_id: number;
	Workspace?: Workspace;
	email: string;
	token: string;
}

export interface WorkspaceMemberItem {
	id: number;
	name: string;
	email: string;
	role: string;
	provider: string;
	photo: string;
	verified: boolean;
	stripe_customer_id: string;
	address: {
		line1: string;
		line2: string;
		city: string;
		country: string;
		postal_code: string;
		state: string;
	};
	requested_hippa: boolean;
	requested_gdpr: boolean;
	data_center_location: string;
	Workspaces: null;
	created_at: Date;
	updated_at: Date;
}

export interface WorkspaceInviteItem {
	id: number;
	workspace_id: number;
	Workspace: Workspace;
	email: string;
	token: string;
	InvitedBy: {
		id: number;
		name: string;
		email: string;
	};
}

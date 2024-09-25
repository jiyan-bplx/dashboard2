import { AxiosResponse } from "axios";
import { API } from "..";
import {
	CreateWorkspaceRequest,
	InviteUsersRequest,
	RemoveUserFromWorkspaceRequest,
} from "./requests";
import {
	CreateWorkspaceResponse,
	GetWorkspaceInvitedMembersResponse,
	GetWorkspaceInvitesResponse,
	GetWorkspaceMembersResponse,
	GetWorkspaceResponse,
	GetWorkspacesResponse,
	Workspace,
	WorkspaceInvitedMember,
} from "./responses";
import { BaseResponse } from "../types/responses";

export const getAllWorkspaces = async () => {
	const res = await API.get<GetWorkspacesResponse>("/api/workspace");
	return res.data;
};

export const createWorkspace = async (data: CreateWorkspaceRequest) => {
	const res = await API.post<
		any,
		AxiosResponse<CreateWorkspaceResponse>,
		CreateWorkspaceRequest
	>(`/api/workspace`, data);

	return res.data;
};

export const getWorkspaceInvitedMembersList = async (
	workspaceId: Workspace["id"]
) => {
	const res = await API.get<GetWorkspaceInvitedMembersResponse>(
		"/api/workspace/invited-members/" + workspaceId
	);
	return res.data;
};

export const getWorkspaceMembersList = async (workspaceId: Workspace["id"]) => {
	const res = await API.get<GetWorkspaceMembersResponse>(
		"/api/workspace/members/" + workspaceId
	);
	return res.data;
};

export const getWorkspaceInvites = async () => {
	const res = await API.get<GetWorkspaceInvitesResponse>(
		"/api/workspace/invites"
	);
	return res.data;
};

export const getWorkspaceById = async (workspaceId: Workspace["id"]) => {
	const res = await API.get<GetWorkspaceResponse>(
		"/api/workspace/" + workspaceId
	);
	return res.data;
};

export const updateWorkspace = async (
	workspaceId: Workspace["id"],
	data: CreateWorkspaceRequest
) => {
	const res = await API.patch<
		any,
		AxiosResponse<CreateWorkspaceResponse>,
		CreateWorkspaceRequest
	>(`/api/workspace/${workspaceId}`, data);

	return res.data;
};

export const removeUserFromWorkspace = async (
	workspaceId: Workspace["id"],
	data: RemoveUserFromWorkspaceRequest
) => {
	const res = await API.post<
		any,
		AxiosResponse<CreateWorkspaceResponse>,
		RemoveUserFromWorkspaceRequest
	>(`/api/workspace/${workspaceId}/remove-user`, data);

	return res.data;
};

export const removeInvitedUserFromWorkspace = async (
	workspaceId: Workspace["id"],
	inviteId: WorkspaceInvitedMember["id"]
) => {
	const res = await API.delete<
		any,
		AxiosResponse<CreateWorkspaceResponse>,
		RemoveUserFromWorkspaceRequest
	>(`/api/workspace/invites/${workspaceId}/${inviteId}`);

	return res.data;
};

export const deleteWorkspace = async (workspaceId: Workspace["id"]) => {
	const res = await API.delete<BaseResponse<null>>(
		`/api/workspace/${workspaceId}`
	);
	return res.data;
};

export const leaveWorkspace = async (workspaceId: Workspace["id"]) => {
	const res = await API.get<BaseResponse<null>>(
		`/api/workspace/${workspaceId}/leave`
	);
	return res.data;
};

export const inviteUsersToWorkspace = async (
	workspaceId: Workspace["id"],
	data: InviteUsersRequest
) => {
	const res = await API.post<
		any,
		AxiosResponse<BaseResponse<string>>,
		InviteUsersRequest
	>(`/api/workspace/${workspaceId}/invite`, data);

	return res.data;
};

export const acceptWorkspaceInvite = async (inviteToken: string) => {
	const res = await API.get<BaseResponse<null>>(
		`/api/workspace/${inviteToken}/accept`
	);

	return res.data;
};

export const changeFormWorkspace = async (
	formId: number,
	workspaceId: number
) => {
	const res = await API.get<BaseResponse<null>>(
		`/api/workspace/change-form-workspace/${workspaceId}/${formId}`
	);

	return res.data;
};

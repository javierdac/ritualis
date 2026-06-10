import type { Dinamica } from "./types";

export interface ProjectDTO {
  _id: string;
  name: string;
  description?: string;
  teamCount?: number;
  createdAt: string;
}

export interface TeamDTO {
  _id: string;
  name: string;
  description?: string;
  projects: string[];
  projectNames: { _id: string; name: string }[];
  memberCount?: number;
  createdAt: string;
}

export interface PersonDTO {
  _id: string;
  name: string;
  role?: string;
  email?: string;
  teams: string[];
  teamNames: { _id: string; name: string }[];
  noteCount?: number;
  createdAt: string;
}

export interface NoteDTO {
  _id: string;
  text: string;
  authorName: string;
  createdAt: string;
}

export type DynamicDTO = Omit<Dinamica, "tips"> & {
  _id: string;
  tips: string[];
  isSeed: boolean;
  owner?: string;
};

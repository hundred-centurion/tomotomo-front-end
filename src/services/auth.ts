import { Api } from '@/services/.api.ts';

export const apiClient = new Api();

export const API = apiClient.api;

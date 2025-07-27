import api from './api';

export interface Category {
  _id: string;
  name: string;
  slug?: string;
  description?: string;
  parentId?: string;
}

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await api.get('/categories');
  return data;
}; 
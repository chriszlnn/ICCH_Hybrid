// src/lib/types.ts
export type SignInResponse = {
    error?: string;
    success?: boolean;
};

export interface BeautyPost {
    id: number
    images: string[]
    title: string
    body: string
    likes: number
    liked?: boolean
  }
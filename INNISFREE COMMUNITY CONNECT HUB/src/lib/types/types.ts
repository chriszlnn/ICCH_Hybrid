// src/lib/types.ts
export type SignInResponse = {
    error?: string;
    success?: boolean;
};

// Base type that matches Prisma schema exactly
export interface BeautyPostBase {
    id: number;
    title: string;
    images: string[];
    file: string;
    likes: number;
    createdAt: Date;
    updatedAt: Date;
}

// Extended type for client-side use with additional fields
export interface BeautyPost extends BeautyPostBase {
    userLiked: boolean;  // Client-side state for like status
}

// Type for creating new posts
export type CreateBeautyPost = Omit<BeautyPostBase, 'id' | 'likes' | 'createdAt' | 'updatedAt'>;
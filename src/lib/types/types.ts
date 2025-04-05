// src/lib/types.ts
export type SignInResponse = {
    error?: string;
    success?: boolean;
};

export interface BeautyPost {
    id?: number;
    title: string;
    images: string[];
    file: string;      // Added to match Prisma schema
    likes: number;
    userLiked: boolean;
    body?: string;
    createdAt?: Date;  // Optional since you might not always need these
    updatedAt?: Date;  // Optional since you might not always need these
    liked?: boolean;   // Client-side state
}

// Optional: Add a type for creating new posts
export type CreateBeautyPost = Omit<BeautyPost, 'id' | 'likes' | 'createdAt' | 'updatedAt'>;
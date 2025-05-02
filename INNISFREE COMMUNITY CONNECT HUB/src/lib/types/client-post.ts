// types/client-post.ts
export interface User {
    id: string;
    email: string;
    // Add other User properties you need
  }
  
  export interface Client {
    id: string;
    userId: string;
    email: string;
    // Add other Client properties you need
  }
  
  export interface Product {
    id: string;
    name: string;
    image: string;
    // Add other Product properties you need
  }
export interface ClientPost {
    id: string;
    title: string;
    content: string;
    images: string[];
    createdAt: Date;
    updatedAt: Date;
    clientId: string;
    client: Client;
    likes: PostLike[];
    comments: Comment[];
    taggedProducts: PostTaggedProduct[];
  }
  
  export interface PostTaggedProduct {
    id: string;
    postId: string;
    productId: string;
    product: Product;
  }
  
  export interface PostLike {
    id: string;
    postId: string;
    userId: string;
    user: User;
    createdAt: Date;
  }
  
  export interface Comment {
    id: string;
    content: string;
    postId: string;
    userId: string;
    user: User;
    createdAt: Date;
    updatedAt: Date;
  }
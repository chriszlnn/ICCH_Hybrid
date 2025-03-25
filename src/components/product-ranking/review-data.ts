// Add this new file for mock review data

import type { Review } from "./types"

// Mock reviews data organized by product ID
export const mockReviews: Record<string, Review[]> = {
  sc1: [
    {
      id: "r1",
      userId: "user1",
      username: "Sarah K.",
      rating: 5,
      comment:
        "This toner is amazing! It leaves my skin feeling so refreshed without drying it out. I've been using it for 3 months and my skin has never looked better.",
      date: "2023-11-15",
      likes: 24,
      skinType: ["Dry Skin", "Sensitive Skin"],
    },
    {
      id: "r2",
      userId: "user2",
      username: "Michael T.",
      rating: 4,
      comment: "Great product for sensitive skin. Gentle but effective. Would recommend!",
      date: "2023-10-22",
      likes: 12,
      skinType: ["Dry Skin", "Sensitive Skin"],
    },
    {
      id: "r3",
      userId: "user3",
      username: "Jessica L.",
      rating: 5,
      comment: "I love how this doesn't strip my skin's natural oils. Perfect for daily use.",
      date: "2023-09-30",
      likes: 18,
      skinType: ["Oily Skin", "Acne-Prone"],
      image: "/placeholder.svg?height=200&width=200",
    },
  ],
  sc2: [
    {
      id: "r4",
      userId: "user4",
      username: "David W.",
      rating: 5,
      comment: "This cleanser is a game changer! My skin feels so clean after using it. Definitely worth the price.",
      date: "2023-11-10",
      likes: 32,
      skinType: ["Combination Skin"],
    },
    {
      id: "r5",
      userId: "user5",
      username: "Emma R.",
      rating: 5,
      comment: "I've tried many cleansers but this one is by far the best. Removes all makeup without drying my skin.",
      date: "2023-10-05",
      likes: 27,
      skinType: ["Normal Skin"],
    },
  ],
  sc3: [
    {
      id: "r6",
      userId: "user6",
      username: "Alex T.",
      rating: 4,
      comment: "Works well for my acne-prone skin. Doesn't irritate and keeps breakouts at bay.",
      date: "2023-11-12",
      likes: 19,
      skinType: ["Acne-Prone", "Oily Skin"],
    },
  ],
  ss1: [
    {
      id: "r7",
      userId: "user7",
      username: "Jennifer P.",
      rating: 5,
      comment: "This serum is incredible! My skin looks so much brighter and more hydrated.",
      date: "2023-11-05",
      likes: 41,
      skinType: ["Dry Skin", "Aging Skin"],
    },
  ],
  sm1: [
    {
      id: "r8",
      userId: "user8",
      username: "Robert K.",
      rating: 5,
      comment: "Best moisturizer I've ever used. Keeps my skin hydrated all day without feeling greasy.",
      date: "2023-10-28",
      likes: 36,
      skinType: ["Combination Skin"],
    },
  ],
}


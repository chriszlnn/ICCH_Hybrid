"use client";

import { useState, useEffect } from "react";
import { Users, UserPlus, UserCheck, UserX } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  inactiveUsers: number;
}

interface User {
  id: string;
  email: string;
  createdAt: string;
  productLikes: Array<{ id: string; productId: string }>;
  reviews: Array<{ id: string; productId: string }>;
}

export function UserAnalytics() {
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    activeUsers: 0,
    newUsersToday: 0,
    inactiveUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const response = await fetch("/api/users");
        const users: User[] = await response.json();
        
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        const newUsersToday = users.filter((user: User) => {
          const userDate = new Date(user.createdAt);
          return userDate >= today;
        }).length;

        // For demo purposes, consider users active if they have liked or reviewed products
        const activeUsers = users.filter((user: User) => 
          (user.productLikes?.length > 0 || user.reviews?.length > 0)
        ).length;

        setStats({
          totalUsers: users.length,
          activeUsers,
          newUsersToday,
          inactiveUsers: users.length - activeUsers,
        });
      } catch (error) {
        console.error("Error fetching user stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalUsers}</div>
          <p className="text-xs text-muted-foreground">
            Registered users
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeUsers}</div>
          <p className="text-xs text-muted-foreground">
            Users with activity
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">New Users Today</CardTitle>
          <UserPlus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.newUsersToday}</div>
          <p className="text-xs text-muted-foreground">
            Joined in the last 24h
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Inactive Users</CardTitle>
          <UserX className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.inactiveUsers}</div>
          <p className="text-xs text-muted-foreground">
            No recent activity
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 
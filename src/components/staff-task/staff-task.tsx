"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Star } from "lucide-react"
import { format } from "date-fns"

// Task type definition
type Task = {
  id: string
  title: string
  content: string
  assignedTo: string
  staff?: {
    id: string
    name: string | null
    email: string
  }
  dueDate: Date
  priority: "low" | "medium" | "high"
  status: "planning" | "in progress" | "completed"
  isFavorite: boolean
}

export default function StaffTask() {
  // Get current staff ID from session
  const [currentStaffId, setCurrentStaffId] = useState<string | null>(null)

  // State for tasks
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const tasksPerPage = 5

  // Fetch current staff ID
  const fetchCurrentStaff = async () => {
    try {
      const response = await fetch("/api/auth/session")
      if (!response.ok) throw new Error("Failed to fetch session")
      const data = await response.json()
      console.log("Session data:", data)
      
      // Get the user's email from the session
      const userEmail = data.user?.email
      if (!userEmail) {
        console.error("No user email in session")
        return
      }

      // Fetch the staff record using the email
      const staffResponse = await fetch(`/api/staff/email/${userEmail}`)
      if (!staffResponse.ok) throw new Error("Failed to fetch staff record")
      const staffData = await staffResponse.json()
      console.log("Staff data:", staffData)
      
      setCurrentStaffId(staffData.id)
    } catch (error) {
      console.error("Error fetching current staff:", error)
    }
  }

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks")
      if (!response.ok) throw new Error("Failed to fetch tasks")
      const data = await response.json()
      console.log("Fetched tasks:", data)
      // Parse dates in the received data
      const tasksWithParsedDates = data.map((task: { dueDate: string } & Omit<Task, 'dueDate'>) => ({
        ...task,
        dueDate: new Date(task.dueDate)
      }))
      setTasks(tasksWithParsedDates)
    } catch (error) {
      console.error("Error fetching tasks:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Load tasks and staff ID on component mount
  useEffect(() => {
    fetchCurrentStaff()
    fetchTasks()
  }, [])

  // Filter tasks for current staff
  const myTasks = tasks
    .filter((task) => {
      console.log("Comparing task.assignedTo:", task.assignedTo, "with currentStaffId:", currentStaffId)
      return task.assignedTo === currentStaffId
    })
    .sort((a, b) => {
      // Sort by favorite status first
      if (a.isFavorite && !b.isFavorite) return -1
      if (!a.isFavorite && b.isFavorite) return 1

      // Then sort by due date
      return a.dueDate.getTime() - b.dueDate.getTime()
    })

  console.log("Filtered myTasks:", myTasks)

  const totalPages = Math.ceil(myTasks.length / tasksPerPage)
  const currentTasks = myTasks.slice((currentPage - 1) * tasksPerPage, currentPage * tasksPerPage)

  // Toggle favorite status
  const toggleFavorite = (taskId: string) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, isFavorite: !task.isFavorite } : task)))
  }

  // Update task status
  const updateStatus = async (taskId: string, newStatus: "planning" | "in progress" | "completed") => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      })

      if (!response.ok) throw new Error("Failed to update task status")
      await fetchTasks()
    } catch (error) {
      console.error("Error updating task status:", error)
    }
  }

  // Get priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "planning":
        return "bg-blue-100 text-blue-800"
      case "in progress":
        return "bg-purple-100 text-purple-800"
      case "completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Calculate days remaining
  const getDaysRemaining = (dueDate: Date) => {
    const today = new Date()
    const diffTime = dueDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="space-y-4 md:space-y-6 w-full mt-16 md:mt-20">
      <Card className="w-full">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-lg md:text-xl">My Tasks</CardTitle>
          <CardDescription className="text-sm md:text-base">View and manage tasks assigned to you</CardDescription>
        </CardHeader>
        <CardContent className="p-0 md:p-6">
          {/* Desktop Table View */}
          <div className="hidden md:block rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      Loading tasks...
                    </TableCell>
                  </TableRow>
                ) : currentTasks.length > 0 ? (
                  currentTasks.map((task) => (
                    <TableRow key={task.id} className={task.isFavorite ? "bg-yellow-50" : ""}>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleFavorite(task.id)}
                          className={task.isFavorite ? "text-yellow-500" : "text-gray-400"}
                        >
                          <Star className="h-5 w-5 fill-current" />
                        </Button>
                      </TableCell>
                      <TableCell className="font-medium">{task.title}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{task.content}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{format(task.dueDate, "MMM dd, yyyy")}</span>
                          <span className="text-xs text-muted-foreground">
                            {getDaysRemaining(task.dueDate)} days left
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(task.status)}>
                          {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={task.status}
                          onValueChange={(value) =>
                            updateStatus(task.id, value as "planning" | "in progress" | "completed")
                          }
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Update status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="planning">Planning</SelectItem>
                            <SelectItem value="in progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      No tasks assigned to you
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4 p-4 overflow-y-auto max-h-[calc(100vh-300px)]">
            {currentTasks.length > 0 ? (
              currentTasks.map((task) => (
                <div
                  key={task.id}
                  className={`rounded-lg border p-4 space-y-3 ${
                    task.isFavorite ? "bg-yellow-50" : "bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleFavorite(task.id)}
                          className={`h-8 w-8 p-0 ${
                            task.isFavorite ? "text-yellow-500" : "text-gray-400"
                          }`}
                        >
                          <Star className="h-4 w-4 fill-current" />
                        </Button>
                        <h3 className="font-medium text-sm">{task.title}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{task.content}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </Badge>
                    <Badge className={getStatusColor(task.status)}>
                      {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </Badge>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium">
                      {format(task.dueDate, "MMM dd, yyyy")}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {getDaysRemaining(task.dueDate)} days left
                    </span>
                  </div>

                  <Select
                    value={task.status}
                    onValueChange={(value) =>
                      updateStatus(task.id, value as "planning" | "in progress" | "completed")
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Update status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planning">Planning</SelectItem>
                      <SelectItem value="in progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">No tasks assigned to you</div>
            )}
          </div>
        </CardContent>
        {myTasks.length > tasksPerPage && (
          <CardFooter className="p-4 md:p-6 border-t">
            <Pagination className="w-full">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className={`h-8 w-8 p-0 ${
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }`}
                  />
                </PaginationItem>
                <div className="hidden md:flex">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="h-8 w-8 p-0"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                </div>
                <PaginationItem className="md:hidden">
                  <span className="text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    className={`h-8 w-8 p-0 ${
                      currentPage === totalPages ? "pointer-events-none opacity-50" : ""
                    }`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}

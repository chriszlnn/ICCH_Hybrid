"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
//import { useToast } from "@/components/ui/use-toast"
//import { useAuth } from "@/contexts/auth-context"
//import { useStaff } from "@/contexts/staff-context"
//import { useTasks } from "@/contexts/task-context"
//import { Task } from "@/types/task"
//import { Staff } from "@/types/staff"
//import { useNavigate } from "react-router-dom"
import { CalendarIcon, Pencil, Trash2 } from "lucide-react"

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
  createdAt: Date
  updatedAt: Date
}

// Staff type definition
type Staff = {
  id: string
  name: string | null
  email: string
  department: string | null
}

export default function AdminTask() {
  // State for tasks
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [staffMembers, setStaffMembers] = useState<Staff[]>([])
  const [isLoadingStaff, setIsLoadingStaff] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // State for form
  const [isEditing, setIsEditing] = useState(false)
  const [currentTask, setCurrentTask] = useState<Task | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [assignedTo, setAssignedTo] = useState<string | null>(null)
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "">("")

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const tasksPerPage = 5

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks")
      if (!response.ok) throw new Error("Failed to fetch tasks")
      const data = await response.json()
      // Parse dates in the received data
      const tasksWithParsedDates = data.map((task: { dueDate: string; createdAt: string; updatedAt: string } & Omit<Task, 'dueDate' | 'createdAt' | 'updatedAt'>) => ({
        ...task,
        dueDate: new Date(task.dueDate),
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt)
      }))
      setTasks(tasksWithParsedDates)
    } catch (error) {
      console.error("Error fetching tasks:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch staff members
  const fetchStaffMembers = async () => {
    try {
      const response = await fetch("/api/staff")
      if (!response.ok) throw new Error("Failed to fetch staff members")
      const data = await response.json()
      setStaffMembers(data)
    } catch (error) {
      console.error("Error fetching staff members:", error)
    } finally {
      setIsLoadingStaff(false)
    }
  }

  // Load tasks and staff members on component mount
  useEffect(() => {
    fetchTasks()
    fetchStaffMembers()
  }, [])

  // Reset form
  const resetForm = () => {
    setTitle("")
    setContent("")
    setAssignedTo(null)
    setDueDate(undefined)
    setPriority("")
    setCurrentTask(null)
    setIsEditing(false)
    setIsDialogOpen(false)
  }

  // Handle form submission
  const handleSubmit = async () => {
    if (!title || !content || !assignedTo || !dueDate || !priority) {
      return
    }

    try {
      if (isEditing && currentTask) {
        // Update existing task
        const response = await fetch(`/api/tasks/${currentTask.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            content,
            assignedTo,
            dueDate: dueDate.toISOString(),
            priority,
            status: currentTask.status,
          }),
        })

        if (!response.ok) throw new Error("Failed to update task")
        await fetchTasks()
      } else {
        // Create new task
        const response = await fetch("/api/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            content,
            assignedTo,
            dueDate: dueDate.toISOString(),
            priority,
            status: "planning",
          }),
        })

        if (!response.ok) throw new Error("Failed to create task")
        await fetchTasks()
      }

      resetForm()
    } catch (error) {
      console.error("Error saving task:", error)
    }
  }

  // Handle edit task
  const handleEditTask = (task: Task) => {
    setCurrentTask(task)
    setTitle(task.title)
    setContent(task.content)
    setAssignedTo(task.assignedTo)
    setDueDate(task.dueDate)
    setPriority(task.priority)
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  // Delete task
  const deleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete task")
      await fetchTasks()
    } catch (error) {
      console.error("Error deleting task:", error)
    }
  }

  // Calculate days remaining
  const getDaysRemaining = (dueDate: Date) => {
    const today = new Date()
    const diffTime = dueDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
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

  // Format date for display
  const formatDate = (date: Date | string) => {
    if (!date) return "No date set";
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return "Invalid date";
    return format(dateObj, "MMM dd, yyyy");
  }

  return (
    <div className="space-y-4 md:space-y-6 w-full">
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-bold">Task Management</h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  resetForm();
                  setIsEditing(false);
                  setIsDialogOpen(true);
                }} className="w-full md:w-auto">Assign New Task</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] w-[95%]">
                <DialogHeader>
                  <DialogTitle>{isEditing ? "Edit Task" : "Assign New Task"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={(e) => { 
                  e.preventDefault(); 
                  handleSubmit(); 
                }}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Task Title</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter task title"
                        className="w-full"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="content">Task Content</Label>
                      <Textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Enter task details"
                        rows={4}
                        className="w-full"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="staff">Assign To</Label>
                      <div className="relative">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                          onClick={() => {
                            const selectElement = document.getElementById('staff-select-dropdown');
                            if (selectElement) {
                              selectElement.style.display = selectElement.style.display === 'none' ? 'block' : 'none';
                            }
                          }}
                        >
                          {assignedTo !== null 
                              ? staffMembers.find(s => s.id === assignedTo)?.name 
                              : "Select staff member"}
                        </Button>
                        <div 
                          id="staff-select-dropdown" 
                          className="absolute z-50 mt-2 w-full rounded-md border bg-popover p-1 shadow-md"
                          style={{ display: 'none' }}
                        >
                          {isLoadingStaff ? (
                            <div className="px-2 py-1.5 text-sm text-muted-foreground">Loading staff members...</div>
                          ) : staffMembers.length > 0 ? (
                            staffMembers.map((staff) => (
                              <div 
                                key={staff.id} 
                                className="cursor-pointer rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                                onClick={() => {
                                  setAssignedTo(staff.id);
                                  const selectElement = document.getElementById('staff-select-dropdown');
                                  if (selectElement) {
                                    selectElement.style.display = 'none';
                                  }
                                }}
                              >
                                {staff.name} ({staff.email})
                              </div>
                            ))
                          ) : (
                            <div className="px-2 py-1.5 text-sm text-muted-foreground">No staff members available</div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label>Due Date</Label>
                      <div className="relative">
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dueDate && "text-muted-foreground"
                          )}
                          onClick={() => {
                            const calendarElement = document.getElementById('calendar-popover');
                            if (calendarElement) {
                              calendarElement.style.display = calendarElement.style.display === 'none' ? 'block' : 'none';
                            }
                          }}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dueDate ? formatDate(dueDate) : <span>Pick a date</span>}
                        </Button>
                        <div 
                          id="calendar-popover" 
                          className="absolute z-50 mt-2 w-auto rounded-md border bg-popover p-0 shadow-md"
                          style={{ display: 'none' }}
                        >
                          <Calendar
                            mode="single"
                            selected={dueDate}
                            onSelect={(date) => {
                              setDueDate(date);
                              const calendarElement = document.getElementById('calendar-popover');
                              if (calendarElement) {
                                calendarElement.style.display = 'none';
                              }
                            }}
                            initialFocus
                            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                            className="rounded-md border"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select 
                        value={priority} 
                        onValueChange={(value: "low" | "medium" | "high") => setPriority(value)}
                      >
                        <SelectTrigger id="priority" className="w-full">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="outline" onClick={resetForm}>
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button type="submit">{isEditing ? "Save Changes" : "Create Task"}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead>Assigned To</TableHead>
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
                ) : tasks.length > 0 ? (
                  tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.title}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{task.content}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{task.staff?.name || 'Unassigned'}</span>
                          <span className="text-xs text-muted-foreground">
                            {task.staff?.email || ''}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{formatDate(task.dueDate)}</span>
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
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditTask(task)}
                            className="h-8 w-8 p-0"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteTask(task.id)}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      No tasks available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {isLoading ? (
              <div className="text-center py-4">Loading tasks...</div>
            ) : tasks.length > 0 ? (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-lg border p-4 space-y-3 bg-white"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{task.title}</h3>
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
                    <span className="text-sm font-medium">Assigned to: {task.staff?.name || 'Unassigned'}</span>
                    <span className="text-sm font-medium">
                      Due: {formatDate(task.dueDate)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {getDaysRemaining(task.dueDate)} days left
                    </span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditTask(task)}
                      className="flex-1"
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteTask(task.id)}
                      className="flex-1 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">No tasks available</div>
            )}
          </div>
        </CardContent>
        {tasks.length > tasksPerPage && (
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
                  {Array.from({ length: Math.ceil(tasks.length / tasksPerPage) }, (_, i) => i + 1).map((page) => (
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
                    Page {currentPage} of {Math.ceil(tasks.length / tasksPerPage)}
                  </span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(tasks.length / tasksPerPage)))}
                    className={`h-8 w-8 p-0 ${
                      currentPage === Math.ceil(tasks.length / tasksPerPage) ? "pointer-events-none opacity-50" : ""
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

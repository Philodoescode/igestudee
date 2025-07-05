"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  Search,
  MoreHorizontal,
  Eye,
  Send,
  FileText,
} from "lucide-react"
import { motion } from "framer-motion"
import { instructorFinancialStats, instructorTransactions } from "@/lib/database"

export default function FinancialPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  const filteredTransactions = instructorTransactions.filter((transaction) => {
    const matchesSearch =
      transaction.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.invoiceId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
      case "overdue":
        return (
          <Badge className="bg-red-100 text-red-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            Overdue
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Management</h1>
          <p className="text-gray-600 mt-2">Monitor payments, invoices, and revenue</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
            <FileText className="h-4 w-4 mr-2" />
            Generate Invoice
          </Button>
        </div>
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <Card className="bg-gradient-to-br from-green-600 to-emerald-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Total Revenue</p>
                  <p className="text-3xl font-bold">${instructorFinancialStats.totalRevenue.toLocaleString()}</p>
                  <p className="text-green-100 text-sm">All time</p>
                </div>
                <DollarSign className="h-12 w-12 text-green-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <Card className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Monthly Revenue</p>
                  <p className="text-3xl font-bold">${instructorFinancialStats.monthlyRevenue.toLocaleString()}</p>
                  <p className="text-blue-100 text-sm">+15% from last month</p>
                </div>
                <TrendingUp className="h-12 w-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
          <Card className="bg-gradient-to-br from-yellow-600 to-orange-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">Pending Payments</p>
                  <p className="text-3xl font-bold">${instructorFinancialStats.pendingPayments.toLocaleString()}</p>
                  <p className="text-yellow-100 text-sm">Awaiting payment</p>
                </div>
                <Clock className="h-12 w-12 text-yellow-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
          <Card className="bg-gradient-to-br from-red-600 to-pink-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium">Overdue Payments</p>
                  <p className="text-3xl font-bold">${instructorFinancialStats.overduePayments.toLocaleString()}</p>
                  <p className="text-red-100 text-sm">Requires attention</p>
                </div>
                <AlertCircle className="h-12 w-12 text-red-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Payment Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Payment Status Overview</CardTitle>
            <CardDescription>Current payment status breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-900">Paid Students</p>
                    <p className="text-sm text-green-700">Current payments up to date</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">{instructorFinancialStats.paidStudents}</p>
                  <p className="text-sm text-green-600">
                    {Math.round((instructorFinancialStats.paidStudents / instructorFinancialStats.totalStudents) * 100)}%
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="h-8 w-8 text-yellow-600" />
                  <div>
                    <p className="font-semibold text-yellow-900">Pending Payments</p>
                    <p className="text-sm text-yellow-700">Awaiting payment processing</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-yellow-600">8</p>
                  <p className="text-sm text-yellow-600">5%</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="font-semibold text-red-900">Overdue Payments</p>
                    <p className="text-sm text-red-700">Requires immediate attention</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-red-600">6</p>
                  <p className="text-sm text-red-600">4%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common financial management tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <Button className="justify-start h-auto p-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <FileText className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <p className="font-semibold">Generate Monthly Report</p>
                  <p className="text-sm opacity-90">Create comprehensive financial report</p>
                </div>
              </Button>

              <Button variant="outline" className="justify-start h-auto p-4 border-green-200 hover:bg-green-50">
                <Send className="h-5 w-5 mr-3 text-green-600" />
                <div className="text-left">
                  <p className="font-semibold text-green-900">Send Payment Reminders</p>
                  <p className="text-sm text-green-700">Notify students with pending payments</p>
                </div>
              </Button>

              <Button variant="outline" className="justify-start h-auto p-4 border-purple-200 hover:bg-purple-50">
                <CreditCard className="h-5 w-5 mr-3 text-purple-600" />
                <div className="text-left">
                  <p className="font-semibold text-purple-900">Process Bulk Payments</p>
                  <p className="text-sm text-purple-700">Handle multiple payment processing</p>
                </div>
              </Button>

              <Button variant="outline" className="justify-start h-auto p-4 border-orange-200 hover:bg-orange-50">
                <AlertCircle className="h-5 w-5 mr-3 text-orange-600" />
                <div className="text-left">
                  <p className="font-semibold text-orange-900">Review Overdue Accounts</p>
                  <p className="text-sm text-orange-700">Manage accounts requiring attention</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Recent payment transactions and invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Invoice</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction, index) => (
                  <motion.tr
                    key={transaction.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="hover:bg-gray-50"
                  >
                    <TableCell>
                      <div className="font-medium text-gray-900">{transaction.studentName}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">{transaction.course}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-gray-900">${transaction.amount}</div>
                    </TableCell>
                    <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-gray-600">
                        <CreditCard className="h-4 w-4 mr-1" />
                        {transaction.method}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {transaction.invoiceId}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" />
                            Download Invoice
                          </DropdownMenuItem>
                          {transaction.status === "pending" && (
                            <DropdownMenuItem>
                              <Send className="mr-2 h-4 w-4" />
                              Send Reminder
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
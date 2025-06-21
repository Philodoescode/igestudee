// app/parent/billing/page.tsx
"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CreditCard,
  Download,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  Receipt,
  Shield,
} from "lucide-react"
import { motion } from "framer-motion"
import { parentBillingData } from "@/lib/database"

export default function BillingPage() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "overdue":
        return "bg-red-100 text-red-800 border-red-200"
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "overdue":
        return <AlertCircle className="h-4 w-4" />
      case "scheduled":
        return <Calendar className="h-4 w-4" />
      default:
        return <Receipt className="h-4 w-4" />
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <motion.div className="space-y-8" variants={containerVariants} initial="hidden" animate="visible">
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
          <h1 className="text-3xl font-poppins font-bold mb-2 flex items-center">
            <CreditCard className="h-8 w-8 mr-3" />
            Billing & Payments
          </h1>
          <p className="text-green-100 text-lg">Manage your tuition payments and billing information</p>
        </div>
      </motion.div>

      {/* Next Payment Due */}
      <motion.div variants={itemVariants}>
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-center text-center sm:text-left sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Calendar className="h-10 w-10 text-purple-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-purple-800">Next Payment Due</h3>
                <p className="text-lg font-medium text-purple-900">{parentBillingData.nextPaymentDue.description}</p>
              </div>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-2xl font-bold text-purple-900">${parentBillingData.nextPaymentDue.amount}</p>
              <p className="text-sm text-purple-600">on {parentBillingData.nextPaymentDue.date}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="history">Payment History</TabsTrigger>
            <TabsTrigger value="make-payment">Make Payment</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-poppins">Upcoming Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {parentBillingData.upcomingPayments.map((payment, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-xl bg-gray-50"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-white rounded-lg shadow-sm">{getStatusIcon(payment.status)}</div>
                        <div>
                          <h4 className="font-medium text-gray-900">{payment.description}</h4>
                          <p className="text-sm text-gray-500">{payment.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">${payment.amount}</p>
                        <Badge variant="outline" className={getStatusColor(payment.status)}>
                          {payment.status}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-poppins">Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {parentBillingData.paymentHistory.map((payment, index) => (
                    <motion.div
                      key={payment.id}
                      className="flex items-center justify-between p-4 rounded-xl border"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Receipt className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{payment.description}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Invoice: {payment.id}</span>
                            <span>•</span>
                            <span>{payment.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">${payment.amount}</p>
                          <Badge variant="outline" className={getStatusColor(payment.status)}>
                            {payment.status}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="make-payment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-poppins">Make a Payment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Payment Amount</Label>
                      <Input id="amount" type="number" placeholder="450.00" defaultValue="450.00" className="text-lg" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Payment Description</Label>
                      <Input id="description" placeholder="February 2024 Tuition" defaultValue="February 2024 Tuition" />
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Payment Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tuition Amount:</span>
                        <span className="font-medium">$450.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Processing Fee:</span>
                        <span className="font-medium">$0.00</span>
                      </div>
                      <div className="border-t pt-3">
                        <div className="flex justify-between">
                          <span className="font-semibold">Total:</span>
                          <span className="font-bold text-lg">$450.00</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-lg">
                    <Shield className="h-5 w-5 mr-2" />
                    Process Secure Payment
                  </Button>
                </motion.div>
                <div className="text-center text-sm text-gray-500">
                  <Shield className="h-4 w-4 inline mr-1" />
                  Your payment information is encrypted and secure
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  )
}
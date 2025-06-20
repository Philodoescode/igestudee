"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CreditCard,
  Download,
  Calendar,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Clock,
  Receipt,
  Plus,
} from "lucide-react"
import { motion } from "framer-motion"

// Mock data
const billingInfo = {
  currentPlan: "Premium Student Plan",
  monthlyFee: 149.99,
  nextBilling: "2024-02-15",
  status: "active",
  paymentMethod: {
    type: "card",
    last4: "4242",
    brand: "Visa",
    expiryMonth: 12,
    expiryYear: 2025,
  },
}

const paymentHistory = [
  {
    id: "inv_001",
    date: "2024-01-15",
    amount: 149.99,
    status: "paid",
    description: "Premium Student Plan - January 2024",
    downloadUrl: "#",
  },
  {
    id: "inv_002",
    date: "2023-12-15",
    amount: 149.99,
    status: "paid",
    description: "Premium Student Plan - December 2023",
    downloadUrl: "#",
  },
  {
    id: "inv_003",
    date: "2023-11-15",
    amount: 149.99,
    status: "paid",
    description: "Premium Student Plan - November 2023",
    downloadUrl: "#",
  },
  {
    id: "inv_004",
    date: "2023-10-15",
    amount: 149.99,
    status: "paid",
    description: "Premium Student Plan - October 2023",
    downloadUrl: "#",
  },
]

const plans = [
  {
    name: "Basic Plan",
    price: 99.99,
    features: ["Access to 2 courses", "Basic video lectures", "Email support", "Monthly progress reports"],
    current: false,
  },
  {
    name: "Premium Student Plan",
    price: 149.99,
    features: [
      "Access to all courses",
      "HD video lectures",
      "Live Q&A sessions",
      "Priority support",
      "Weekly progress reports",
      "Discussion forum access",
      "Downloadable resources",
    ],
    current: true,
    popular: true,
  },
  {
    name: "Advanced Plan",
    price: 199.99,
    features: [
      "Everything in Premium",
      "1-on-1 tutoring sessions",
      "Custom study plans",
      "Advanced analytics",
      "Certificate programs",
    ],
    current: false,
  },
]

export default function StudentBillingPage() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "text-green-600 bg-green-100"
      case "pending":
        return "text-yellow-600 bg-yellow-100"
      case "failed":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "failed":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Billing & Payments</h1>
            <p className="text-gray-600 mt-1">Manage your subscription and payment history</p>
          </div>
        </div>
      </motion.div>

      {/* Current Plan Overview */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-[var(--color-gossamer-600)]" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Current Plan</p>
                <p className="text-xl font-bold">{billingInfo.currentPlan}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Monthly Fee</p>
                <p className="text-xl font-bold">${billingInfo.monthlyFee}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Next Billing</p>
                <p className="text-xl font-bold">{new Date(billingInfo.nextBilling).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Billing Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="history">Payment History</TabsTrigger>
            <TabsTrigger value="plans">Plans</TabsTrigger>
            <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Current Subscription */}
              <Card>
                <CardHeader>
                  <CardTitle>Current Subscription</CardTitle>
                  <CardDescription>Your active plan details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{billingInfo.currentPlan}</span>
                    <Badge className="bg-[var(--color-gossamer-100)] text-[var(--color-gossamer-800)]">Active</Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monthly Fee</span>
                      <span className="font-medium">${billingInfo.monthlyFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Next Billing Date</span>
                      <span className="font-medium">{new Date(billingInfo.nextBilling).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status</span>
                      <span className="font-medium capitalize">{billingInfo.status}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t space-y-2">
                    <Button variant="outline" className="w-full">
                      Change Plan
                    </Button>
                    <Button variant="outline" className="w-full text-red-600 hover:text-red-700">
                      Cancel Subscription
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                  <CardDescription>Your default payment method</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 border rounded-lg">
                    <CreditCard className="h-8 w-8 text-gray-400" />
                    <div>
                      <p className="font-medium">
                        {billingInfo.paymentMethod.brand} ending in {billingInfo.paymentMethod.last4}
                      </p>
                      <p className="text-sm text-gray-600">
                        Expires {billingInfo.paymentMethod.expiryMonth}/{billingInfo.paymentMethod.expiryYear}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button variant="outline" className="w-full">
                      Update Payment Method
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Payment Method
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Invoices */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Invoices</CardTitle>
                <CardDescription>Your latest payment history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {paymentHistory.slice(0, 3).map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Receipt className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium">{payment.description}</p>
                          <p className="text-sm text-gray-600">{new Date(payment.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className={getStatusColor(payment.status)}>
                          {getStatusIcon(payment.status)}
                          <span className="ml-1 capitalize">{payment.status}</span>
                        </Badge>
                        <span className="font-medium">${payment.amount}</span>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Invoices
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>Complete history of your payments and invoices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {paymentHistory.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <Receipt className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium">{payment.description}</p>
                          <p className="text-sm text-gray-600">Invoice #{payment.id}</p>
                          <p className="text-sm text-gray-600">{new Date(payment.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge className={getStatusColor(payment.status)}>
                          {getStatusIcon(payment.status)}
                          <span className="ml-1 capitalize">{payment.status}</span>
                        </Badge>
                        <span className="font-medium text-lg">${payment.amount}</span>
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="plans" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Plans</CardTitle>
                <CardDescription>Choose the plan that best fits your learning needs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {plans.map((plan) => (
                    <div
                      key={plan.name}
                      className={`relative p-6 border rounded-lg ${
                        plan.current ? "ring-2 ring-[var(--color-gossamer-500)] bg-[var(--color-gossamer-50)]" : ""
                      }`}
                    >
                      {plan.popular && (
                        <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-[var(--color-gossamer-600)]">
                          Most Popular
                        </Badge>
                      )}

                      <div className="text-center mb-4">
                        <h3 className="text-lg font-semibold">{plan.name}</h3>
                        <div className="mt-2">
                          <span className="text-3xl font-bold">${plan.price}</span>
                          <span className="text-gray-600">/month</span>
                        </div>
                      </div>

                      <ul className="space-y-2 mb-6">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <Button
                        className={`w-full ${
                          plan.current ? "bg-[var(--color-gossamer-600)] hover:bg-[var(--color-gossamer-700)]" : ""
                        }`}
                        variant={plan.current ? "default" : "outline"}
                        disabled={plan.current}
                      >
                        {plan.current ? "Current Plan" : "Upgrade"}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment-methods" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Manage your saved payment methods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Current Payment Method */}
                <div className="flex items-center justify-between p-4 border rounded-lg bg-[var(--color-gossamer-50)]">
                  <div className="flex items-center space-x-4">
                    <CreditCard className="h-8 w-8 text-[var(--color-gossamer-600)]" />
                    <div>
                      <p className="font-medium">
                        {billingInfo.paymentMethod.brand} ending in {billingInfo.paymentMethod.last4}
                      </p>
                      <p className="text-sm text-gray-600">
                        Expires {billingInfo.paymentMethod.expiryMonth}/{billingInfo.paymentMethod.expiryYear}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-[var(--color-gossamer-100)] text-[var(--color-gossamer-800)]">Default</Badge>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>

                {/* Add New Payment Method */}
                <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-center">
                    <Plus className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-gray-600 mb-4">Add a new payment method</p>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Payment Method
                    </Button>
                  </div>
                </div>

                {/* Billing Address */}
                <div className="pt-6 border-t">
                  <h3 className="font-semibold mb-4">Billing Address</h3>
                  <div className="p-4 border rounded-lg">
                    <p className="font-medium">Emma Johnson</p>
                    <p className="text-gray-600">456 Oak Street</p>
                    <p className="text-gray-600">Springfield, IL 62701</p>
                    <p className="text-gray-600">United States</p>
                    <Button variant="outline" size="sm" className="mt-3">
                      Edit Address
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}

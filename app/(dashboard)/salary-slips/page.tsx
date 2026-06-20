"use client"

import { useState } from "react"
import { getSalarySlips, getMonthName, formatCurrency, getCompany, getEmployees } from "@/lib/data"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Download, FileText, Eye, Send, X, CheckCircle2 } from "lucide-react"
import type { SalarySlip } from "@/lib/data"

export default function SalarySlipsPage() {
  const allSlips = getSalarySlips()
  const employees = getEmployees()
  const company = getCompany()
  const [searchQuery, setSearchQuery] = useState("")

  // Email sending state
  const [sendingSlip, setSendingSlip] = useState<SalarySlip | null>(null)
  const [emailInput, setEmailInput] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [sentSuccess, setSentSuccess] = useState(false)

  const filteredSlips = allSlips.filter(slip =>
    slip.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getMonthName(slip.month).toLowerCase().includes(searchQuery.toLowerCase()) ||
    slip.year.toString().includes(searchQuery)
  )

  const openSendModal = (slip: SalarySlip) => {
    const emp = employees.find(e => e.id === slip.employeeId)
    setEmailInput(emp?.email || "")
    setSendingSlip(slip)
    setSentSuccess(false)
  }

  const handleSendSlip = async () => {
    if (!sendingSlip || !emailInput) return
    setIsSending(true)
    try {
      const res = await fetch('/api/send-salary-slip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slip: sendingSlip,
          recipientEmail: emailInput,
          companyName: company.name
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSentSuccess(true)
    } catch (err: any) {
      alert("Failed to send: " + err.message)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-bold text-2xl mb-1">Salary Slips</h1>
          <p className="text-gray-500 text-sm">View, email, and download generated employee slips.</p>
        </div>
        <Button variant="secondary">
          <Download size={16} />
          Export All (ZIP)
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="p-4 flex items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <Input placeholder="Search by name or month..." className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Period</th>
                  <th>Gross Pay</th>
                  <th>Deductions</th>
                  <th>Net Pay</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSlips.length > 0 ? (
                  filteredSlips.map((slip) => (
                    <tr key={slip.id}>
                      <td>
                        <div className="font-medium text-gray-900 ">{slip.employeeName}</div>
                        <div className="text-xs text-gray-500">{slip.snapshot.designation}</div>
                      </td>
                      <td>
                        <div className="font-medium text-gray-900 ">{getMonthName(slip.month)} {slip.year}</div>
                      </td>
                      <td>
                        {formatCurrency(slip.grossPay)}
                      </td>
                      <td>
                        {formatCurrency(slip.totalDeductions + slip.taxDeduction)}
                      </td>
                      <td>
                        <span className="font-semibold text-green-700">{formatCurrency(slip.netPay)}</span>
                      </td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" className="h-8 w-8 p-0 text-gray-500">
                            <Eye size={16} />
                          </Button>
                          <Button variant="ghost" className="h-8 w-8 p-0 text-blue-600">
                            <Download size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            className="h-8 px-3 text-xs gap-1.5 text-primary hover:text-primary hover:bg-primary/10"
                            onClick={() => openSendModal(slip)}
                          >
                            <Send size={13} />
                            Email
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <FileText size={48} className="text-gray-300 mb-4" />
                        <p className="text-base font-medium text-gray-900 mb-1">No slips found</p>
                        <p className="text-sm">We couldn't find any salary slips matching your search.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Send Salary Slip Modal */}
      {sendingSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSendingSlip(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in">
            <button
              onClick={() => setSendingSlip(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <X size={20} />
            </button>

            {sentSuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} className="text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Salary Slip Sent!</h3>
                <p className="text-sm text-gray-500 mb-6">
                  <strong>{sendingSlip.employeeName}'s</strong> slip for <strong>{getMonthName(sendingSlip.month)} {sendingSlip.year}</strong> has been emailed to <strong>{emailInput}</strong>.
                </p>
                <Button onClick={() => setSendingSlip(null)} className="w-full">Done</Button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Send size={18} className="text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Email Salary Slip</h3>
                  </div>
                  <p className="text-sm text-gray-500 ml-12">
                    Send the salary slip directly to the employee.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex justify-between text-sm">
                    <span className="text-gray-500">Employee</span>
                    <span className="font-semibold text-gray-900">{sendingSlip.employeeName}</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex justify-between text-sm">
                    <span className="text-gray-500">Period</span>
                    <span className="font-semibold text-gray-900">{getMonthName(sendingSlip.month)} {sendingSlip.year}</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex justify-between text-sm">
                    <span className="text-gray-500">Net Pay</span>
                    <span className="font-semibold text-green-700">{formatCurrency(sendingSlip.netPay)}</span>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">Recipient Email</label>
                    <Input
                      type="email"
                      placeholder="employee@company.com"
                      value={emailInput}
                      onChange={e => setEmailInput(e.target.value)}
                      className="bg-gray-50 border-gray-200 focus:bg-white"
                    />
                  </div>
                  <Button
                    onClick={handleSendSlip}
                    disabled={isSending || !emailInput}
                    className="w-full h-11"
                  >
                    {isSending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin mr-2" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send size={15} className="mr-2" />
                        Send Salary Slip
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

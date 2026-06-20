"use client"

import { useState } from "react"
import { getEmployees, getDepartments } from "@/lib/data"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, MoreHorizontal, User, Filter, Building, Mail, Phone } from "lucide-react"
import Link from "next/link"
import { CustomSelect } from "@/components/ui/custom-select"

export default function EmployeesPage() {
 const allEmployees = getEmployees()
 const departments = getDepartments()
 const [searchQuery, setSearchQuery] = useState("")
 const [deptFilter, setDeptFilter] = useState<string>("ALL")
 const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

 const filteredEmployees = allEmployees.filter(emp => {
 const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
 const matchesDept = deptFilter === "ALL" || emp.department === deptFilter
 return matchesSearch && matchesDept
 })

 return (
 <div className="space-y-6 animate-fade-in">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
 <div>
 <h1 className="font-bold text-2xl mb-1">Employees</h1>
 <p className="text-gray-500 text-sm">Manage your team and their salary structures.</p>
 </div>
 <div className="flex gap-2">
 <Button variant="secondary" className="hidden sm:flex">
 Departments
 </Button>
 <Button className="w-full sm:w-auto">
 <Plus size={16} />
 Add Employee
 </Button>
 </div>
 </div>

 <Card>
 <CardContent className="p-0">
 <div className="p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
 <div className="relative w-full sm:w-72">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
 <Input placeholder="Search by name or ID..." className="pl-9"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 />
 </div>
 <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto pb-2 sm:pb-0">
              <CustomSelect 
                className="min-w-[160px]"
                value={deptFilter}
                onChange={setDeptFilter}
                options={[
                  { value: 'ALL', label: 'All Departments' },
                  ...departments.map(d => ({ value: d, label: d }))
                ]}
              />
 <div className="flex items-center rounded-md overflow-hidden shrink-0">
 <button className={`p-2 hover:bg-gray-100 transition-colors ${viewMode === 'grid' ? 'bg-gray-100 text-primary' : 'text-gray-500'}`}
 onClick={() => setViewMode('grid')}
 >
 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
 </button>
 <button className={`p-2 hover:bg-gray-100 transition-colors ${viewMode === 'list' ? 'bg-gray-100 text-primary' : 'text-gray-500'}`}
 onClick={() => setViewMode('list')}
 >
 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
 </button>
 </div>
 </div>
 </div>

 {viewMode === 'grid' ? (
 <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
 {filteredEmployees.map(emp => (
 <Card key={emp.id} className="overflow-hidden hover:border-primary/50 transition-colors cursor-pointer group">
 <div className="h-16 bg-[#8A4FFF] "></div>
 <CardContent className="p-5 pt-0 relative">
 <div className="absolute top-4 right-4">
 <Badge variant={emp.status === 'Active' ? 'paid' : emp.status === 'On Leave' ? 'sent' : 'default'} className="px-2 py-0.5 text-[10px]">
 {emp.status}
 </Badge>
 </div>
 <div className="mt-8 space-y-1">
 <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors text-[#1C1C2E]">{emp.name}</h3>
 <p className="text-sm text-gray-500">{emp.designation}</p>
 </div>
 <div className="mt-4 pt-4 space-y-2">
 <div className="flex items-center gap-2 text-xs text-gray-500">
 <Building size={14} />
 {emp.department}
 </div>
 <div className="flex items-center gap-2 text-xs text-gray-500">
 <Mail size={14} />
 <span className="truncate">{emp.email}</span>
 </div>
 </div>
 </CardContent>
 </Card>
 ))}
 </div>
 ) : (
 <div className="overflow-x-auto">
 <table className="data-table">
 <thead>
 <tr>
 <th>Employee</th>
 <th>ID / Department</th>
 <th>Contact</th>
 <th>Join Date</th>
 <th>Status</th>
 <th className="text-right">Actions</th>
 </tr>
 </thead>
 <tbody>
 {filteredEmployees.length > 0 ? (
 filteredEmployees.map((emp) => (
 <tr key={emp.id}>
 <td>
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-light to-primary flex items-center justify-center text-white text-xs font-medium">
 {emp.name.split(' ').map(n => n[0]).join('')}
 </div>
 <div>
 <div className="font-medium text-gray-900 ">{emp.name}</div>
 <div className="text-xs text-gray-500">{emp.designation}</div>
 </div>
 </div>
 </td>
 <td>
 <div className="text-gray-900 ">{emp.employeeId}</div>
 <div className="text-xs text-gray-500">{emp.department}</div>
 </td>
 <td>
 <div className="text-gray-900 ">{emp.email}</div>
 <div className="text-xs text-gray-500">{emp.phone}</div>
 </td>
 <td>
 {emp.joinDate}
 </td>
 <td>
 <Badge variant={emp.status === 'Active' ? 'paid' : emp.status === 'On Leave' ? 'sent' : 'default'} className="px-2 py-0.5 text-xs">
 {emp.status}
 </Badge>
 </td>
 <td className="text-right">
 <Button variant="ghost" className="h-8 w-8 p-0">
 <MoreHorizontal size={16} />
 </Button>
 </td>
 </tr>
 ))
 ) : (
 <tr>
 <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
 <div className="flex flex-col items-center justify-center">
 <User size={48} className="text-gray-300 mb-4" />
 <p className="text-base font-medium text-gray-900 mb-1">No employees found</p>
 <p className="text-sm">We couldn't find any employees matching your search.</p>
 </div>
 </td>
 </tr>
 )}
 </tbody>
 </table>
 </div>
 )}
 </CardContent>
 </Card>
 </div>
 )
}

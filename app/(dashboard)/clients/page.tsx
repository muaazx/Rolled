"use client"

import { useState } from "react"
import { getClients, formatCurrency, formatDate } from "@/lib/data"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, MoreHorizontal, Building2, Mail, Phone, MapPin } from "lucide-react"

export default function ClientsPage() {
 const allClients = getClients()
 const [searchQuery, setSearchQuery] = useState("")

 const filteredClients = allClients.filter(cli => cli.name.toLowerCase().includes(searchQuery.toLowerCase()) || cli.email.toLowerCase().includes(searchQuery.toLowerCase())
 )

 return (
 <div className="space-y-6 animate-fade-in">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
 <div>
 <h1 className="font-bold text-2xl mb-1">Clients</h1>
 <p className="text-gray-500 text-sm">Manage your client directory and billing history.</p>
 </div>
 <Button>
 <Plus size={16} />
 Add Client
 </Button>
 </div>

 <Card>
 <CardContent className="p-0">
 <div className="p-4 flex items-center justify-between">
 <div className="relative w-full sm:w-72">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
 <Input placeholder="Search clients..." className="pl-9"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 />
 </div>
 </div>

 <div className="overflow-x-auto">
 <table className="data-table">
 <thead>
 <tr>
 <th>Client</th>
 <th>Contact</th>
 <th>Added</th>
 <th className="text-right">Invoices</th>
 <th className="text-right">Total Billed</th>
 <th className="text-right">Actions</th>
 </tr>
 </thead>
 <tbody>
 {filteredClients.length > 0 ? (
 filteredClients.map((client) => (
 <tr key={client.id}>
 <td>
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xs font-medium">
 {client.name.split(' ').map(n => n[0]).join('')}
 </div>
 <div>
 <div className="font-medium text-gray-900 ">{client.name}</div>
 <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
 <MapPin size={10} /> {client.address.split(',')[0]}
 </div>
 </div>
 </div>
 </td>
 <td>
 <div className="text-gray-900 text-sm flex items-center gap-1.5 mb-0.5">
 <Mail size={12} className="text-gray-400" /> {client.email}
 </div>
 <div className="text-xs text-gray-500 flex items-center gap-1.5">
 <Phone size={12} className="text-gray-400" /> {client.phone}
 </div>
 </td>
 <td>
 {formatDate(client.createdAt)}
 </td>
 <td className="text-right">
 <div className="inline-flex items-center justify-center min-w-6 px-2 h-6 rounded-full bg-gray-100 text-xs font-medium">
 {client.invoiceCount}
 </div>
 </td>
 <td className="text-right">
 {formatCurrency(client.totalBilled)}
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
 <Building2 size={48} className="text-gray-300 mb-4" />
 <p className="text-base font-medium text-gray-900 mb-1">No clients found</p>
 <p className="text-sm">We couldn't find any clients matching your search.</p>
 </div>
 </td>
 </tr>
 )}
 </tbody>
 </table>
 </div>
 </CardContent>
 </Card>
 </div>
 )
}

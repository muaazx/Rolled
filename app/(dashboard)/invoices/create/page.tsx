"use client"

import { useState, useEffect } from "react"
import { getClients, getCompany, formatCurrency, getTemplates } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Plus, Trash2, Send, Save, Eye, X, CheckCircle2, FileText, Building2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { v4 as uuidv4 } from "uuid"

export default function CreateInvoicePage() {
 const router = useRouter()
 const clients = getClients()
 const templates = getTemplates()
 const company = getCompany()

 const [selectedClient, setSelectedClient] = useState(clients[0].id)
 const [selectedTemplate, setSelectedTemplate] = useState(templates.find(t => t.isDefault)?.id || templates[0].id)
 const [items, setItems] = useState([
  { id: uuidv4(), description: "", quantity: 1, rate: 0 }
 ])
 const [taxRate, setTaxRate] = useState(5)
 const [notes, setNotes] = useState("")
 // Start empty so server + client render identical HTML (no hydration mismatch).
 // useEffect only runs client-side, so the real values are set after hydration.
 const [invoiceNum, setInvoiceNum] = useState("")
 const [dueDate, setDueDate] = useState("")
 useEffect(() => {
  setInvoiceNum(Math.floor(Math.random() * 900 + 100).toString().padStart(3, '0'))
  setDueDate(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
 }, [])

 // UI state
 const [showPreview, setShowPreview] = useState(false)
 const [draftSaved, setDraftSaved] = useState(false)

 const handleAddItem = () => {
  setItems([...items, { id: uuidv4(), description: "", quantity: 1, rate: 0 }])
 }
 const handleRemoveItem = (id: string) => {
  if (items.length > 1) setItems(items.filter(item => item.id !== id))
 }
 const updateItem = (id: string, field: string, value: string | number) => {
  setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item))
 }

 const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0)
 const taxAmount = (subtotal * taxRate) / 100
 const total = subtotal + taxAmount

 const client = clients.find(c => c.id === selectedClient) || clients[0]
 const template = templates.find(t => t.id === selectedTemplate) || templates[0]

 // ── Draft ──────────────────────────────────────────────────────────────
 const handleSaveDraft = () => {
  const draft = {
   id: uuidv4(),
   number: `INV-2025-${invoiceNum}`,
   clientId: selectedClient,
   clientName: client.name,
   items,
   taxRate,
   subtotal,
   taxAmount,
   total,
   notes,
   dueDate,
   templateId: selectedTemplate,
   status: "DRAFT",
   createdAt: new Date().toISOString(),
  }
  try {
   const existing = JSON.parse(localStorage.getItem("rolled_draft_invoices") || "[]")
   existing.push(draft)
   localStorage.setItem("rolled_draft_invoices", JSON.stringify(existing))
  } catch {}
  setDraftSaved(true)
  setTimeout(() => {
   router.push("/invoices")
  }, 1500)
 }

 return (
  <>
  <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
  <div className="flex items-center gap-4">
  <Link href="/invoices">
  <Button variant="ghost" className="p-2 w-10 h-10 rounded-full bg-white ">
  <ArrowLeft size={18} />
  </Button>
  </Link>
  <div>
  <h1 className="font-bold text-2xl mb-1">Create Invoice</h1>
  <p className="text-gray-500 text-sm">Draft a new invoice and send to your client.</p>
  </div>
  </div>

  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <div className="lg:col-span-2 space-y-6">
  <Card>
  <CardHeader className=" bg-gray-50/50 pb-4">
  <CardTitle className="text-lg flex items-center justify-between">
  <span>Invoice Details</span>
  <span className="text-sm font-normal text-gray-500">INV-2025-{invoiceNum}</span>
  </CardTitle>
  </CardHeader>
  <CardContent className="p-6 space-y-6">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div className="space-y-2">
  <label className="text-sm font-medium text-gray-700 ">Client</label>
  <select className="flex h-10 w-full rounded-md bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ransparent "
  value={selectedClient}
  onChange={(e) => setSelectedClient(e.target.value)}
  >
  {clients.map(c => (
  <option key={c.id} value={c.id} className="">{c.name}</option>
  ))}
  </select>
  </div>
  <div className="space-y-2">
  <label className="text-sm font-medium text-gray-700 ">Due Date</label>
  <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
  </div>
  </div>

  <div>
  <div className="flex items-center justify-between mb-2 pb-2">
  <label className="text-sm font-medium text-gray-700 ">Line Items</label>
  </div>
  <div className="space-y-3 mt-4">
  {items.map((item) => (
  <div key={item.id} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
  <div className="flex-1 w-full">
  <Input placeholder="Item description" value={item.description}
  onChange={(e) => updateItem(item.id, 'description', e.target.value)}
  />
  </div>
  <div className="w-full sm:w-24">
  <Input type="number" min="1"
  placeholder="Qty" value={item.quantity || ''}
  onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
  />
  </div>
  <div className="w-full sm:w-32">
  <Input type="number" placeholder="Rate" value={item.rate || ''}
  onChange={(e) => updateItem(item.id, 'rate', parseInt(e.target.value) || 0)}
  />
  </div>
  <div className="w-full sm:w-32 text-right font-medium pt-2 sm:pt-0">
  {formatCurrency(item.quantity * item.rate)}
  </div>
  <Button variant="ghost" className="text-gray-400 hover:text-red-500 self-end sm:self-auto h-10 w-10 p-0"
  onClick={() => handleRemoveItem(item.id)}
  disabled={items.length === 1}
  >
  <Trash2 size={16} />
  </Button>
  </div>
  ))}
  </div>
  <Button variant="ghost" className="mt-4 text-primary hover:text-primary-dark hover:bg-primary/5"
  onClick={handleAddItem}
  >
  <Plus size={16} className="mr-1" /> Add Item
  </Button>
  </div>

  <div className=" pt-6">
  <div className="space-y-2">
  <label className="text-sm font-medium text-gray-700 ">Notes / Terms</label>
  <textarea className="flex w-full rounded-md bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ransparent min-h-[100px] resize-none"
  placeholder="Thank you for your business!"
  value={notes}
  onChange={(e) => setNotes(e.target.value)}
  />
  </div>
  </div>
  </CardContent>
  </Card>
  </div>

  <div className="space-y-6">
  <Card>
  <CardHeader className=" bg-gray-50/50 pb-4">
  <CardTitle className="text-lg">Summary</CardTitle>
  </CardHeader>
  <CardContent className="p-6 space-y-4">
  <div className="flex justify-between text-sm">
  <span className="text-gray-500">Subtotal</span>
  <span className="font-medium">{formatCurrency(subtotal)}</span>
  </div>
  <div className="flex justify-between text-sm items-center">
  <span className="text-gray-500">Tax (%)</span>
  <div className="w-20">
  <Input type="number" className="h-8 text-right" value={taxRate}
  onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
  />
  </div>
  </div>
  <div className="flex justify-between text-sm">
  <span className="text-gray-500">Tax Amount</span>
  <span className="font-medium">{formatCurrency(taxAmount)}</span>
  </div>
  <div className=" pt-4 mt-2 flex justify-between">
  <span className="font-bold">Total</span>
  <span className="font-bold text-lg text-primary">{formatCurrency(total)}</span>
  </div>
  </CardContent>
  </Card>

  <Card>
  <CardHeader className=" bg-gray-50/50 pb-4">
  <CardTitle className="text-lg">Settings & Actions</CardTitle>
  </CardHeader>
  <CardContent className="p-6 space-y-6">
  <div className="space-y-2">
  <label className="text-sm font-medium text-gray-700 ">Template</label>
  <div className="grid grid-cols-2 gap-2">
  {templates.map(tpl => (
  <div key={tpl.id}
  onClick={() => setSelectedTemplate(tpl.id)}
  className={`border rounded-lg p-3 text-sm cursor-pointer transition-colors ${selectedTemplate === tpl.id ? 'border-primary bg-primary/5 text-primary font-medium' : ' hover: '}`}
  >
  <div className="flex items-center gap-2 mb-1">
  <div className="w-3 h-3 rounded-full" style={{backgroundColor: tpl.primaryColor}}></div>
  {tpl.name}
  </div>
  <div className="text-xs text-gray-500 font-normal">{tpl.font}</div>
  </div>
  ))}
  </div>
  </div>

  <div className="space-y-3 pt-4">
  <Button className="w-full">
  <Send size={16} />
  Send via Email
  </Button>
  <div className="grid grid-cols-2 gap-3">
  <Button
   variant="secondary"
   onClick={handleSaveDraft}
   disabled={draftSaved}
   className="gap-1.5"
  >
   {draftSaved ? (
    <><CheckCircle2 size={15} className="text-green-600" /> Saved!</>
   ) : (
    <><Save size={15} /> Draft</>
   )}
  </Button>
  <Button
   variant="secondary"
   onClick={() => setShowPreview(true)}
   className="gap-1.5"
  >
   <Eye size={15} /> Preview
  </Button>
  </div>
  </div>
  </CardContent>
  </Card>
  </div>
  </div>
  </div>

  {/* ── Draft saved toast ──────────────────────────────────────── */}
  {draftSaved && (
   <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
    <div className="flex items-center gap-3 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-medium">
     <CheckCircle2 size={18} className="text-green-400 shrink-0" />
     Draft saved! Redirecting to invoices…
    </div>
   </div>
  )}

  {/* ── Preview Modal ──────────────────────────────────────────── */}
  {showPreview && (
   <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowPreview(false)} />
    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-4 overflow-hidden animate-fade-in">
     {/* Modal header */}
     <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
       <Eye size={16} className="text-primary" />
       Invoice Preview
      </div>
      <button onClick={() => setShowPreview(false)} className="text-gray-400 hover:text-gray-700 transition-colors p-1 rounded-lg hover:bg-gray-100">
       <X size={18} />
      </button>
     </div>

     {/* Invoice document */}
     <div className="p-8 bg-white">
      {/* Branded header */}
      <div
       className="rounded-xl p-6 mb-8 flex items-start justify-between"
       style={{ backgroundColor: template.primaryColor + '15', borderLeft: `4px solid ${template.primaryColor}` }}
      >
       <div>
        <div className="flex items-center gap-2 mb-2">
         <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: template.primaryColor }}>
          <FileText size={14} className="text-white" />
         </div>
         <span className="font-extrabold text-xl tracking-tight" style={{ color: template.primaryColor }}>
          {company.name}
         </span>
        </div>
        <p className="text-xs text-gray-500">{company.address}</p>
       </div>
       <div className="text-right">
        <p className="text-2xl font-black tracking-tight text-gray-900">INVOICE</p>
        <p className="text-sm font-semibold mt-1" style={{ color: template.primaryColor }}>INV-2025-{invoiceNum}</p>
       </div>
      </div>

      {/* From / To / Due */}
      <div className="grid grid-cols-3 gap-6 mb-8">
       <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">From</p>
        <p className="text-sm font-semibold text-gray-900">{company.name}</p>
        <p className="text-xs text-gray-500 mt-0.5">{company.email}</p>
       </div>
       <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Bill To</p>
        <p className="text-sm font-semibold text-gray-900">{client.name}</p>
        <p className="text-xs text-gray-500 mt-0.5">{client.email}</p>
       </div>
       <div className="text-right">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Due Date</p>
        <p className="text-sm font-semibold text-gray-900">{new Date(dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
        <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium text-amber-700 bg-amber-100">Due</span>
       </div>
      </div>

      {/* Line items table */}
      <div className="rounded-xl overflow-hidden border border-gray-100 mb-6">
       <table className="w-full text-sm">
        <thead>
         <tr style={{ backgroundColor: template.primaryColor }}>
          <th className="text-left px-4 py-3 text-white font-semibold text-xs uppercase tracking-wider">Description</th>
          <th className="text-center px-4 py-3 text-white font-semibold text-xs uppercase tracking-wider w-16">Qty</th>
          <th className="text-right px-4 py-3 text-white font-semibold text-xs uppercase tracking-wider w-28">Rate</th>
          <th className="text-right px-4 py-3 text-white font-semibold text-xs uppercase tracking-wider w-28">Amount</th>
         </tr>
        </thead>
        <tbody>
         {items.map((item, i) => (
          <tr key={item.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}>
           <td className="px-4 py-3 text-gray-800">{item.description || <span className="text-gray-300 italic">No description</span>}</td>
           <td className="px-4 py-3 text-center text-gray-600">{item.quantity}</td>
           <td className="px-4 py-3 text-right text-gray-600">{formatCurrency(item.rate)}</td>
           <td className="px-4 py-3 text-right font-semibold text-gray-900">{formatCurrency(item.quantity * item.rate)}</td>
          </tr>
         ))}
        </tbody>
       </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-6">
       <div className="w-64 space-y-2">
        <div className="flex justify-between text-sm text-gray-500">
         <span>Subtotal</span><span className="font-medium text-gray-800">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500">
         <span>Tax ({taxRate}%)</span><span className="font-medium text-gray-800">{formatCurrency(taxAmount)}</span>
        </div>
        <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200" style={{ color: template.primaryColor }}>
         <span>Total</span><span>{formatCurrency(total)}</span>
        </div>
       </div>
      </div>

      {/* Notes */}
      {notes && (
       <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Notes</p>
        <p className="text-sm text-gray-600">{notes}</p>
       </div>
      )}
     </div>

     {/* Modal footer */}
     <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
      <Button variant="secondary" onClick={() => setShowPreview(false)}>Close</Button>
      <Button onClick={handleSaveDraft} disabled={draftSaved} className="gap-1.5">
       <Save size={15} />{draftSaved ? "Saved!" : "Save Draft"}
      </Button>
     </div>
    </div>
   </div>
  )}
  </>
 )
}

export default function DesignerPage() {
  return (
    <div className="space-y-6 animate-fade-in flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
      </div>
      <h1 className="font-bold text-2xl mb-2 text-white">Invoice Designer</h1>
      <p className="text-gray-400 text-center max-w-md">
        This module is currently under construction. Soon you'll be able to create custom templates and brand your invoices.
      </p>
      
      <div className="mt-8 px-6 py-3 rounded-full border border-white/10 bg-white/5 text-sm text-gray-300 backdrop-blur-sm">
        Coming in Phase 4
      </div>
    </div>
  )
}

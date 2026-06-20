export default function ReportsPage() {
  return (
    <div className="space-y-6 animate-fade-in flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
      </div>
      <h1 className="font-bold text-2xl mb-2 text-white">Reports & Analytics</h1>
      <p className="text-gray-400 text-center max-w-md">
        This module is currently under construction. Advanced financial reporting and tax calculations are coming soon.
      </p>
      
      <div className="mt-8 px-6 py-3 rounded-full border border-white/10 bg-white/5 text-sm text-gray-300 backdrop-blur-sm">
        Coming in Phase 4
      </div>
    </div>
  )
}

export default function IndexPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold">CRM Service Active</h1>
        <p className="mt-2 text-slate-400">If you see this, routing is working.</p>
        <div className="mt-6 flex justify-center gap-4">
          <a href="/login" className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition-all">Go to Login</a>
        </div>
      </div>
    </div>
  )
}

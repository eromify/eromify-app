import Sidebar from './Sidebar'

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-56">
        <main className="flex-1 overflow-y-auto bg-black">
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout

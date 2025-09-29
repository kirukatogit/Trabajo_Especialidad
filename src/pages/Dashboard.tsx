import { SidebarProvider } from "@/components/ui/sidebar"
import DashboardSidebar from "@/components/DashboardSidebar"
import BranchCard from "@/components/BranchCard"
import UserInfo from "@/components/UserInfo"
import TeamOverview from "@/components/TeamOverview"
import { Building2, Users, BarChart3, Package } from "lucide-react"

const Dashboard = () => {
  // Mock data - esto se reemplazaría con datos reales de la API
  const branches = [
    {
      id: 1,
      name: "Sucursal Centro",
      address: "Av. Principal 123",
      status: "active" as const,
      inventory: 450,
      employees: 8,
      revenue: "₡2,450,000"
    },
    {
      id: 2,
      name: "Sucursal Norte",
      address: "Calle 5 Norte 456",
      status: "active" as const, 
      inventory: 320,
      employees: 5,
      revenue: "₡1,890,000"
    },
    {
      id: 3,
      name: "Sucursal Este",
      address: "Plaza Este Local 12",
      status: "maintenance" as const,
      inventory: 180,
      employees: 3,
      revenue: "₡980,000"
    }
  ]

  const stats = [
    { title: "Sucursales Activas", value: "3", icon: Building2, change: "+1" },
    { title: "Empleados Totales", value: "16", icon: Users, change: "+2" },
    { title: "Productos en Stock", value: "950", icon: Package, change: "+45" },
    { title: "Ingresos del Mes", value: "₡5.32M", icon: BarChart3, change: "+12%" }
  ]

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-beeswax to-background">
        <DashboardSidebar />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                  <span className="text-2xl">🐝</span>
                  Panel de Control - BizHive
                </h1>
                <p className="text-muted-foreground mt-1">Gestiona tu colmena de negocios</p>
              </div>
              <UserInfo />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="bg-card border border-border rounded-lg p-6 hover:shadow-hive transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                        <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full">
                          {stat.change}
                        </span>
                      </div>
                    </div>
                    <div className="h-12 w-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <stat.icon className="h-6 w-6 text-secondary" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Branches Section */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Mis Sucursales
                </h2>
                <button className="bg-gradient-primary text-secondary px-4 py-2 rounded-lg hover:shadow-hive transition-all duration-300 hover:scale-105">
                  + Nueva Sucursal
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {branches.map((branch) => (
                  <BranchCard key={branch.id} branch={branch} />
                ))}
              </div>
            </div>

            {/* Team Overview */}
            <TeamOverview />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

export default Dashboard
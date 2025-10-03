// @ts-nocheck
import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Plus, Package, DollarSign, Hash, AlertTriangle } from 'lucide-react'
import { z } from 'zod'

const inventorySchema = z.object({
  product_name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  sku: z.string().max(50).optional(),
  category: z.string().max(50).optional(),
  quantity: z.number().int().min(0, 'La cantidad debe ser 0 o mayor'),
  unit_price: z.number().positive('El precio debe ser positivo').optional(),
  min_stock: z.number().int().min(0, 'El stock mínimo debe ser 0 o mayor').optional(),
})

interface InventoryItem {
  id: string
  product_name: string
  sku: string | null
  category: string | null
  quantity: number
  unit_price: number | null
  min_stock: number
}

interface InventoryListProps {
  branchId: string
}

const InventoryList = ({ branchId }: InventoryListProps) => {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    product_name: '',
    sku: '',
    category: '',
    quantity: '0',
    unit_price: '',
    min_stock: '0',
  })

  useEffect(() => {
    fetchInventory()
  }, [branchId])

  const fetchInventory = async () => {
    try {
      // @ts-expect-error - Supabase types need to be regenerated
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .eq('branch_id', branchId)
        .order('product_name')

      if (error) throw error
      setInventory(data || [])
    } catch (error) {
      console.error('Error fetching inventory:', error)
      toast({
        title: 'Error',
        description: 'No se pudo cargar el inventario',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      product_name: formData.product_name,
      sku: formData.sku || null,
      category: formData.category || null,
      quantity: parseInt(formData.quantity),
      unit_price: formData.unit_price ? parseFloat(formData.unit_price) : null,
      min_stock: parseInt(formData.min_stock) || 0,
    }

    try {
      inventorySchema.parse(payload)
    } catch (error: any) {
      if (error?.errors) {
        toast({
          title: 'Error de validación',
          description: error.errors[0]?.message || 'Error de validación',
          variant: 'destructive',
        })
        return
      }
    }

    setSaving(true)
    try {
      // @ts-ignore - Supabase types need to be regenerated
      const { error } = await supabase
        .from('inventory')
        .insert({
          ...payload,
          branch_id: branchId,
        })

      if (error) throw error

      toast({
        title: 'Producto agregado',
        description: 'El producto ha sido agregado al inventario',
      })
      
      setOpen(false)
      setFormData({
        product_name: '',
        sku: '',
        category: '',
        quantity: '0',
        unit_price: '',
        min_stock: '0',
      })
      fetchInventory()
    } catch (error) {
      console.error('Error adding inventory:', error)
      toast({
        title: 'Error',
        description: 'No se pudo agregar el producto',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const totalValue = inventory.reduce((sum, item) => 
    sum + (item.unit_price || 0) * item.quantity, 0
  )

  const lowStockItems = inventory.filter(item => item.quantity <= item.min_stock)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Inventario ({inventory.length} productos)</h2>
          <p className="text-muted-foreground">Valor total: ₡{totalValue.toLocaleString()}</p>
          {lowStockItems.length > 0 && (
            <p className="text-orange-600 flex items-center gap-1 text-sm mt-1">
              <AlertTriangle className="h-4 w-4" />
              {lowStockItems.length} productos con stock bajo
            </p>
          )}
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary text-secondary hover:shadow-hive">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Producto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Producto</DialogTitle>
              <DialogDescription>
                Completa la información del producto a agregar al inventario
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product_name">Nombre del Producto *</Label>
                  <div className="relative">
                    <Package className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="product_name"
                      value={formData.product_name}
                      onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="sku"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoría</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Cantidad *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="0"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit_price">Precio Unitario (₡)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="unit_price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.unit_price}
                      onChange={(e) => setFormData({ ...formData, unit_price: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="min_stock">Stock Mínimo</Label>
                  <Input
                    id="min_stock"
                    type="number"
                    min="0"
                    value={formData.min_stock}
                    onChange={(e) => setFormData({ ...formData, min_stock: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="bg-gradient-primary text-secondary"
                  disabled={saving}
                >
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Guardar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {inventory.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No hay productos en el inventario de esta sucursal</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {inventory.map((item) => (
            <Card key={item.id} className="p-6 hover:shadow-hive transition-shadow">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold">{item.product_name}</h3>
                    {item.quantity <= item.min_stock && (
                      <span className="px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-700 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Stock Bajo
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {item.sku && <span>SKU: {item.sku}</span>}
                    {item.category && <span>Categoría: {item.category}</span>}
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="text-2xl font-bold text-foreground">{item.quantity}</div>
                  <div className="text-sm text-muted-foreground">unidades</div>
                  {item.unit_price && (
                    <div className="text-sm text-muted-foreground">
                      ₡{item.unit_price.toLocaleString()} c/u
                    </div>
                  )}
                  {item.unit_price && (
                    <div className="text-sm font-semibold text-primary">
                      Total: ₡{(item.unit_price * item.quantity).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default InventoryList

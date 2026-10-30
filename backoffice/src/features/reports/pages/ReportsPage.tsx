import { useState } from 'react';
import { BarChart2, TrendingUp, Package, Truck, Users } from 'lucide-react';
import { SalesTab } from '../components/SalesTab';
import { InventoryTab } from '../components/InventoryTab';
import { PurchasesTab } from '../components/PurchasesTab';
import { ClientsTab } from '../components/ClientsTab';
import { ProductsTab } from '../components/ProductsTab';

type ActiveTab = 'sales' | 'inventory' | 'purchases' | 'clients' | 'products';

const TABS = [
  { id: 'sales', icon: <TrendingUp size={15} />, label: 'Ventas' },
  { id: 'inventory', icon: <Package size={15} />, label: 'Inventario' },
  { id: 'purchases', icon: <Truck size={15} />, label: 'Compras' },
  { id: 'clients', icon: <Users size={15} />, label: 'Clientes' },
  { id: 'products', icon: <Package size={15} />, label: 'Productos' },
] as const;

export function ReportsPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('sales');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-[#ddfbf2] text-[#006b58] flex items-center justify-center shrink-0 ring-1 ring-inset ring-[#006b58]/10">
          <BarChart2 size={20} strokeWidth={1.75} />
        </div>
        <div>
          <h1 className="text-[24px] font-bold tracking-[-0.02em] leading-tight text-on-surface">
            Reportes
          </h1>
          <p className="text-body-md text-on-surface-variant mt-0.5">
            Análisis de ventas, inventario, compras y clientes
          </p>
        </div>
      </div>

      <div className="flex gap-1 bg-surface-container p-1 rounded-xl w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 h-9 px-4 rounded-lg text-[13px] font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-on-surface shadow-soft'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'sales' && <SalesTab />}
      {activeTab === 'inventory' && <InventoryTab />}
      {activeTab === 'purchases' && <PurchasesTab />}
      {activeTab === 'clients' && <ClientsTab />}
      {activeTab === 'products' && <ProductsTab />}
    </div>
  );
}

import { DollarSign, ShoppingBag, Package, Users } from 'lucide-react';

export default function AdminDashboard() {
    const stats = [
        { label: 'Total Revenue', value: '$45,231.89', icon: DollarSign, change: '+20.1% from last month' },
        { label: 'Orders', value: '+2350', icon: ShoppingBag, change: '+180.1% from last month' },
        { label: 'Products', value: '12', icon: Package, change: '+2 new this week' },
        { label: 'Active Customers', value: '+573', icon: Users, change: '+201 since last hour' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-serif font-bold">Dashboard</h1>
                <p className="text-muted">Overview of your store's performance.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className="p-6 bg-background border border-border rounded-lg shadow-sm">
                            <div className="flex items-center justify-between space-y-0 pb-2">
                                <p className="text-sm font-medium text-muted">{stat.label}</p>
                                <Icon className="h-4 w-4 text-muted" />
                            </div>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted mt-1">{stat.change}</p>
                        </div>
                    );
                })}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 bg-background border border-border rounded-lg shadow-sm p-6">
                    <h3 className="font-semibold mb-4">Recent Revenue</h3>
                    <div className="h-[200px] flex items-center justify-center text-muted bg-secondary/20 rounded">
                        Chart Placeholder
                    </div>
                </div>
                <div className="col-span-3 bg-background border border-border rounded-lg shadow-sm p-6">
                    <h3 className="font-semibold mb-4">Recent Sales</h3>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center">
                                <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-xs font-medium">
                                    OM
                                </div>
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">Olivia Martin</p>
                                    <p className="text-xs text-muted">olivia.martin@email.com</p>
                                </div>
                                <div className="ml-auto font-medium">+$1,999.00</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

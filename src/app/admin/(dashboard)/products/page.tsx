import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Plus, MoreHorizontal, Pencil, Trash } from 'lucide-react';

export default function AdminProductsPage() {
    // Mock data
    const products = [
        { id: '1', name: 'Radiance Renewal Cream', price: 89.00, stock: 45, category: 'Skincare', image: '/images/cream.png' },
        { id: '2', name: 'Velvet Matte Lipstick', price: 34.00, stock: 120, category: 'Makeup', image: '/images/lipstick.png' },
        { id: '3', name: 'Golden Glow Serum', price: 112.00, stock: 20, category: 'Skincare', image: '/images/serum.png' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-bold">Products</h1>
                    <p className="text-muted">Manage your product catalog.</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Product
                </Button>
            </div>

            <div className="bg-background border border-border rounded-lg shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-secondary text-muted uppercase text-xs">
                        <tr>
                            <th className="px-6 py-3">Image</th>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Category</th>
                            <th className="px-6 py-3">Price</th>
                            <th className="px-6 py-3">Stock</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-secondary/20">
                                <td className="px-6 py-4">
                                    <div className="relative h-10 w-10 overflow-hidden rounded bg-secondary">
                                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-medium">{product.name}</td>
                                <td className="px-6 py-4">{product.category}</td>
                                <td className="px-6 py-4">${product.price.toFixed(2)}</td>
                                <td className="px-6 py-4">{product.stock}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button className="p-2 hover:bg-secondary rounded text-muted hover:text-foreground">
                                            <Pencil className="h-4 w-4" />
                                        </button>
                                        <button className="p-2 hover:bg-red-50 rounded text-muted hover:text-red-500">
                                            <Trash className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

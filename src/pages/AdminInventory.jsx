import React, { useState, useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import { supabase } from '../lib/supabase';
import { Trash, Edit, Plus, Save } from 'lucide-react';

const AdminInventory = () => {
    const { products, loading, error, addProduct, updateProduct, deleteProduct } = useProducts();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [formData, setFormData] = useState(initialFormState());
    const [formError, setFormError] = useState('');

    // Helper: Get unique categories
    const categoryList = Array.from(new Set(products.map(p => p.category))).sort();

    const handleCategorySelect = (e) => {
        const val = e.target.value;
        if (val) {
            setFormData(prev => ({ ...prev, category: val }));
        }
    };

    // Initial state helper
    function initialFormState() {
        return {
            product_code: '',
            shop_code: '',
            product_name: '',
            regional_name: '',
            cost_price: 0,
            sales_price: 0,
            tax_percentage: 0,
            category: 'Beverages',
            image_url: ''
        };
    }

    // Populate form when selecting a product
    useEffect(() => {
        if (selectedProduct) {
            setFormData(selectedProduct);
        } else {
            setFormData(initialFormState());
        }
        setFormError('');
    }, [selectedProduct]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        try {
            if (selectedProduct) {
                await updateProduct(selectedProduct.id, formData);
            } else {
                await addProduct(formData);
            }
            setSelectedProduct(null); // Reset after save
            setFormData(initialFormState());
        } catch (err) {
            console.error(err);
            setFormError(err.message || 'Failed to save product');
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(id);
                if (selectedProduct?.id === id) {
                    setSelectedProduct(null);
                }
            } catch (err) {
                alert('Failed to delete: ' + err.message);
            }
        }
    };

    if (loading) return <div className="text-center p-4">Loading Inventory...</div>;

    return (
        <div className="admin-layout">
            {/* LEFT PANE: Product List (30%) */}
            <div className="admin-list-pane">
                <div className="p-4" style={{ borderBottom: '1px solid hsl(var(--border-color))' }}>
                    <h2 className="text-xl font-bold mb-4">Inventory</h2>
                    <button
                        onClick={() => setSelectedProduct(null)}
                        className="btn btn-primary w-full"
                        style={{ gap: '0.5rem' }}
                    >
                        <Plus size={18} /> Add New Product
                    </button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
                    {products.map(product => (
                        <div
                            key={product.id}
                            onClick={() => setSelectedProduct(product)}
                            className="card"
                            style={{
                                marginBottom: '0.5rem',
                                cursor: 'pointer',
                                backgroundColor: selectedProduct?.id === product.id ? 'hsl(var(--accent-primary))' : 'hsl(var(--bg-card))',
                                color: selectedProduct?.id === product.id ? 'white' : 'inherit',
                                border: 'none'
                            }}
                        >
                            <div className="font-bold">{product.product_name}</div>
                            <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                                {product.product_code} | {product.category}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT PANE: Form (70%) */}
            <div className="admin-form-pane">
                <h2 className="text-2xl font-bold mb-4">
                    {selectedProduct ? 'Edit Product' : 'New Product'}
                </h2>

                {formError && (
                    <div style={{ padding: '1rem', background: 'hsl(350, 50%, 20%)', border: '1px solid hsl(350, 80%, 40%)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                        {formError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="form-grid">
                    <div>
                        <label className="block mb-2 text-sm font-bold">Product Code</label>
                        <input
                            name="product_code"
                            value={formData.product_code}
                            onChange={handleChange}
                            className="input"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-bold">Shop Code</label>
                        <input
                            name="shop_code"
                            value={formData.shop_code}
                            onChange={handleChange}
                            className="input"
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block mb-2 text-sm font-bold">Product Name (English)</label>
                        <input
                            name="product_name"
                            value={formData.product_name}
                            onChange={handleChange}
                            className="input"
                            required
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block mb-2 text-sm font-bold">Regional Name</label>
                        <input
                            name="regional_name"
                            value={formData.regional_name}
                            onChange={handleChange}
                            className="input"
                        />
                    </div>

                    <div className="col-span-1">
                        <label className="block mb-2 text-sm font-bold">Category</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="input"
                                placeholder="Type new or select..."
                                style={{ flex: 1 }}
                            />
                            {categoryList.length > 0 && (
                                <select
                                    onChange={handleCategorySelect}
                                    className="input"
                                    style={{ width: '40%', cursor: 'pointer' }}
                                    value="" // Always reset to prompt
                                >
                                    <option value="" disabled>Select...</option>
                                    {categoryList.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-bold">Tax (%)</label>
                        <input
                            type="number"
                            name="tax_percentage"
                            value={formData.tax_percentage}
                            onChange={handleChange}
                            className="input"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-bold" style={{ color: 'hsl(var(--accent-warning))' }}>Cost Price (Admin Only) (₹)</label>
                        <input
                            type="number"
                            step="0.01"
                            name="cost_price"
                            value={formData.cost_price}
                            onChange={handleChange}
                            className="input"
                            style={{ borderColor: 'hsl(var(--accent-warning))' }}
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-bold" style={{ color: 'hsl(var(--accent-success))' }}>Sales Price (₹)</label>
                        <input
                            type="number"
                            step="0.01"
                            name="sales_price"
                            value={formData.sales_price}
                            onChange={handleChange}
                            className="input"
                            style={{ borderColor: 'hsl(var(--accent-success))', fontWeight: 'bold' }}
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block mb-2 text-sm font-bold">Product Image</label>
                        <div className="flex gap-4 items-start bg-bg-primary p-3 rounded border border-border-color">
                            <div style={{ flex: 1 }}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={async (e) => {
                                        const file = e.target.files[0];
                                        if (!file) return;

                                        try {
                                            setFormError(''); // clear errors
                                            const fileExt = file.name.split('.').pop();
                                            const fileName = `${Date.now()}.${fileExt}`;
                                            const filePath = `${fileName}`;

                                            // Upload
                                            const { error: uploadError } = await supabase.storage
                                                .from('product-images')
                                                .upload(filePath, file);

                                            if (uploadError) throw uploadError;

                                            // Get URL
                                            const { data: { publicUrl } } = supabase.storage
                                                .from('product-images')
                                                .getPublicUrl(filePath);

                                            setFormData(prev => ({ ...prev, image_url: publicUrl }));
                                        } catch (error) {
                                            console.error('Upload Error:', error);
                                            setFormError('Image upload failed: ' + error.message);
                                        }
                                    }}
                                    className="input"
                                    style={{ padding: '0.5rem' }}
                                />
                                <p className="text-muted text-xs mt-1">Supported: JPG, PNG, WEBP</p>
                            </div>

                            {formData.image_url && (
                                <div className="text-center">
                                    <img
                                        src={formData.image_url}
                                        alt="Preview"
                                        style={{ height: '80px', width: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #333' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                                        className="text-red-400 text-xs mt-1 hover:text-red-300 block w-full"
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col-span-2 flex gap-4" style={{ marginTop: '2rem' }}>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1, gap: '0.5rem' }}>
                            <Save size={20} /> Save Product
                        </button>
                        {selectedProduct && (
                            <button
                                type="button"
                                onClick={() => handleDelete(selectedProduct.id)}
                                className="btn btn-danger"
                                style={{ gap: '0.5rem' }}
                            >
                                <Trash size={20} /> Delete
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminInventory;

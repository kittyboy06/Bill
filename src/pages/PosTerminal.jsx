import React, { useState, useEffect, useMemo } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import { PrinterLogic } from '../utils/PrinterHelper';
import { ShoppingCart, Printer, Trash2, Settings } from 'lucide-react';

const PosTerminal = () => {
    const { products, loading } = useProducts();
    const { cartItems, addToCart, removeFromCart, incrementQuantity, decrementQuantity, totalItems, totalAmount, clearCart } = useCart();
    const [activeCategory, setActiveCategory] = useState('All');

    // Extract unique categories
    const categories = useMemo(() => {
        const cats = new Set(products.map(p => p.category));
        return ['All', ...Array.from(cats)];
    }, [products]);

    // Filter products
    const filteredProducts = useMemo(() => {
        if (activeCategory === 'All') return products;
        return products.filter(p => p.category === activeCategory);
    }, [products, activeCategory]);

    // Smart Category Images (First product image in category)
    const categoryImages = useMemo(() => {
        const map = {};
        products.forEach(p => {
            if (!map[p.category] && p.image_url) {
                map[p.category] = p.image_url;
            }
        });
        return map;
    }, [products]);

    const handlePrint = () => {
        if (cartItems.length === 0) return alert('Cart is empty!');

        // Generate Bytes
        const bytes = PrinterLogic.generateReceipt(cartItems, totalAmount);
        console.log('Printing Receipt Bytes:', bytes);
        alert(`Generating Print Job... (${bytes.length} bytes sent to console)`);

        // In a real app, send 'bytes' to bluetooth/network socket here
        // For now, clear cart after "print"
        if (confirm("Did the bill print successfully?")) {
            clearCart();
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen">Loading POS...</div>;

    return (
        <div className="pos-layout">

            {/* LEFT PANE: CATEGORIES */}
            <div className="pos-sidebar">
                <div className="p-4" style={{ borderBottom: '1px solid hsl(var(--border-color))' }}>
                    <h2 className="text-xl font-bold text-accent">Categories</h2>
                </div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {categories.map(cat => {
                        const bgImage = categoryImages[cat];
                        return (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
                                style={{
                                    position: 'relative',
                                    overflow: 'hidden',
                                    height: '80px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '0 1rem',
                                    textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                                }}
                            >
                                {/* Background Image Overlay */}
                                {bgImage && (
                                    <div style={{
                                        position: 'absolute', inset: 0,
                                        backgroundImage: `url(${bgImage})`,
                                        backgroundSize: 'cover', backgroundPosition: 'center',
                                        opacity: activeCategory === cat ? 0.4 : 0.2,
                                        zIndex: 0
                                    }} />
                                )}
                                <span style={{ position: 'relative', zIndex: 1, fontSize: '1.2rem', fontWeight: 'bold' }}>
                                    {cat}
                                </span>
                            </button>
                        );
                    })}
                </div>
                <div className="p-4" style={{ borderTop: '1px solid hsl(var(--border-color))' }}>
                    <button
                        onClick={() => window.location.href = '/admin'}
                        className="btn btn-secondary w-full"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                        <Settings size={20} /> Admin Panel
                    </button>
                </div>
            </div>

            {/* RIGHT PANE: PRODUCTS & CART */}
            <div className="pos-main">

                {/* TOP: PRODUCT GRID */}
                <div className="product-grid-container">
                    <div className="product-grid">
                        {filteredProducts.map(product => (
                            <div
                                key={product.id}
                                onClick={() => addToCart(product)}
                                className="product-card"
                                style={{ overflow: 'hidden', padding: 0 }}
                            >
                                {/* Product Image */}
                                <div style={{
                                    height: '110px',
                                    backgroundImage: `url(${product.image_url || 'https://via.placeholder.com/300x200?text=No+Image'})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    borderBottom: '1px solid hsl(var(--border-color))'
                                }} />

                                <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <div>
                                        <h3 className="font-bold text-lg mb-1 leading-tight">{product.product_name}</h3>
                                        {product.regional_name && (
                                            <p className="text-muted" style={{ fontSize: '0.85rem' }}>{product.regional_name}</p>
                                        )}
                                    </div>
                                    <div className="text-xl font-bold text-success" style={{ marginTop: '0.5rem' }}>
                                        ₹{product.sales_price.toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* BOTTOM: LIVE CART */}
                <div className="pos-cart-footer">
                    {/* Cart Items Summary */}
                    <div className="cart-items-scroll">
                        {cartItems.length === 0 ? (
                            <span className="text-muted italic" style={{ marginLeft: '1rem' }}>Cart is empty...</span>
                        ) : (
                            cartItems.map(item => (
                                <div key={item.id} className="cart-pill">
                                    <span className="font-bold">{item.product_name}</span>
                                    <div className="qty-control">
                                        <button onClick={(e) => { e.stopPropagation(); decrementQuantity(item.id); }} className="qty-btn">-</button>
                                        <span style={{ minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                                        <button onClick={(e) => { e.stopPropagation(); incrementQuantity(item.id); }} className="qty-btn">+</button>
                                    </div>
                                    <span className="text-success font-bold">₹{(item.sales_price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Cart Footer Actions */}
                    <div className="cart-actions">
                        <div style={{ display: 'flex', gap: '2rem' }}>
                            <div>
                                <p className="text-muted text-sm">Total Items</p>
                                <p className="text-2xl font-bold">{totalItems}</p>
                            </div>
                            <div>
                                <p className="text-muted text-sm">Total Amount</p>
                                <p className="text-3xl font-bold text-success" style={{ color: 'white' }}>₹{totalAmount.toFixed(2)}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            {cartItems.length > 0 && (
                                <button
                                    onClick={clearCart}
                                    className="btn btn-danger"
                                    style={{ width: '3.5rem', height: '3.5rem', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <Trash2 />
                                </button>
                            )}
                            <button
                                onClick={handlePrint}
                                className="btn btn-primary"
                                style={{ padding: '0 2rem', fontSize: '1.2rem', gap: '0.5rem', height: '3.5rem' }}
                            >
                                <Printer size={24} /> PRINT BILL
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PosTerminal;

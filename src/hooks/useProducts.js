import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('product_name', { ascending: true });

        if (error) {
            setError(error);
        } else {
            setProducts(data);
        }
        setLoading(false);
    };

    const addProduct = async (product) => {
        const { data, error } = await supabase
            .from('products')
            .insert([product])
            .select();

        if (error) throw error;
        setProducts((prev) => [...prev, ...data]);
        return data;
    };

    const updateProduct = async (id, updates) => {
        const { data, error } = await supabase
            .from('products')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) throw error;
        setProducts((prev) =>
            prev.map((p) => (p.id === id ? { ...p, ...data[0] } : p))
        );
        return data;
    };

    const deleteProduct = async (id) => {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) throw error;
        setProducts((prev) => prev.filter((p) => p.id !== id));
    };

    useEffect(() => {
        fetchProducts();

        // Optional: Realtime subscription could go here
    }, []);

    return {
        products,
        loading,
        error,
        fetchProducts,
        addProduct,
        updateProduct,
        deleteProduct,
    };
};

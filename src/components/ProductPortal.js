import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/products.css";
import { IoMdAdd } from "react-icons/io";
import { MdEdit, MdDelete } from "react-icons/md";

const API_BASE_URL = "https://invoice-portal-backend.onrender.com";

const ProductPortal = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStore, setSelectedStore] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", store_id: "" });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/products/${id}`);
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleOpenModal = (product = null) => {
    setEditingProduct(product);
    setNewProduct(product ? { ...product } : { name: "", price: "", store_id: "" });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setNewProduct({ name: "", price: "", store_id: "" });
  };

  const handleSaveProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.store_id) {
      alert("Please fill all fields before saving.");
      return;
    }

    try {
      if (editingProduct) {
        await axios.put(`${API_BASE_URL}/products/${editingProduct.id}`, {
          ...newProduct,
          price: parseFloat(newProduct.price), 
        });

        // Update product list locally
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === editingProduct.id ? { ...product, ...newProduct } : product
          )
        );
      } else {
        // Add new product
        const response = await axios.post(`${API_BASE_URL}/products`, {
          ...newProduct,
          price: parseFloat(newProduct.price),
        });

        // Append new product to list
        setProducts([...products, response.data]);
      }

      handleCloseModal();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("An error occurred while saving the product.");
    }
  };

  return (
    <div className="product-container">
      <h2>Product Management</h2>
      <button className="add-btn" onClick={() => handleOpenModal()}>
        <IoMdAdd size={25} /> Add Product
      </button>
      <div className="filter-section">
        <input
          type="text"
          placeholder="Search product..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select onChange={(e) => setSelectedStore(e.target.value)}>
          <option value="">All Stores</option>
          {[...new Set(products.map((product) => product.store_id))].map((store) => (
            <option key={store} value={store}>
              Store {store}
            </option>
          ))}
        </select>
      </div>
      <table className="product-table">
        <thead className="table-head">
          <tr>
            <th>Product Name</th>
            <th>Price ($)</th>
            <th>Store ID</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody className="data">
          {products
            .filter(
              (product) =>
                (product.name || "").toLowerCase().includes(searchTerm.toLowerCase()) &&
                (selectedStore ? product.store_id?.toString() === selectedStore : true)
            )
            .map((product) => (
              <tr key={product.id}>
                <td>{product.name || "No Name"}</td>
                <td>${product.price ? product.price.toFixed(2) : "N/A"}</td>
                <td>{product.store_id || "N/A"}</td>
                <td className="btns">
                  <button className="edit-btn" onClick={() => handleOpenModal(product)}>
                    <MdEdit size={25} />
                  </button>
                  <button className="delete-btn" onClick={() => handleDeleteProduct(product.id)}>
                    <MdDelete size={25} />
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingProduct ? "Edit Product" : "Add Product"}</h3>
            <input
              type="text"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
            <input
              type="number"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            />
            <input
              type="text"
              placeholder="Store ID"
              value={newProduct.store_id}
              onChange={(e) => setNewProduct({ ...newProduct, store_id: e.target.value })}
            />
            <div className="modal-actions">
              <button className="save-btn" onClick={handleSaveProduct}>
                {editingProduct ? "Update" : "Add"}
              </button>
              <button className="cancel-btn" onClick={handleCloseModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPortal;

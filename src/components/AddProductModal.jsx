import React, { useState, useEffect } from "react";

export default function AddProductModal({ onClose, onAddProduct }) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoriaId: "",
    condition: "Nuevo",
    images: [],
  });
  const [categorias, setCategorias] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageCount, setImageCount] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    // Cargar categorías desde el backend
    fetch("http://localhost:8080/api/categorias")
      .then((res) => res.json())
      .then((data) => setCategorias(data))
      .catch((err) => {
        console.error("Error al cargar categorías:", err);
        setCategorias([]);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imageCount > 10) {
      setError("No puedes subir más de 10 imágenes.");
      return;
    }
    if (files.length === 0) {
      setError("Debes subir al menos 1 imagen.");
      return;
    }
    setError("");
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }));
    setImageCount((prev) => prev + files.length);
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, images: newImages }));
    setImagePreviews(newPreviews);
    setImageCount((prev) => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { nombre, descripcion, precio, categoriaId, images } = formData;
    if (
      !nombre ||
      !descripcion ||
      !precio ||
      !categoriaId ||
      images.length === 0
    ) {
      setError("Completa todos los campos y sube al menos una imagen.");
      return;
    }
    if (isNaN(precio) || parseFloat(precio) <= 0) {
      setError("El precio debe ser un número positivo.");
      return;
    }
    const nuevoProducto = {
      nombre,
      descripcion,
      precio: parseFloat(precio),
      categoriaId: parseInt(categoriaId, 10),
      imagenes: imagePreviews,
    };
    onAddProduct(nuevoProducto);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg max-w-md w-full max-h-[80vh] flex flex-col overflow-hidden"
      >
        <h2 className="text-xl font-semibold text-textdark px-6 pt-6">
          Agregar Nuevo Producto
        </h2>
        {error && <p className="text-red-600 text-sm px-6">{error}</p>}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-textdark">
              Título:
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-greylight rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-textdark">
              Categoría:
            </label>
            <select
              name="categoriaId"
              value={formData.categoriaId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-greylight rounded focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">-- Selecciona una categoría --</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-textdark">
              Estado:
            </label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-greylight rounded focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option>Nuevo</option>
              <option>Usado</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-textdark">
              Descripción:
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              required
              className="w-full h-24 px-3 py-2 border border-greylight rounded focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-textdark">
              Precio (Lps):
            </label>
            <input
              type="number"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-3 py-2 border border-greylight rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-textdark">
              Imágenes (1 a 10):
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="block"
            />
            <div className="flex space-x-2 overflow-x-auto mt-2">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Vista previa ${index + 1}`}
                    className="w-24 h-24 object-cover rounded cursor-pointer border-2 {selected === preview ? 'border-primary' : 'border-transparent'}"
                    onClick={() => {
                      /* opcional: manejar selección */
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-0 right-0 p-1 bg-accent text-textdark rounded hover:opacity-90"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-2 px-6 pb-6 border-t border-greylight bg-white sticky bottom-0 z-10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-primary text-white rounded hover:opacity-90"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-accent text-textdark rounded hover:opacity-90"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}

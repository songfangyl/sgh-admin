import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  category: assignedCategory,
  properties: assignedProperties,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [category, setCategory] = useState(assignedCategory);
  const [productProperties, setProductProperties] = useState(assignedProperties || {});
  const [price, setPrice] = useState(existingPrice || "");
  const [images, setImages] = useState(existingImages || []);
  const [goToProducts, setGoToProducts] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryError, setCategoryError] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }, []);
  
  async function saveProduct(ev) {
    ev.preventDefault();
    if (!category) {
      setCategoryError(true);
      return;
    }
    setCategoryError(false);
    const data = {
      title,
      description,
      price,
      images,
      category,
      properties: productProperties,
    };
    if (_id) {
      await axios.put("/api/products", { ...data, _id });
    } else {
      await axios.post("/api/products", data);
    }
    setGoToProducts(true);
  }
  
  if (goToProducts) {
    router.push("/products");
  }
  
  async function uploadImages(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }
      const res = await axios.post("/api/upload", data);
      setImages((oldImages) => [...oldImages, ...res.data.links]);
      setIsUploading(false);
    }
  }
  
  function updateImagesOrder(images) {
    setImages(images);
  }
  
  function setProductProp(propName, value) {
    setProductProperties((prev) => {
      const newProductProps = { ...prev };
      newProductProps[propName] = value;
      return newProductProps;
    });
  }
  
  return (
    <form onSubmit={saveProduct} className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <label className="block text-lg font-semibold mb-2">Product name</label>
      <input
        required
        type="text"
        className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
        placeholder="Product name"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      
      <label className="block text-lg font-semibold mt-4 mb-2">Category</label>
      <select
        required
        value={category}
        onChange={(ev) => setCategory(ev.target.value)}
        className={`w-full p-2 border rounded-md focus:outline-none focus:ring ${categoryError ? 'border-red-500' : 'focus:border-blue-300'}`}
      >
        <option value="">Select a category</option>
        {categories.length > 0 &&
          categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
      </select>
      {categoryError && <p className="text-red-500 text-sm">Category is required.</p>}

      <label className="block text-lg font-semibold mt-4 mb-2">Photos</label>
      <div className="mb-2 flex flex-wrap gap-2">
        <ReactSortable list={images} setList={updateImagesOrder} className="flex flex-wrap gap-2">
          {images?.map((link) => (
            <div key={link} className="h-24 bg-white p-2 shadow-sm rounded-md border border-gray-300">
              <img src={link} alt="" className="rounded-md h-full" />
            </div>
          ))}
        </ReactSortable>
        {isUploading && (
          <div className="h-24 flex items-center">
            <Spinner />
          </div>
        )}
        <label className="w-24 h-24 cursor-pointer flex flex-col items-center justify-center text-sm gap-1 text-blue-500 border border-blue-500 rounded-md shadow-sm bg-white">
          <span>+</span>
          <input type="file" onChange={uploadImages} className="hidden" />
        </label>
      </div>
      
      <label className="block text-lg font-semibold mt-4 mb-2">Description</label>
      <textarea
        className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
        placeholder="Description"
        value={description}
        onChange={(ev) => setDescription(ev.target.value)}
      />
      
      <label className="block text-lg font-semibold mt-4 mb-2">Price (in RM)</label>
      <input
        required
        type="number"
        className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
        placeholder="Price"
        value={price}
        onChange={(ev) => setPrice(ev.target.value)}
      />
      
      <button type="submit" className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
        Save
      </button>
    </form>
  );
}

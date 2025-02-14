import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { withSwal } from 'react-sweetalert2';

function Categories({ swal }) {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState('');
  const [parentCategory, setParentCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    axios.get('/api/categories').then(result => {
      setCategories(result.data);
    });
  }

  async function saveCategory(ev) {
    ev.preventDefault();
    const data = {
      name,
      parentCategory,
      properties: properties.map(p => ({
        name: p.name,
        values: p.values.split(','),
      })),
    };
    if (editedCategory) {
      data._id = editedCategory._id;
      await axios.put('/api/categories', data);
      setEditedCategory(null);
    } else {
      await axios.post('/api/categories', data);
    }
    setName('');
    setParentCategory('');
    setProperties([]);
    fetchCategories();
  }

  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id || '');
    setProperties(
      category.properties.map(({ name, values }) => ({
        name,
        values: values.join(','),
      }))
    );
  }

  function deleteCategory(category) {
    swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete ${category.name}?`,
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Yes, Delete!',
      confirmButtonColor: '#d55',
      reverseButtons: true,
    }).then(async result => {
      if (result.isConfirmed) {
        const { _id } = category;
        await axios.delete('/api/categories?_id=' + _id);
        fetchCategories();
      }
    });
  }

  function addProperty() {
    setProperties(prev => [...prev, { name: '', values: '' }]);
  }

  function handlePropertyChange(index, key, value) {
    setProperties(prev => {
      const updatedProperties = [...prev];
      updatedProperties[index][key] = value;
      return updatedProperties;
    });
  }

  function removeProperty(indexToRemove) {
    setProperties(prev => prev.filter((_, index) => index !== indexToRemove));
  }

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Categories</h1>
        <form onSubmit={saveCategory} className="space-y-4 bg-white p-4 rounded-lg shadow-md">
          <label className="block font-medium mb-2">
            {editedCategory ? `Edit category ${editedCategory.name}` : 'Create new category'}
          </label>
          <div className="flex gap-2">
            <input
              required
              type="text"
              placeholder="Category name"
              className="w-full p-2 border rounded-md"
              onChange={ev => setName(ev.target.value)}
              value={name}
            />
            <select
              className="w-full p-2 border rounded-md"
              onChange={ev => setParentCategory(ev.target.value)}
              value={parentCategory}
            >
              <option value="">No parent category</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>{category.name}</option>
              ))}
            </select>
          </div>

          <div className="mb-2">
            <label className="block font-medium">Properties</label>
            <button onClick={addProperty} type="button" className="btn-default text-sm mb-2">
              Add new property
            </button>
            {properties.map((property, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={property.name}
                  className="w-full p-2 border rounded-md"
                  onChange={ev => handlePropertyChange(index, 'name', ev.target.value)}
                  placeholder="Property name (e.g., color)"
                />
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  onChange={ev => handlePropertyChange(index, 'values', ev.target.value)}
                  value={property.values}
                  placeholder="Values, comma separated"
                />
                <button onClick={() => removeProperty(index)} type="button" className="btn-red">
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            {editedCategory && (
              <button
                type="button"
                onClick={() => {
                  setEditedCategory(null);
                  setName('');
                  setParentCategory('');
                  setProperties([]);
                }}
                className="btn-default"
              >
                Cancel
              </button>
            )}
            <button type="submit" className="btn-primary px-4 py-2">Save</button>
          </div>
        </form>
        {!editedCategory && (
          <table className="w-full border-collapse shadow-md mt-4 bg-white rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border-b">Category name</th>
                <th className="p-3 border-b">Parent category</th>
                <th className="p-3 border-b text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(category => (
                <tr key={category._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{category.name}</td>
                  <td className="p-3">{category?.parent?.name}</td>
                  <td className="p-3 text-right">
                    <button onClick={() => editCategory(category)} className="btn-default mr-2">Edit</button>
                    <button onClick={() => deleteCategory(category)} className="btn-red">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}

export default withSwal(({ swal }) => <Categories swal={swal} />);

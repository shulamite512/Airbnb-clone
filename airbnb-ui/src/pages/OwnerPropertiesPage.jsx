import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ownerApi, resolveImageUrl } from '../lib/api';
import { useAuthStore } from '../store/authStore';

export default function OwnerPropertiesPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    property_name: '',
    property_type: 'Apartment',
    location: '',
    description: '',
    price_per_night: '',
    bedrooms: 1,
    bathrooms: 1,
    max_guests: 2,
    amenities: '',
  });

  useEffect(() => {
    if (!isAuthenticated || user?.user_type !== 'owner') {
      navigate('/auth');
      return;
    }
    fetchProperties();
  }, [isAuthenticated, user]);

  const fetchProperties = async () => {
    try {
      const data = await ownerApi.getProperties();
      setProperties(data.properties || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await ownerApi.createProperty(formData);
      setShowAddForm(false);
      setFormData({
        property_name: '',
        property_type: 'Apartment',
        location: '',
        description: '',
        price_per_night: '',
        bedrooms: 1,
        bathrooms: 1,
        max_guests: 2,
        amenities: '',
      });
      await fetchProperties();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Properties</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600"
        >
          {showAddForm ? 'Cancel' : '+ Add Property'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-800 rounded-lg">
          {error}
        </div>
      )}

      {/* Add Property Form */}
      {showAddForm && (
        <div className="mb-8 p-6 border rounded-2xl bg-gray-50">
          <h2 className="text-2xl font-semibold mb-6">Add New Property</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Property Name *</label>
                <input
                  type="text"
                  name="property_name"
                  value={formData.property_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Modern Downtown Loft"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Property Type *</label>
                <select
                  name="property_type"
                  value={formData.property_type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="Villa">Villa</option>
                  <option value="Cabin">Cabin</option>
                  <option value="Condo">Condo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="New York, NY"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Price per Night ($) *</label>
                <input
                  type="number"
                  name="price_per_night"
                  value={formData.price_per_night}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Bedrooms</label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Bathrooms</label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Max Guests</label>
                <input
                  type="number"
                  name="max_guests"
                  value={formData.max_guests}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="3"
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Describe your property..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Amenities (comma-separated)</label>
              <input
                type="text"
                name="amenities"
                value={formData.amenities}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="WiFi, Kitchen, Pool, Parking"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Create Property
            </button>
          </form>
        </div>
      )}

      {/* Properties List */}
      {properties.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold mb-4">No properties yet</h2>
          <p className="text-gray-600 mb-6">Start by adding your first property</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => {
            const photos = Array.isArray(property.photos)
              ? property.photos
              : typeof property.photos === 'string'
              ? JSON.parse(property.photos)
              : [];

            return (
              <div key={property.id} className="border rounded-2xl overflow-hidden hover:shadow-md transition">
                <img
                  src={photos[0] ? resolveImageUrl(photos[0]) : resolveImageUrl(null)}
                  alt={property.property_name}
                  className="h-48 w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{property.property_name}</h3>
                  <p className="text-gray-600 mb-2">{property.location}</p>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{property.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
                    <span>{property.bedrooms} bed · {property.bathrooms} bath</span>
                    <span>{property.max_guests} guests</span>
                  </div>
                  <p className="font-bold text-lg">${property.price_per_night}/night</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

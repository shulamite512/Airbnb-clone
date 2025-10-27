import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { propertiesApi, bookingsApi, travelerApi, resolveImageUrl } from '../lib/api';
import { useAuthStore } from '../store/authStore';

export default function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  const [property, setProperty] = useState(null);
  const [blockedDates, setBlockedDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  // Booking form state
  const [bookingData, setBookingData] = useState({
    start_date: '',
    end_date: '',
    number_of_guests: 1,
  });
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchPropertyDetails();
    if (isAuthenticated && user?.user_type === 'traveler') {
      checkIfFavorite();
    }
  }, [id]);

  const fetchPropertyDetails = async () => {
    try {
      const data = await propertiesApi.getById(id);
      setProperty(data.property);
      setBlockedDates(data.blockedDates || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const checkIfFavorite = async () => {
    try {
      const data = await travelerApi.getFavorites();
      setIsFavorite(data.favorites?.some(fav => fav.id === parseInt(id)));
    } catch (err) {
      console.error('Error checking favorites:', err);
    }
  };

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    try {
      if (isFavorite) {
        await travelerApi.removeFavorite(id);
        setIsFavorite(false);
      } else {
        await travelerApi.addFavorite(id);
        setIsFavorite(true);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const handleBookingChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value,
    });
  };

  const calculateNights = () => {
    if (!bookingData.start_date || !bookingData.end_date) return 0;
    const start = new Date(bookingData.start_date);
    const end = new Date(bookingData.end_date);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateTotalPrice = () => {
    const nights = calculateNights();
    return nights * property.price_per_night;
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setBookingError('');
    setBookingSuccess(false);

    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    if (user?.user_type !== 'traveler') {
      setBookingError('Only travelers can book properties');
      return;
    }

    setBookingLoading(true);

    try {
      await bookingsApi.create({
        property_id: parseInt(id),
        ...bookingData,
      });
      setBookingSuccess(true);
      setBookingData({ start_date: '', end_date: '', number_of_guests: 1 });
    } catch (err) {
      setBookingError(err.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 text-center">
        <p className="text-red-500">Error: {error || 'Property not found'}</p>
      </div>
    );
  }

  const photos = Array.isArray(property.photos)
    ? property.photos
    : typeof property.photos === 'string'
    ? JSON.parse(property.photos)
    : [];
  const normalizedPhotos = photos.map((p) => resolveImageUrl(p));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{property.property_name}</h1>
        <div className="flex items-center gap-4 mt-2 text-sm">
          <span>★ 4.5</span>
          <span className="text-gray-600">{property.location}</span>
        </div>
      </div>

      {/* Photos Grid */}
      <div className="grid grid-cols-4 gap-2 mb-8 rounded-2xl overflow-hidden h-96">
        {normalizedPhotos.slice(0, 5).map((photo, index) => (
          <img
            key={index}
            src={photo}
            alt={`${property.property_name} ${index + 1}`}
            className={`w-full h-full object-cover ${index === 0 ? 'col-span-2 row-span-2' : ''}`}
          />
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Property Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border-b pb-6">
            <h2 className="text-2xl font-semibold mb-2">
              {property.property_type} by {property.owner_name} • {property.owner_email}
            </h2>
            <p className="text-gray-600">
              {property.max_guests} guests · {property.bedrooms} bedrooms · {property.bathrooms} bathrooms
            </p>
          </div>

          <div className="border-b pb-6">
            <h3 className="text-xl font-semibold mb-3">Location</h3>
            <p className="text-gray-700">
              {property.street_address}<br />
              {property.city}, {property.state} {property.zip_code}
            </p>
          </div>

          <div className="border-b pb-6">
            <h3 className="text-xl font-semibold mb-3">Check-in & Check-out</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Check-in time</p>
                <p className="text-gray-600">
                  {property.check_in_time ? new Date('2000-01-01T' + property.check_in_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '3:00 PM'}
                </p>
              </div>
              <div>
                <p className="font-medium">Check-out time</p>
                <p className="text-gray-600">
                  {property.check_out_time ? new Date('2000-01-01T' + property.check_out_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '11:00 AM'}
                </p>
              </div>
            </div>
          </div>

          <div className="border-b pb-6">
            <h3 className="text-xl font-semibold mb-3">About this place</h3>
            <p className="text-gray-700">{property.description}</p>
          </div>

          {property.amenities && (
            <div className="border-b pb-6">
              <h3 className="text-xl font-semibold mb-3">Amenities</h3>
              <div className="grid grid-cols-2 gap-3">
                {property.amenities.split(',').map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span>✓</span>
                    <span>{amenity.trim()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Booking Card */}
        <div className="lg:col-span-1">
          <div className="border rounded-2xl p-6 shadow-lg sticky top-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-2xl font-bold">${property.price_per_night}</span>
                <span className="text-gray-600"> / night</span>
              </div>
              <button
                onClick={toggleFavorite}
                className="text-2xl hover:scale-110 transition"
              >
                {isFavorite ? '❤️' : '🤍'}
              </button>
            </div>

            {bookingSuccess && (
              <div className="mb-4 p-3 bg-green-50 text-green-800 rounded-md text-sm">
                Booking request sent successfully!
              </div>
            )}

            {bookingError && (
              <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-md text-sm">
                {bookingError}
              </div>
            )}

            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Check-in</label>
                <input
                  type="date"
                  name="start_date"
                  value={bookingData.start_date}
                  onChange={handleBookingChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Check-out</label>
                <input
                  type="date"
                  name="end_date"
                  value={bookingData.end_date}
                  onChange={handleBookingChange}
                  min={bookingData.start_date || new Date().toISOString().split('T')[0]}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Guests</label>
                <input
                  type="number"
                  name="number_of_guests"
                  value={bookingData.number_of_guests}
                  onChange={handleBookingChange}
                  min="1"
                  max={property.max_guests}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              {bookingData.start_date && bookingData.end_date && (
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>${property.price_per_night} × {calculateNights()} nights</span>
                    <span>${calculateTotalPrice()}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${calculateTotalPrice()}</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={bookingLoading}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 disabled:opacity-50"
              >
                {bookingLoading ? 'Processing...' : 'Reserve'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-4">
              You won't be charged yet
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// services/pexelsService.js
const axios = require('axios');

const PEXELS_API_KEY = 'HrXEJeADULZugwkvAzpixJ6YXNBOrImMvOTuVuZGHcG7ndzaxkPkuBtO';
const PEXELS_API_URL = 'https://api.pexels.com/v1/search';

/**
 * Get keywords from property title and type
 * @param {string} title - Property title
 * @param {string} propertyType - Type of property
 * @returns {string[]} Array of relevant search terms
 */
function getSearchKeywords(title = '', propertyType = 'house') {
  // Extract meaningful words from title
  const words = title.toLowerCase().split(' ');
  const keywords = new Set();
  
  // Add property type variants
  if (propertyType.includes('apartment') || title.includes('apartment')) {
    keywords.add('modern apartment');
    keywords.add('apartment interior');
  } else if (propertyType.includes('villa') || title.includes('villa')) {
    keywords.add('luxury villa');
    keywords.add('villa design');
  } else if (propertyType.includes('cabin') || title.includes('cabin')) {
    keywords.add('cozy cabin');
    keywords.add('cabin woods');
  } else if (propertyType.includes('beach') || title.includes('beach')) {
    keywords.add('beach house');
    keywords.add('coastal home');
  } else {
    keywords.add('modern house');
    keywords.add('home interior');
  }

  // Add general interior/exterior keywords
  keywords.add('bedroom design');
  keywords.add('modern living room');
  
  return Array.from(keywords);
}

/**
 * Fetch 4 property images from Pexels based on property type and location
 * @param {string} propertyType - Type of property (apartment, house, villa, etc.)
 * @param {string} title - Title of the property (optional)
 * @param {string} location - Location of the property (optional)
 * @returns {Promise<string[]>} Array of 4 image URLs
 */
async function getPropertyImages(propertyType = 'house', title = '', location = '') {
  try {
    // Get search keywords based on title and type
    const keywords = getSearchKeywords(title, propertyType);

    const imageUrls = [];
    const usedUrls = new Set(); // Track used URLs to avoid duplicates

    // Fetch images for each query
    for (const query of keywords) {
      try {
        const response = await axios.get(PEXELS_API_URL, {
          headers: {
            Authorization: PEXELS_API_KEY
          },
          params: {
            query: query,
            per_page: 5, // Get more options
            page: Math.floor(Math.random() * 5) + 1 // Random page 1-5
          }
        });

        if (response.data.photos && response.data.photos.length > 0) {
          // Pick a random photo from results that we haven't used yet
          const availablePhotos = response.data.photos
            .map(photo => photo.src.large)
            .filter(url => !usedUrls.has(url));
          
          if (availablePhotos.length > 0) {
            const randomUrl = availablePhotos[Math.floor(Math.random() * availablePhotos.length)];
            imageUrls.push(randomUrl);
            usedUrls.add(randomUrl);
          } else {
            const fallback = await getFallbackImage(propertyType);
            if (!usedUrls.has(fallback)) {
              imageUrls.push(fallback);
              usedUrls.add(fallback);
            }
          }
        } else {
          // Fallback to a generic search if no results
          const fallback = await getFallbackImage(propertyType);
          if (!usedUrls.has(fallback)) {
            imageUrls.push(fallback);
            usedUrls.add(fallback);
          }
        }
      } catch (error) {
        console.error(`Error fetching image for query "${query}":`, error.message);
        // Add a fallback image
        const fallback = await getFallbackImage(propertyType);
        if (!usedUrls.has(fallback)) {
          imageUrls.push(fallback);
          usedUrls.add(fallback);
        }
      }

      // Break if we have enough unique images
      if (imageUrls.length >= 4) break;
    }

    // Ensure we always return exactly 4 images
    while (imageUrls.length < 4) {
      const fallback = await getFallbackImage(propertyType);
      if (!usedUrls.has(fallback)) {
        imageUrls.push(fallback);
        usedUrls.add(fallback);
      }
    }

    return imageUrls.slice(0, 4);
  } catch (error) {
    console.error('Error in getPropertyImages:', error.message);
    // Return fallback images if everything fails
    return getDefaultImages();
  }
}

/**
 * Get a fallback image for a property type
 * @param {string} propertyType
 * @returns {Promise<string>} Image URL
 */
async function getFallbackImage(propertyType) {
  try {
    const response = await axios.get(PEXELS_API_URL, {
      headers: {
        Authorization: PEXELS_API_KEY
      },
      params: {
        query: `${propertyType} interior` || 'modern home',
        per_page: 5,
        page: Math.floor(Math.random() * 10) + 1 // Random page for variety
      }
    });

    if (response.data.photos && response.data.photos.length > 0) {
      // Pick a random photo from results
      const randomIndex = Math.floor(Math.random() * response.data.photos.length);
      return response.data.photos[randomIndex].src.large;
    }
  } catch (error) {
    console.error('Fallback image fetch failed:', error.message);
  }

  // Ultimate fallback - use a random default image
  return getDefaultImages()[Math.floor(Math.random() * 4)];
}

/**
 * Return default property images if API fails completely
 * @returns {string[]} Array of 4 default image URLs
 */
function getDefaultImages() {
  return [
    'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/2635038/pexels-photo-2635038.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  ];
}

module.exports = {
  getPropertyImages,
  getDefaultImages
};

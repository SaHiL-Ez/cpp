# Project References and Bibliography

## Frontend Dependencies
- **React**: https://reactjs.org/
- **Next.js**: https://nextjs.org/
- **Radix UI**: https://www.radix-ui.com/
- **Firebase**: https://firebase.google.com/
- **Mongoose**: https://mongoosejs.com/
- **i18next (Internationalization)**: https://www.i18next.com/
- **Leaflet (Mapping Library)**: https://leafletjs.com/
- **Recharts (Charts Library)**: https://recharts.org/
- **Tailwind CSS (Utility-first CSS Framework)**: https://tailwindcss.com/

## Backend Dependencies
- **Flask (Python Web Framework)**: https://flask.palletsprojects.com/
- **TensorFlow (Machine Learning Framework)**: https://www.tensorflow.org/
- **Keras (Deep Learning API)**: https://keras.io/
- **NumPy (Numerical Computing Library)**: https://numpy.org/
- **Pillow (Python Imaging Library)**: https://python-pillow.org/
- **h5py (HDF5 for Python)**: https://www.h5py.org/

## APIs Implemented in the Project
- **Farmer Registration API**
  - Endpoint: `POST /api/farmer/register`
  - Registers a new farmer with name, phone, and location.
- **Farmer Login API**
  - Endpoint: `POST /api/farmer/login`
  - Authenticates a farmer using phone number.
- **Geocode API**
  - Endpoint: `GET /api/geocode`
  - Uses Google Maps Geocoding API to convert latitude and longitude to a formatted address.
- **IP Location API**
  - Endpoint: `GET /api/ip-locate`
  - Uses IPAPI (https://ipapi.co/) to get location from IP address and Google Maps Geocoding API for reverse geocoding.

## External APIs and Services Used
- **Google Maps Geocoding API**
  - Documentation: https://developers.google.com/maps/documentation/geocoding/overview
- **IPAPI (IP Geolocation API)**
  - Website: https://ipapi.co/

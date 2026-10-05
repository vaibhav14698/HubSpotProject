require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Setup Pug Template Engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const CUSTOM_OBJECT_TYPE = 'contacts';

// HubSpot Request Headers
const hubspotHeaders = {
  headers: {
    Authorization: `Bearer ${process.env.PRIVATE_APP_ACCESS_TOKEN ? process.env.PRIVATE_APP_ACCESS_TOKEN.trim() : ''}`,
    'Content-Type': 'application/json'
  }
};

// 1. READ ALL - GET /
app.get('/', async (req, res) => {
  const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}?properties=firstname,lastname,email`;

  try {
    const response = await axios.get(url, hubspotHeaders);
    res.render('homepage', {
      title: 'CRM Records | HubSpot Project',
      records: response.data.results
    });
  } catch (error) {
    console.error('Error fetching records:', error.response?.data || error.message);
    res.status(500).send('Failed to retrieve records.');
  }
});

// 2. CREATE FORM - GET /update-cobj
app.get('/update-cobj', (req, res) => {
  res.render('updates', {
    title: 'Add Record | HubSpot',
    record: null
  });
});

// 3. EDIT FORM - GET /edit/:id
app.get('/edit/:id', async (req, res) => {
  const { id } = req.params;
  const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}/${id}?properties=firstname,lastname,email`;

  try {
    const response = await axios.get(url, hubspotHeaders);
    res.render('updates', {
      title: 'Edit Record | HubSpot',
      record: response.data
    });
  } catch (error) {
    console.error('Error retrieving record:', error.response?.data || error.message);
    res.status(500).send('Failed to fetch the record for editing.');
  }
});

// 4. CREATE / UPDATE ACTION - POST /update-cobj
app.post('/update-cobj', async (req, res) => {
  const { id, firstname, lastname, email } = req.body;

  const payload = {
    properties: {
      firstname,
      lastname,
      email
    }
  };

  try {
    if (id) {
      // UPDATE: PATCH https://api.hubapi.com/crm/v3/objects/{objectType}/{recordId}
      const updateUrl = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}/${id}`;
      await axios.patch(updateUrl, payload, hubspotHeaders);
    } else {
      // CREATE: POST https://api.hubapi.com/crm/v3/objects/{objectType}
      const createUrl = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`;
      await axios.post(createUrl, payload, hubspotHeaders);
    }
    res.redirect('/');
  } catch (error) {
    console.error('Error saving record:', error.response?.data || error.message);
    res.status(500).send('Failed to save record to HubSpot.');
  }
});

// 5. DELETE ACTION - GET /delete/:id
app.get('/delete/:id', async (req, res) => {
  const { id } = req.params;
  const deleteUrl = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}/${id}`;

  try {
    // DELETE https://api.hubapi.com/crm/v3/objects/{objectType}/{recordId}
    await axios.delete(deleteUrl, hubspotHeaders);
    res.redirect('/');
  } catch (error) {
    console.error('Error deleting record:', error.response?.data || error.message);
    res.status(500).send('Failed to delete the record.');
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
// components/PosetFrom.tsx
'use client'
import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';

export const PosetFrom: React.FC = () => {
  const [formValues, setFormValues] = useState({
    field1: '',
    field2: '',
    field3: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted:', formValues);
  };

  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        Poset From
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Problem Spec"
          name="spec"
          value={formValues.field1}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Prompt"
          name="prompt"
          value={formValues.field2}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Response"
          name="response"
          value={formValues.field3}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </form>
      </>
  );
};
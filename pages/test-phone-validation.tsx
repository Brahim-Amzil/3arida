import React, { useState } from 'react';

const TestPhoneValidation = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [validationResult, setValidationResult] = useState<string>('');

  // The same regex used in the app
  const phoneRegex = /^\+[1-9]\d{1,14}$/;

  const validatePhone = (phone: string) => {
    if (!phone) {
      return 'Please enter a phone number';
    }

    if (!phone.startsWith('+')) {
      return 'Phone number must start with + (country code)';
    }

    if (phone.length < 3) {
      return 'Phone number too short';
    }

    if (phone.length > 16) {
      return 'Phone number too long (max 15 digits after +)';
    }

    const digitsOnly = phone.slice(1); // Remove the +
    if (!/^\d+$/.test(digitsOnly)) {
      return 'Phone number can only contain digits after +';
    }

    if (digitsOnly[0] === '0') {
      return 'Country code cannot start with 0';
    }

    if (phoneRegex.test(phone)) {
      return '✅ Valid phone number format!';
    } else {
      return '❌ Invalid phone number format';
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneNumber(value);
    setValidationResult(validatePhone(value));
  };

  const commonFormats = [
    '+1234567890 (US format)',
    '+212612345678 (Morocco format)',
    '+33123456789 (France format)',
    '+44123456789 (UK format)',
    '+49123456789 (Germany format)',
    '+86123456789 (China format)',
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Phone Number Validation Test
          </h1>
          
          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Enter Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              value={phoneNumber}
              onChange={handlePhoneChange}
              placeholder="+1234567890"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mb-6">
            <p className={`text-sm font-medium ${
              validationResult.includes('✅') ? 'text-green-600' : 'text-red-600'
            }`}>
              {validationResult || 'Enter a phone number to validate'}
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Valid Format Examples:</h3>
            <ul className="text-xs text-gray-600 space-y-1">
              {commonFormats.map((format, index) => (
                <li key={index} className="font-mono">{format}</li>
              ))}
            </ul>
          </div>

          <div className="text-xs text-gray-500">
            <p><strong>Rules:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>Must start with + followed by country code</li>
              <li>Country code cannot start with 0</li>
              <li>Total length: 3-16 characters (+ plus 2-15 digits)</li>
              <li>Only digits allowed after the +</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPhoneValidation;
# Validation Utilities - Quick Reference

## Import
```javascript
import { 
  validateFullName, 
  validatePhone, 
  validateEmail, 
  validatePassword, 
  validatePasswordMatch 
} from '../../utils/validation';
```

## Functions

### validateFullName(fullName)
Validates that the full name contains only letters, spaces, hyphens, and apostrophes.

**Parameters:**
- `fullName` (string): The full name to validate

**Returns:**
```javascript
{
  isValid: boolean,
  error: string  // Error message, empty if valid
}
```

**Examples:**
```javascript
validateFullName('John Smith');
// { isValid: true, error: '' }

validateFullName('John123');
// { isValid: false, error: 'Full name can only contain letters, spaces, hyphens, and apostrophes' }

validateFullName('');
// { isValid: false, error: 'Full name is required' }
```

---

### validatePhone(phone, isOptional)
Validates that the phone number is exactly 10 digits.

**Parameters:**
- `phone` (string): The phone number to validate
- `isOptional` (boolean): If true, empty phone is considered valid (default: false)

**Returns:**
```javascript
{
  isValid: boolean,
  error: string
}
```

**Examples:**
```javascript
validatePhone('1234567890');
// { isValid: true, error: '' }

validatePhone('123-456-7890', true);
// { isValid: true, error: '' } // Cleaned to 1234567890

validatePhone('', true);
// { isValid: true, error: '' } // Optional field

validatePhone('12345');
// { isValid: false, error: 'Phone number must be exactly 10 digits' }
```

---

### validateEmail(email)
Validates email format using standard regex.

**Parameters:**
- `email` (string): The email to validate

**Returns:**
```javascript
{
  isValid: boolean,
  error: string
}
```

**Examples:**
```javascript
validateEmail('user@example.com');
// { isValid: true, error: '' }

validateEmail('invalid-email');
// { isValid: false, error: 'Please enter a valid email address' }
```

---

### validatePassword(password)
Validates that password is at least 6 characters.

**Parameters:**
- `password` (string): The password to validate

**Returns:**
```javascript
{
  isValid: boolean,
  error: string
}
```

**Examples:**
```javascript
validatePassword('password123');
// { isValid: true, error: '' }

validatePassword('pass');
// { isValid: false, error: 'Password must be at least 6 characters long' }
```

---

### validatePasswordMatch(password, confirmPassword)
Validates that two passwords match.

**Parameters:**
- `password` (string): The original password
- `confirmPassword` (string): The confirmation password

**Returns:**
```javascript
{
  isValid: boolean,
  error: string
}
```

**Examples:**
```javascript
validatePasswordMatch('password123', 'password123');
// { isValid: true, error: '' }

validatePasswordMatch('password123', 'different');
// { isValid: false, error: 'Passwords do not match' }
```

## Usage Pattern

### Real-time Validation
```javascript
const [value, setValue] = useState('');
const [error, setError] = useState('');

const handleChange = (text) => {
  setValue(text);
  const validation = validateFullName(text);
  setError(validation.error);
};
```

### Submit Validation
```javascript
const handleSubmit = () => {
  const nameValidation = validateFullName(fullName);
  const phoneValidation = validatePhone(phone, true);
  
  setNameError(nameValidation.error);
  setPhoneError(phoneValidation.error);
  
  if (!nameValidation.isValid || !phoneValidation.isValid) {
    Alert.alert('Error', 'Please fix validation errors');
    return;
  }
  
  // Proceed with submission
};
```

### Conditional Error Display
```jsx
<TextInput
  style={[styles.input, error && styles.inputError]}
  value={value}
  onChangeText={handleChange}
/>
{error ? <Text style={styles.errorText}>{error}</Text> : null}
```

## Phone Number Cleaning

The phone validation automatically cleans formatting:
- Removes spaces: `"123 456 7890"` → `"1234567890"`
- Removes hyphens: `"123-456-7890"` → `"1234567890"`
- Removes parentheses: `"(123) 456-7890"` → `"1234567890"`

To clean phone before storing:
```javascript
const cleanPhone = phone.replace(/[\s\-()]/g, '');
await userQueries.updateUser(userId, fullName, cleanPhone, address);
```

## Error Messages Reference

| Validation | Error Messages |
|-----------|---------------|
| Full Name | "Full name is required"<br>"Full name must be at least 2 characters"<br>"Full name can only contain letters, spaces, hyphens, and apostrophes" |
| Phone | "Phone number is required"<br>"Phone number can only contain digits"<br>"Phone number must be exactly 10 digits" |
| Email | "Email is required"<br>"Please enter a valid email address" |
| Password | "Password is required"<br>"Password must be at least 6 characters long" |
| Password Match | "Passwords do not match" |

## Styling Reference

```javascript
// Input with error
inputError: {
  borderColor: '#e94560',
  borderWidth: 2,
}

// Error text
errorText: {
  color: '#e94560',
  fontSize: 12,
  marginTop: 2,
}
```

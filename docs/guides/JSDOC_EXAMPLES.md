# JSDoc Patterns & Examples

This guide provides detailed, real-world examples of JSDoc patterns used in this project. Reference these patterns when writing code.

**Quick Links:**
- [Simple Functions](#simple-functions)
- [React Components](#react-components)
- [Custom Hooks](#custom-hooks)
- [Type Definitions](#type-definitions)
- [Error Handling](#error-handling)
- [Async Operations](#async-operations)
- [Anti-Patterns to Avoid](#anti-patterns-to-avoid)
- [Quick Templates](#quick-templates)

---

## Simple Functions

### Basic Function

```typescript
/**
 * Calculates the sum of two numbers.
 *
 * @param a - The first number
 * @param b - The second number
 * @returns The sum of a and b
 */
function add(a: number, b: number): number {
  return a + b;
}
```

### Function with Optional Parameters

```typescript
/**
 * Formats a phone number with optional formatting style.
 *
 * @param phone - The phone number string (digits only)
 * @param format - Optional format style ('dashes' | 'dots' | 'spaces', default: 'dashes')
 * @returns The formatted phone number
 *
 * @example
 * formatPhone('1234567890', 'dashes') // Returns '123-456-7890'
 * formatPhone('1234567890', 'dots')   // Returns '123.456.7890'
 * formatPhone('1234567890')           // Returns '123-456-7890' (default)
 */
function formatPhone(phone: string, format: 'dashes' | 'dots' | 'spaces' = 'dashes'): string {
  const digits = phone.replace(/\D/g, '');
  const separators = { dashes: '-', dots: '.', spaces: ' ' };
  return `${digits.slice(0, 3)}${separators[format]}${digits.slice(3, 6)}${separators[format]}${digits.slice(6)}`;
}
```

### Function with Side Effects

```typescript
/**
 * Saves user data to local storage and logs the action.
 *
 * @param userId - The user ID to save
 * @param data - The user data object to store
 * @returns void
 * @throws {Error} If localStorage is not available
 *
 * **Side Effects:**
 * - Writes to browser's localStorage under key `user_${userId}`
 * - Logs save action to console in development mode
 */
function saveUserData(userId: string, data: UserData): void {
  if (!window.localStorage) {
    throw new Error('localStorage is not available');
  }
  window.localStorage.setItem(`user_${userId}`, JSON.stringify(data));
  if (process.env.NODE_ENV === 'development') {
    console.log(`User data saved for ${userId}`);
  }
}
```

### Function with Validation

```typescript
/**
 * Validates and processes user email address.
 *
 * @param email - The email address to validate
 * @returns The normalized email (lowercase)
 * @throws {Error} If email is invalid format
 * @throws {Error} If email domain is blacklisted
 */
function validateEmail(email: string): string {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error(`Invalid email format: ${email}`);
  }

  const normalized = email.toLowerCase();
  const blacklistedDomains = ['example.com', 'test.com'];
  const domain = normalized.split('@')[1];

  if (blacklistedDomains.includes(domain)) {
    throw new Error(`Email domain is blacklisted: ${domain}`);
  }

  return normalized;
}
```

---

## React Components

### Simple Functional Component

```typescript
/**
 * Displays a badge with a label and optional counter.
 *
 * @param label - The text to display in the badge
 * @param count - Optional count number to display as a small circle
 * @param variant - Visual style variant ('default' | 'success' | 'error', default: 'default')
 * @returns A styled badge element
 *
 * @example
 * <Badge label="New" count={5} variant="success" />
 */
interface BadgeProps {
  /** The text to display in the badge */
  label: string;
  /** Optional count to show as a small circle */
  count?: number;
  /** Visual style variant (default: 'default') */
  variant?: 'default' | 'success' | 'error';
}

export function Badge({ label, count, variant = 'default' }: BadgeProps) {
  return (
    <div className={`badge badge-${variant}`}>
      {label}
      {count && <span className="badge-count">{count}</span>}
    </div>
  );
}
```

### Component with Context

```typescript
/**
 * Provides authentication context to child components.
 * Must wrap components that use the useAuth hook.
 *
 * @param children - React components to wrap with auth context
 * @returns A context provider component
 * @throws {Error} If no auth service is configured
 *
 * **Context Provided:**
 * - `authState`: Current authentication state (authenticated, loading, user)
 * - `login()`: Function to authenticate user
 * - `logout()`: Function to sign out
 *
 * @example
 * <AuthProvider>
 *   <Dashboard />
 * </AuthProvider>
 */
interface AuthProviderProps {
  /** React components to provide auth context to */
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>('loading');

  // Implementation...

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### Component with Complex Props

```typescript
/**
 * Renders a data table with sorting, filtering, and pagination.
 *
 * @param data - Array of row objects to display
 * @param columns - Column definitions (name, label, sortable, formatter)
 * @param onRowClick - Optional callback fired when a row is clicked
 * @param isLoading - Whether table is in loading state (default: false)
 * @param pageSize - Rows per page (default: 10)
 * @returns A fully featured data table component
 *
 * **State Managed:**
 * - Current sort column and direction
 * - Current page number
 * - Filtered data
 *
 * **Accessibility:**
 * - ARIA labels on sortable headers
 * - Keyboard navigation support
 * - Screen reader friendly
 */
interface DataTableProps<T> {
  /** Array of objects representing table rows */
  data: T[];
  /** Column definitions for table */
  columns: Array<{
    key: keyof T;
    label: string;
    sortable?: boolean;
    formatter?: (value: T[keyof T]) => React.ReactNode;
  }>;
  /** Callback fired when a row is clicked */
  onRowClick?: (row: T) => void;
  /** Whether data is currently loading (default: false) */
  isLoading?: boolean;
  /** Number of rows per page (default: 10) */
  pageSize?: number;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  onRowClick,
  isLoading = false,
  pageSize = 10,
}: DataTableProps<T>) {
  // Implementation...
}
```

---

## Custom Hooks

### Simple State Hook

```typescript
/**
 * Manages toggle state (on/off).
 * Useful for modals, dropdowns, or any boolean flag.
 *
 * @param initialValue - Initial toggle state (default: false)
 * @returns Tuple containing [isOpen, toggle, setIsOpen]
 *   - isOpen: Current boolean state
 *   - toggle(): Function to toggle the state
 *   - setIsOpen(value): Function to set state explicitly
 *
 * @example
 * const [isOpen, toggle] = useToggle(false);
 * return (
 *   <>
 *     <button onClick={toggle}>Toggle</button>
 *     {isOpen && <div>Content</div>}
 *   </>
 * );
 */
function useToggle(initialValue: boolean = false) {
  const [isOpen, setIsOpen] = useState(initialValue);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return [isOpen, toggle, setIsOpen] as const;
}
```

### Hook with Effect & Cleanup

```typescript
/**
 * Subscribes to keyboard events and cleans up on unmount.
 *
 * @param callback - Function to call when the key is pressed
 * @param targetKey - The keyboard key to listen for (default: 'Escape')
 * @returns void
 *
 * **Side Effects:**
 * - Adds keyboard event listener on mount
 * - Removes listener on unmount (cleanup)
 * - Re-subscribes if callback changes
 *
 * **Dependencies:** [callback, targetKey]
 *
 * @example
 * useKeyPress(() => setIsOpen(false), 'Escape');
 */
function useKeyPress(callback: () => void, targetKey: string = 'Escape') {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === targetKey) {
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    // Cleanup function removes listener on unmount
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [callback, targetKey]);
}
```

### Hook with Fetching Data

```typescript
/**
 * Fetches data from an API endpoint with loading and error states.
 *
 * @param url - The API endpoint URL to fetch from
 * @param options - Optional fetch options (headers, method, etc.)
 * @returns Object containing {data, loading, error, refetch}
 *   - data: The fetched data (null while loading)
 *   - loading: Boolean indicating fetch in progress
 *   - error: Error object if fetch failed (null on success)
 *   - refetch: Function to manually refetch data
 * @throws Nothing (errors are caught and returned)
 *
 * **Dependencies:** [url, JSON.stringify(options)]
 *
 * **Side Effects:**
 * - Fetches data on mount and when url/options change
 * - Cleans up if component unmounts during fetch
 *
 * @example
 * const { data, loading, error } = useFetch('/api/projects');
 * if (loading) return <Spinner />;
 * if (error) return <ErrorMessage error={error} />;
 * return <ProjectList projects={data} />;
 */
interface UseFetchOptions {
  headers?: Record<string, string>;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: Record<string, any>;
}

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

function useFetch<T = unknown>(
  url: string,
  options?: UseFetchOptions
): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [url, JSON.stringify(options)]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}
```

---

## Type Definitions

### Simple Interface

```typescript
/**
 * User profile information stored in the database.
 */
interface UserProfile {
  /** Unique user identifier */
  id: string;
  /** User's full name */
  name: string;
  /** User's email address (must be unique) */
  email: string;
  /** User's avatar image URL */
  avatar?: string;
  /** Account creation timestamp */
  createdAt: Date;
}
```

### Complex Interface with Nested Types

```typescript
/**
 * Project configuration with build and deployment settings.
 */
interface ProjectConfig {
  /** Basic project metadata */
  metadata: {
    name: string;
    version: string;
    description: string;
  };

  /** Build pipeline settings */
  build: {
    /** Output directory for built files */
    outDir: string;
    /** Whether to minify production builds (default: true) */
    minify?: boolean;
    /** Source map generation settings */
    sourceMaps?: {
      enabled: boolean;
      includeContent?: boolean;
    };
  };

  /** Deployment target configuration */
  deploy?: {
    /** Deployment service provider */
    provider: 'vercel' | 'netlify' | 'aws';
    /** Environment variables for deployment */
    env: Record<string, string>;
    /** Regions to deploy to */
    regions?: string[];
  };
}
```

### Generic Types

```typescript
/**
 * API response wrapper for consistent response format.
 *
 * @typeParam T - The type of data being returned
 */
interface ApiResponse<T> {
  /** HTTP status code */
  status: number;
  /** Response data */
  data: T;
  /** Error message if status indicates failure */
  error?: string;
  /** Timestamp when response was generated */
  timestamp: Date;
}

/**
 * Paginated result set with metadata.
 *
 * @typeParam T - The type of items in the page
 */
interface Paginated<T> {
  /** Array of items for current page */
  items: T[];
  /** Current page number (1-indexed) */
  page: number;
  /** Number of items per page */
  pageSize: number;
  /** Total number of items across all pages */
  total: number;
}
```

---

## Error Handling

### Function with Error Throwing

```typescript
/**
 * Parses a JSON string with comprehensive error handling.
 *
 * @param jsonString - The JSON string to parse
 * @param fallback - Optional default value if parsing fails
 * @returns Parsed JSON object
 * @throws {SyntaxError} If JSON is invalid
 * @throws {Error} If jsonString is null/undefined
 *
 * @example
 * try {
 *   const data = parseJSONSafely('{"name":"John"}');
 *   console.log(data.name); // "John"
 * } catch (error) {
 *   console.error('Failed to parse JSON:', error.message);
 * }
 */
function parseJSONSafely<T = unknown>(jsonString: string | null): T {
  if (!jsonString) {
    throw new Error('JSON string cannot be null or empty');
  }

  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new SyntaxError(`Invalid JSON: ${error.message}`);
    }
    throw error;
  }
}
```

### Try-Catch in Async Function

```typescript
/**
 * Attempts to fetch and process user data with detailed error handling.
 *
 * @param userId - The ID of the user to fetch
 * @returns User data if successful
 * @throws {Error} With specific message based on failure type
 *
 * **Error Cases:**
 * - Network error: "Failed to fetch user"
 * - Invalid response: "Invalid user data received"
 * - Not found: "User not found"
 */
async function fetchUserData(userId: string): Promise<User> {
  try {
    const response = await fetch(`/api/users/${userId}`);

    if (response.status === 404) {
      throw new Error('User not found');
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.id || !data.name) {
      throw new Error('Invalid user data received');
    }

    return data as User;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Failed to fetch user: Network error');
    }
    throw error;
  }
}
```

---

## Async Operations

### Promise-based Function

```typescript
/**
 * Uploads a file to the server and returns the file URL.
 *
 * @param file - The File object to upload
 * @param destination - Where to store the file ('profile' | 'projects', default: 'projects')
 * @returns Promise resolving to the uploaded file URL
 * @throws {Error} If file is too large (> 5MB)
 * @throws {Error} If upload fails
 *
 * **Side Effects:**
 * - Sends multipart/form-data request to /api/upload
 * - Shows progress in console for development
 *
 * @example
 * const url = await uploadFile(imageFile, 'profile');
 * setProfileImage(url);
 */
async function uploadFile(
  file: File,
  destination: 'profile' | 'projects' = 'projects'
): Promise<string> {
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB

  if (file.size > MAX_SIZE) {
    throw new Error(`File too large. Maximum size is 5MB`);
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('destination', destination);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  const { url } = await response.json();
  return url;
}
```

---

## Anti-Patterns to Avoid

### ❌ Missing JSDoc

```typescript
// BAD: No documentation
function calculateDiscount(price, percent) {
  return price * (1 - percent / 100);
}
```

**Fix:**
```typescript
// GOOD: Complete JSDoc
/**
 * Calculates the discounted price.
 *
 * @param price - The original price
 * @param percent - Discount percentage (0-100)
 * @returns The discounted price
 */
function calculateDiscount(price: number, percent: number): number {
  return price * (1 - percent / 100);
}
```

### ❌ Using `any` Type

```typescript
// BAD: Loses type safety
const [state, setState] = useState<any>(null);
const handleClick = (event: any) => {
  console.log(event.target.value);
};
```

**Fix:**
```typescript
// GOOD: Proper typing
interface FormState {
  email: string;
  password: string;
}

const [state, setState] = useState<FormState | null>(null);
const handleClick = (event: React.ChangeEvent<HTMLInputElement>) => {
  console.log(event.target.value);
};
```

### ❌ Missing Hook Dependencies

```typescript
// BAD: callback not in dependencies
function MyComponent() {
  const callback = () => console.log('clicked');

  useEffect(() => {
    window.addEventListener('click', callback);
    return () => window.removeEventListener('click', callback);
  }, []); // ❌ Missing dependency

  return <button>Click</button>;
}
```

**Fix:**
```typescript
// GOOD: All dependencies included
function MyComponent() {
  const callback = useCallback(() => {
    console.log('clicked');
  }, []);

  useEffect(() => {
    window.addEventListener('click', callback);
    return () => window.removeEventListener('click', callback);
  }, [callback]); // ✅ Dependency included

  return <button>Click</button>;
}
```

### ❌ Incomplete Component Documentation

```typescript
// BAD: Props not documented
function Button({ onClick, children, disabled, ...rest }) {
  return <button onClick={onClick} disabled={disabled} {...rest}>{children}</button>;
}
```

**Fix:**
```typescript
// GOOD: Props fully documented
/**
 * A reusable button component.
 *
 * @param onClick - Callback fired when button is clicked
 * @param children - Button label text
 * @param disabled - Whether the button is disabled (default: false)
 * @returns A button element
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Callback fired when button is clicked */
  onClick?: () => void;
  /** Button label text */
  children: React.ReactNode;
  /** Whether the button is disabled (default: false) */
  disabled?: boolean;
}

export function Button({ onClick, children, disabled = false, ...rest }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled} {...rest}>
      {children}
    </button>
  );
}
```

---

## Quick Templates

### Function Template

```typescript
/**
 * [Brief description of what function does].
 *
 * @param [paramName] - [Type and description]
 * @returns [Type and description of return value]
 * @throws {[ErrorType]} [When and why this error is thrown]
 *
 * @example
 * [Example usage code]
 */
function functionName(paramName: Type): ReturnType {
  // Implementation
}
```

### React Component Template

```typescript
/**
 * [Brief description of component purpose].
 *
 * @param [propName] - [Description and default]
 * @returns A [description] element
 *
 * @example
 * <ComponentName prop="value" />
 */
interface ComponentNameProps {
  /** [Prop description] */
  propName: string;
}

export function ComponentName({ propName }: ComponentNameProps) {
  return <div>{propName}</div>;
}
```

### Hook Template

```typescript
/**
 * [Brief description of what hook does].
 *
 * @param [paramName] - [Description]
 * @returns [Description of return value]
 *
 * **Dependencies:** [List dependency array items]
 *
 * @example
 * const [state, setState] = useHookName();
 */
function useHookName(paramName: Type) {
  const [state, setState] = useState<Type>(initialValue);

  useEffect(() => {
    // Effect implementation
  }, [/* dependencies */]);

  return [state, setState] as const;
}
```

### Type/Interface Template

```typescript
/**
 * [Brief description of what this type represents].
 */
interface TypeName {
  /** [Property description] */
  propertyName: string;
}
```

---

## Summary Checklist

Before committing code, verify:

- [ ] **Functions:** Have JSDoc with @param, @returns, and description
- [ ] **Components:** Document props, context usage, and state
- [ ] **Hooks:** Include dependency array explanation
- [ ] **Types:** Have property-level documentation
- [ ] **Error handling:** Document what errors can be thrown
- [ ] **Complex logic:** Include inline comments explaining the "why"
- [ ] **No `any` types:** Use proper type definitions
- [ ] **Examples:** Complex functions include @example usage

For more information, see [CLAUDE.md](../.claude/CLAUDE.md) - the source of truth for documentation standards.

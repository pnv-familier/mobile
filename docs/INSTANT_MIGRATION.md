# Migration Guide: LocalDateTime to Instant

This guide helps you migrate from Java LocalDateTime to Instant timestamps in your React Native app.

## Why Migrate to Instant?

1. **Timezone Safety**: Instant is always UTC, eliminating timezone confusion
2. **Consistency**: All timestamps are in the same timezone (UTC)
3. **Proper Conversion**: Client-side conversion to user's local timezone
4. **Better UX**: Accurate time display regardless of user location

## Backend Changes (Java)

### Before (LocalDateTime)
```java
@Entity
public class Post {
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // This creates timezone issues!
}
```

### After (Instant)
```java
@Entity
public class Post {
    @Column(name = "created_at")
    private Instant createdAt;
    
    // Always UTC, no timezone confusion
}
```

## Frontend Changes (React Native)

### 1. Update Type Definitions

```typescript
// Before
interface Post {
  created_at: string; // LocalDateTime string
}

// After
import { InstantString } from '../types/instant';

interface Post {
  created_at: InstantString; // Instant string (UTC)
}
```

### 2. Update Date Formatting

```typescript
// Before (problematic)
import { formatTimestamp } from '../utils/formatTimestamp';

const PostCard = ({ post }) => (
  <Text>{formatTimestamp(post.created_at)}</Text>
);

// After (correct)
import { formatInstantRelative } from '../utils/instantUtils';

const PostCard = ({ post }) => (
  <Text>{formatInstantRelative(post.created_at)}</Text>
);
```

### 3. Available Format Functions

```typescript
import {
  formatInstantTime,      // "2:30 PM" or "14:30"
  formatInstantDate,      // "Today", "Yesterday", "Mar 15"
  formatInstantRelative,  // "2m ago", "1h ago", "Yesterday"
  formatInstantFull,      // "Mar 15, 2024 at 2:30 PM"
  formatInstantDetailed,  // "March 15, 2024 at 2:30 PM GMT+7"
  isInstantToday,         // boolean
  isInstantRecent,        // boolean (within N minutes)
} from '../utils/instantUtils';

// Usage examples
const timestamp = "2024-03-15T11:20:20.850Z"; // Backend Instant

console.log(formatInstantTime(timestamp));      // "6:20 PM" (in user's timezone)
console.log(formatInstantDate(timestamp));      // "Today" or "Mar 15"
console.log(formatInstantRelative(timestamp));  // "2h ago"
console.log(formatInstantFull(timestamp));      // "Mar 15, 2024 at 6:20 PM"
console.log(isInstantToday(timestamp));         // true/false
console.log(isInstantRecent(timestamp, 30));    // true if within 30 minutes
```

### 4. Creating New Timestamps

```typescript
import { nowInstant, toInstant } from '../utils/instantUtils';

// Get current time as Instant
const now = nowInstant(); // "2024-03-15T11:20:20.850Z"

// Convert Date to Instant
const date = new Date();
const instant = toInstant(date); // "2024-03-15T11:20:20.850Z"

// Send to backend
const createPost = async (content: string) => {
  await api.post('/posts', {
    content,
    created_at: nowInstant() // Backend expects Instant
  });
};
```

## Migration Checklist

### Backend (Java)
- [ ] Change `LocalDateTime` fields to `Instant`
- [ ] Update database columns if needed
- [ ] Ensure all timestamps are stored in UTC
- [ ] Update API responses to return Instant strings

### Frontend (React Native)
- [ ] Update type definitions to use `InstantString`
- [ ] Replace old date formatting functions
- [ ] Use new `instantUtils` functions
- [ ] Test timezone conversion in different timezones
- [ ] Update tests to use Instant format

## Common Patterns

### Chat Messages
```typescript
// Before
const formatChatTime = (timestamp: string) => {
  // Unreliable timezone handling
  return new Date(timestamp).toLocaleTimeString();
};

// After
import { formatInstantTime } from '../utils/instantUtils';

const formatChatTime = (timestamp: InstantString) => {
  return formatInstantTime(timestamp, { use24Hour: true });
};
```

### Post Timestamps
```typescript
// Before
const PostCard = ({ post }) => (
  <Text>{new Date(post.created_at).toLocaleDateString()}</Text>
);

// After
import { formatInstantRelative } from '../utils/instantUtils';

const PostCard = ({ post }) => (
  <Text>{formatInstantRelative(post.created_at)}</Text>
);
```

### Event Scheduling
```typescript
// Before (timezone issues)
const createEvent = (title: string, dateTime: string) => {
  return api.post('/events', {
    title,
    scheduled_at: dateTime // Ambiguous timezone
  });
};

// After (clear UTC)
import { toInstant } from '../utils/instantUtils';

const createEvent = (title: string, localDate: Date) => {
  return api.post('/events', {
    title,
    scheduled_at: toInstant(localDate) // Clear UTC Instant
  });
};
```

## Testing

```typescript
// Test with different timezones
describe('Instant formatting', () => {
  const testInstant = "2024-03-15T11:20:20.850Z";
  
  it('should format time correctly', () => {
    const result = formatInstantTime(testInstant);
    expect(result).toMatch(/^\d{1,2}:\d{2} (AM|PM)$/);
  });
  
  it('should handle relative time', () => {
    const now = nowInstant();
    const result = formatInstantRelative(now);
    expect(result).toBe('Just now');
  });
});
```

## Benefits After Migration

1. **No Timezone Bugs**: All timestamps are UTC, converted locally
2. **Consistent Display**: Same data shows correctly worldwide
3. **Better UX**: Relative times ("2m ago") are more user-friendly
4. **Type Safety**: `InstantString` type prevents errors
5. **Future Proof**: Easy to add new formatting options

## Troubleshooting

### Issue: Times showing incorrectly
**Solution**: Ensure backend sends proper Instant format with 'Z' suffix

### Issue: TypeScript errors
**Solution**: Update imports to use new `instantUtils` functions

### Issue: Tests failing
**Solution**: Update test data to use proper Instant format

### Issue: Performance concerns
**Solution**: Instant parsing is lightweight, no performance impact
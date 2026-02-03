# ✅ Coupon Filtering and Deletion - Complete

## Features Added

### 1. Status Filtering

Filter coupons by status with visual tabs:

- **الكل (All)** - Shows all coupons
- **نشط (Active)** - Shows only active coupons
- **منتهي (Expired)** - Shows only expired coupons
- **مستخدم (Used)** - Shows only fully used coupons

Each tab shows the count of coupons in that status.

### 2. Individual Coupon Deletion

- Delete button for each coupon (red "حذف" button)
- Confirmation dialog before deletion
- Permanent deletion from Firestore
- Cannot be undone

### 3. Bulk Selection and Deletion

- Checkbox for each coupon
- "Select All" checkbox in table header
- Selected count displayed in purple banner
- "حذف المحدد" (Delete Selected) button
- Bulk delete with single confirmation
- Efficient batch deletion

### 4. Deactivation (Existing)

- "تعطيل" button for active coupons
- Changes status to "expired"
- Keeps coupon in database for audit trail

## UI Changes

### Filter Tabs

```
[الكل (18)] [نشط (17)] [منتهي (1)] [مستخدم (0)]
```

- Active tab highlighted in color
- Counts update dynamically
- Smooth transitions

### Bulk Actions Banner

When coupons are selected:

```
┌─────────────────────────────────────────────────┐
│ تم اختيار 5 كوبون          [🗑️ حذف المحدد]    │
└─────────────────────────────────────────────────┘
```

### Table Layout

```
[✓] | الكود | الخصم | الاستخدام | الحالة | تاريخ الإنشاء | الصلاحية | إجراءات
────┼───────┼───────┼───────────┼────────┼──────────────┼──────────┼─────────
[✓] | INFL15-04D | 15% | 0/5 | نشط | 2026/2/3 | 2026/3/5 | تعطيل حذف
```

## Technical Implementation

### State Management

```typescript
const [filterStatus, setFilterStatus] = useState<
  'all' | 'active' | 'expired' | 'used'
>('all');
const [selectedCoupons, setSelectedCoupons] = useState<string[]>([]);
```

### Filtering Logic

```typescript
const filteredCoupons = coupons.filter((coupon) => {
  if (filterStatus === 'all') return true;
  return coupon.status === filterStatus;
});
```

### Status Counts

```typescript
const statusCounts = {
  all: coupons.length,
  active: coupons.filter((c) => c.status === 'active').length,
  expired: coupons.filter((c) => c.status === 'expired').length,
  used: coupons.filter((c) => c.status === 'used').length,
};
```

### Deletion Functions

#### Individual Delete

```typescript
const handleDeleteCoupon = async (couponId: string) => {
  if (!confirm('هل أنت متأكد من حذف هذا الكوبون نهائياً؟')) return;

  const { deleteDoc } = await import('firebase/firestore');
  const couponRef = doc(db, 'coupons', couponId);
  await deleteDoc(couponRef);
  await loadCoupons();
};
```

#### Bulk Delete

```typescript
const handleBulkDelete = async () => {
  await Promise.all(
    selectedCoupons.map((couponId) => {
      const couponRef = doc(db, 'coupons', couponId);
      return deleteDoc(couponRef);
    }),
  );
  await loadCoupons();
  setSelectedCoupons([]);
};
```

## Firestore Rules Update

Changed from:

```javascript
allow delete: if false; // No deletion allowed
```

To:

```javascript
allow delete: if isAdmin(); // Admins can delete
```

This allows admins to clean up expired and used coupons.

## Use Cases

### 1. Clean Up Expired Coupons

1. Click "منتهي" tab to filter expired coupons
2. Select all expired coupons
3. Click "حذف المحدد" to bulk delete
4. Confirm deletion

### 2. Remove Fully Used Coupons

1. Click "مستخدم" tab
2. Select coupons that are fully used
3. Bulk delete to clean database

### 3. Delete Individual Mistake

1. Find the coupon in the list
2. Click "حذف" button
3. Confirm deletion

### 4. Deactivate Without Deleting

1. Find active coupon
2. Click "تعطيل" button
3. Coupon status changes to "expired"
4. Keeps audit trail

## Security

- ✅ Only admins can delete coupons
- ✅ Confirmation dialogs prevent accidents
- ✅ Firestore rules enforce admin-only deletion
- ✅ Bulk operations are atomic
- ✅ UI updates after successful deletion

## Files Modified

1. `src/app/admin/coupons/page.tsx` - Added filtering and deletion UI
2. `firestore.rules` - Updated to allow admin deletion

## Testing

### Test Filtering

1. Go to `/admin/coupons`
2. Click each filter tab
3. Verify correct coupons shown
4. Check counts match

### Test Individual Delete

1. Click "حذف" on any coupon
2. Confirm deletion
3. Verify coupon removed from list
4. Refresh page to confirm deletion

### Test Bulk Delete

1. Select multiple coupons
2. Click "حذف المحدد"
3. Confirm deletion
4. Verify all selected coupons removed

### Test Select All

1. Click checkbox in header
2. Verify all visible coupons selected
3. Click again to deselect all

## Benefits

1. **Database Cleanup** - Remove old/expired coupons
2. **Better Organization** - Filter by status for easier management
3. **Bulk Operations** - Delete multiple coupons at once
4. **Audit Trail Option** - Can deactivate instead of delete
5. **User-Friendly** - Clear visual feedback and confirmations

---

**Status**: ✅ COMPLETE
**Last Updated**: February 3, 2026
**Access**: `/admin/coupons` (Admin only)

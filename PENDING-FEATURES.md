# Pending Features - To Be Implemented

This document tracks features that have been designed or partially implemented but are not yet functional.

## 1. Petition Pinning (Paid Feature)

**Status**: Spec completed, not implemented  
**Priority**: Medium  
**Spec Location**: `.kiro/specs/petition-pinning/`

### Description

Allow petition creators to pay to pin their petitions to the top of the home page for increased visibility.

### Features

- Pricing tiers: 99-599 MAD for 3-30 days
- Stripe payment integration
- Admin dashboard for managing pinned petitions
- Automatic expiration handling
- Visual indicators for pinned petitions

### Implementation Files Needed

- Payment flow component
- Admin management interface
- Firestore schema updates
- Cron job for expiration handling

---

## 2. Download Account Data

**Status**: UI placeholder only, not functional  
**Priority**: Low (GDPR compliance feature)  
**Location**: Profile page → Preferences tab

### Description

Allow users to export their account data in compliance with data privacy regulations.

### Features Needed

- Fetch all user data from Firestore:
  - Profile information (name, email, phone, bio)
  - Created petitions
  - Signed petitions
  - Comments and updates
  - Account metadata (creation date, verification status)
- Format data as JSON or CSV
- Trigger browser download
- Add loading state during export

### Implementation Notes

- Should include all personal data stored in the system
- Consider adding email delivery option for large datasets
- Add rate limiting to prevent abuse

---

## 3. Delete Account

**Status**: UI placeholder only, not functional  
**Priority**: Medium (GDPR compliance feature)  
**Location**: Profile page → Preferences tab

### Description

Allow users to permanently delete their account and all associated data.

### Features Needed

- Confirmation dialog with warning
- Password re-authentication for security
- Delete user data from:
  - Firestore users collection
  - Firebase Authentication
  - Storage (profile images)
  - All created petitions (or transfer ownership)
  - All signatures
  - All comments
- Audit log entry
- Email confirmation after deletion
- Grace period option (soft delete for 30 days)

### Implementation Notes

- Consider GDPR "right to be forgotten" requirements
- Handle edge cases:
  - What happens to petitions with signatures?
  - Should petitions be deleted or anonymized?
  - Handle payment history retention for legal compliance

---

## 4. Petition Report/PDF Generation ❓

**Status**: NOT IN ORIGINAL SPECS - Needs User Confirmation  
**Priority**: Unknown (requires clarification)  
**Mentioned By**: User in context transfer

### User Description

Feature to generate a downloadable PDF report for petition creators containing:

- Petition details (title, description, category)
- Creation date and running duration
- Tier information
- Publisher/creator details
- Petition reference code/ID
- Number of signatures
- Number of comments
- Share statistics (Facebook, Instagram, WhatsApp, etc.)

### Purpose

Allow creators to send an official report to the petition addressee when the petition is finished.

### Current Status

- ❌ **NOT found in original specs** (requirements.md, design.md, tasks.md)
- ❌ Not implemented in codebase
- ❌ No UI elements exist for this feature
- ❓ Needs confirmation if this should be added

### Questions to Resolve

1. Is this a new feature request or was it in a different document?
2. What tier should have access to this feature? (Free, Basic, Premium, Enterprise?)
3. Should share statistics be tracked? (Currently not tracked in the system)
4. What PDF library should be used? (jsPDF, PDFKit, react-pdf?)
5. Should this be a one-time download or available anytime?

### If Approved - Implementation Required

1. **Spec Creation**: Create full spec with requirements and design
2. **Data Collection**: Ensure all required data is available
3. **Share Tracking**: Implement share statistics tracking (if not exists)
4. **PDF Generation**: Choose and integrate PDF library
5. **UI Integration**: Add download button to petition management
6. **Tier Restrictions**: Implement tier-based access control
7. **Template Design**: Create professional PDF template
8. **Testing**: Test PDF generation with various petition types

---

## 5. Story Builder (Premium Feature)

**Status**: Concept approved, not implemented  
**Priority**: High (Post-MVP)  
**Tier**: Premium/Enterprise only (competitive advantage)

### Description

Allow petition creators to build engaging narratives by alternating text blocks, images, and videos in a sequential story format - similar to Medium or modern blog posts.

### Features

- **Simple Block System**:
  - [+ Add Text Block] button
  - [+ Add Image] button
  - [+ Add Video] button
- Blocks appear in order they're added (no drag-and-drop complexity)
- Each block has a delete (X) button
- Natural story flow: text → image → text → image → video

### Data Structure

```typescript
contentBlocks: [
  { id: '1', type: 'text', content: 'Introduction...' },
  { id: '2', type: 'image', url: 'https://...', caption: 'Optional' },
  { id: '3', type: 'text', content: 'Explanation...' },
  { id: '4', type: 'video', url: 'youtube.com/...' },
];
```

### Tier Restrictions

- **Free**: Not available (or 1 image block max)
- **Basic/Standard**: Not available
- **Premium**: Available with 5 image blocks
- **Enterprise**: Available with 10 image blocks

### Benefits

- More engaging petitions
- Professional storytelling
- Better visual hierarchy
- Competitive advantage over other platforms
- Justifies premium pricing

### Implementation Notes

- Merge Step 2 (Content) + Step 3 (Media) into one "Story Builder" step
- Backward compatibility: Convert old petitions to blocks on read
- Mobile-friendly (no complex interactions)
- Works with existing tier-based image limits

---

## 6. Image Lightbox Gallery (Premium Feature)

**Status**: Concept approved, not implemented  
**Priority**: Medium (Post-MVP)  
**Tier**: Premium/Enterprise only

### Description

Professional image gallery with lightbox overlay for viewing full-size images - similar to Airbnb, real estate sites, or e-commerce product galleries.

### Features

**Basic Version (Implemented First)**:

- Main image displayed large
- Thumbnail strip below (horizontal scroll)
- Click thumbnail → swaps main image
- Selected thumbnail highlighted with ring
- Smooth transitions

**Premium Lightbox Version**:

- Click main image → opens fullscreen lightbox overlay
- Previous/Next navigation arrows
- Image counter (1/5)
- Zoom in/out functionality
- ESC key or X button to close
- Click outside to close
- Keyboard navigation (arrow keys)

### Visual Layout

```
┌─────────────────────────────────┐
│                                 │
│     MAIN IMAGE (large)          │
│                                 │
└─────────────────────────────────┘
┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐
│ 1  │ │ 2  │ │ 3  │ │ 4  │ │ 5  │
└────┘ └────┘ └────┘ └────┘ └────┘
  ↑ Selected (green ring)
```

### Tier Restrictions

- **Free**: Single image only (no gallery)
- **Basic/Standard**: Basic gallery (main + thumbnails, no lightbox)
- **Premium/Enterprise**: Full lightbox with zoom and navigation

### Benefits

- Professional appearance
- Better image viewing experience
- Makes multi-image petitions more valuable
- Justifies premium tier pricing
- Mobile-friendly

### Implementation Notes

- Start with basic version (main + thumbnails)
- Add lightbox as premium feature later
- Use lightweight library or custom implementation
- Ensure accessibility (keyboard navigation, screen readers)
- Lazy load images for performance

---

## 8. Social Media Profile Integration (Influencer Feature)

**Status**: Concept approved, not implemented  
**Priority**: Medium (Phase 2 - Post-MVP)  
**Tier**: Influencer program enhancement

### Description

Automatically fetch and display social media profile data (profile picture, follower count, username) when influencers provide their social media URL during petition creation.

### Features

**Profile Data Fetching**:

- Profile picture/avatar
- Username/handle
- Follower/subscriber count
- Platform verification status
- Account name/display name

**Display Components**:

- Horizontal influencer card in petition creation form
- Rich influencer badge on published petitions
- Verification indicators
- Real-time follower count updates

### Supported Platforms

- Instagram (requires Business API)
- TikTok (limited public API)
- YouTube (requires API key)
- Twitter/X (paid API tiers)
- Facebook (Graph API)

### Technical Challenges

**API Complexity**:

- Multiple OAuth flows for each platform
- Rate limiting and quota management
- Different data formats per platform
- Authentication token management
- Error handling for API failures

**Data Privacy**:

- Some platforms restrict public data access
- GDPR compliance for stored profile data
- User consent for data fetching
- Data retention policies

**Cost Considerations**:

- Paid API tiers for some platforms
- Server resources for API calls
- Data storage costs
- Real-time update infrastructure

### Implementation Phases

**Phase 1 (Current - MVP)**:

- ✅ Collect social media URL manually
- ✅ Manual verification by admin if needed
- ✅ Focus on core petition functionality

**Phase 2 (Future Enhancement)**:

- 🔮 Implement social media API integrations
- 🔮 Automatic profile data fetching
- 🔮 Rich influencer cards
- 🔮 Real-time follower count updates
- 🔮 Verification badges

### Benefits

**For Platform**:

- Automatic influencer verification
- Rich influencer profiles on petitions
- Better analytics and insights
- Enhanced credibility
- Competitive advantage

**For Influencers**:

- Professional presentation
- Automatic follower count display
- Verification badges
- Enhanced credibility
- Better engagement

### UI/UX Mockup

```
┌─────────────────────────────────────────────────┐
│ 📱 Instagram Profile Detected                   │
├─────────────────────────────────────────────────┤
│ [🖼️]  @username                    ✅ Verified │
│        Real Name                                │
│        👥 1.2M followers                        │
│                                    [🔄 Refresh] │
└─────────────────────────────────────────────────┘
```

### Implementation Notes

- Start with one platform (Instagram or YouTube)
- Use webhook subscriptions for real-time updates
- Implement caching to reduce API calls
- Add fallback for API failures
- Consider using third-party services (RapidAPI, etc.)
- Ensure mobile responsiveness

---

## 9. Future Features (Not Yet Specified)

### Potential Additions

- Email notifications for petition updates
- Push notifications (PWA already configured)
- Social media sharing improvements
- Petition analytics dashboard
- Bulk signature import
- Petition templates
- Multi-language petition content
- Petition categories/tags filtering
- Advanced search functionality
- Image captions/descriptions
- Video thumbnails and previews
- Petition scheduling (publish at specific time)
- A/B testing for petition titles

---

## Notes

- Features are listed in order of current priority
- Specs should be created before implementation
- All features should include translation support (AR/FR/EN)
- Consider mobile responsiveness for all new features
- Add proper error handling and loading states
- **Petition Report feature was NOT in original specs** - awaiting user confirmation

---

**Last Updated**: January 31, 2026

Add advanced features (e.g., CRM integration, PDF certification, campaign boost features). This helps justify the jump in price.
widget to embed the petition in the creator website

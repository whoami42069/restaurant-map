# Restaurant Map - Phase 3: Bug Fixes & Data Enhancement

## Current Issues Identified

### Issue 1: Page Not Scrollable (CRITICAL)
**Root Cause:** `app/globals.css:50` - `overflow: hidden` on body blocks all scrolling

### Issue 2: Missing Chef Data
**Current State:** Only `chef.name` exists in JSON
**Missing Fields:**
- `chef.photo` - Profile photos
- `chef.background` - Biographical info
- `chef.otherRestaurants[]` - Other restaurants
- `signatureDishes[]` - Signature dishes
- `pastryChef` - Pastry chef name

### Issue 3: UI/UX Bugs (51 identified)

| Category | Count | Priority |
|----------|-------|----------|
| Mobile Positioning | 8 | HIGH |
| Z-Index Conflicts | 11 | HIGH |
| Responsive Layout | 10 | HIGH |
| Theme Compatibility | 10 | MEDIUM |
| Visual Polish | 7 | LOW |
| Content Truncation | 5 | MEDIUM |

---

## Implementation Plan

### Track 1: Critical Fixes

#### 1.1 Fix Scrolling Issue
**File:** `app/globals.css:50`
```css
/* REMOVE overflow: hidden from body */
```

#### 1.2 Fix Mobile Positioning
**Files to modify:**
- `app/components/Map/CompareFloatingButton.tsx:16` → `bottom-24 md:bottom-4`
- `app/components/Map/LocationButton.tsx:17` → `bottom-28 md:bottom-24`
- `app/page.tsx:27` → Ensure `pb-24` on mobile

#### 1.3 Fix Z-Index Hierarchy
```
z-[100]  - Base map controls (LocationButton, MapStyleSelector)
z-[200]  - Floating buttons (CompareFloatingButton)
z-[500]  - Sidebar
z-[600]  - Sidebar toggle
z-[1000] - Navigation (TopNav, BottomNav)
z-[1100] - Panels (RestaurantDetail)
z-[1200] - Overlays (BottomSheet backdrop)
z-[1300] - Modals (BottomSheet content)
z-[2000] - Lightbox (ImageGallery)
```

---

### Track 2: Chef Data Scraping (PARALLEL)

**Source:** https://www.theworlds50best.com/list/1-50

**For each of 50 restaurants, extract:**
- Chef Summary (bio, training, philosophy)
- Chef-Restaurant Relation (how they founded/joined)
- `chef.photo` - URL to chef image
- `chef.background` - 2-3 sentence bio
- `chef.otherRestaurants[]` - Other venues
- `signatureDishes[]` - 3-5 signature dishes
- `pastryChef` - Name if applicable
- **`applicantTips[]`** - 3-5 bullet points for job seekers

#### Applicant Tips Examples:
- Cuisine style focus (e.g., "Master Japanese-Peruvian fusion techniques")
- Service philosophy (e.g., "Embrace informal fine dining approach")
- Key skills needed (e.g., "Experience with fermentation and local ingredients")
- Cultural fit (e.g., "Team collaboration and creativity valued")
- Training background (e.g., "Experience at multi-Michelin star venues preferred")

---

### Track 3: Responsive Fixes

**Files to modify:**
- `app/awards/page.tsx:148` - Fix award grid on mobile
- `app/analytics/page.tsx:123` - Add `sm:grid-cols-3`
- `app/compare/page.tsx:93` - Add `sm:grid-cols-2`
- `app/components/Cards/RestaurantDetail.tsx:105` → `w-full md:w-[420px]`

---

## Files to Modify

| File | Changes |
|------|---------|
| `app/globals.css` | Remove `overflow: hidden`, add safe-area |
| `app/types/restaurant.ts` | Add `applicantTips`, `relationToRestaurant` |
| `app/components/Map/CompareFloatingButton.tsx` | Fix bottom positioning |
| `app/components/Map/LocationButton.tsx` | Fix bottom positioning |
| `app/components/Layout/BottomNav.tsx` | Fix safe-area-inset |
| `app/components/Cards/RestaurantDetail.tsx` | Responsive width, applicant tips |
| `app/components/Restaurant/ChefTab.tsx` | Chef-restaurant relation |
| `app/components/UI/BottomSheet.tsx` | Fix z-index |
| `app/components/UI/ImageGallery.tsx` | Standardize z-index |
| `app/awards/page.tsx` | Fix grid columns |
| `app/analytics/page.tsx` | Fix grid columns |
| `app/compare/page.tsx` | Fix grid columns |
| `public/data/restaurants.json` | Add chef data + applicant tips |

---

## New TypeScript Fields

```typescript
export interface ChefProfile {
  name: string;
  photo?: string;
  background?: string;
  otherRestaurants?: string[];
  relationToRestaurant?: string;
}

export interface Restaurant {
  // ... existing fields
  applicantTips?: string[];  // 3-5 bullet points for job seekers
}
```

---

## User Decisions

| Question | Decision |
|----------|----------|
| Chef Data Source | Scrape from World's 50 Best |
| Priority | Do both in parallel |
| Light Theme | Skip - dark theme only |

# 🎯 Theme Button Locations

## For Students

### Location: Student Profile Page
**Path**: `/profile`

**Steps to Access**:
1. Login as a student
2. Click on **Profile** in the navbar
3. Scroll down to the **Preferences** section
4. You'll see two buttons: **Dark** and **Light**

**Visual Location**:
```
┌─────────────────────────────────────┐
│  Student Profile                     │
├─────────────────────────────────────┤
│  [Avatar] John Doe                   │
│           Student                    │
├─────────────────────────────────────┤
│  Profile Information                 │
│  ├─ Full Name: John Doe             │
│  ├─ Email: john@example.com         │
│  └─ Enrollment: 12345               │
├─────────────────────────────────────┤
│  Security                            │
│  └─ Password: ••••••••              │
├─────────────────────────────────────┤
│  Preferences                         │
│  └─ Theme                           │
│     ┌──────┐  ┌──────┐             │
│     │ Dark │  │Light │  ← HERE!    │
│     └──────┘  └──────┘             │
├─────────────────────────────────────┤
│  [Logout Button]                     │
└─────────────────────────────────────┘
```

## For Teachers

### Location: Navbar Profile Modal
**Access**: Click profile icon in navbar

**Steps to Access**:
1. Login as a teacher
2. Click on **Profile** button in the navbar (top right)
3. A modal will appear
4. Scroll to the **Theme** section
5. You'll see two buttons: **Dark** and **Light**

**Visual Location**:
```
Navbar:
┌────────────────────────────────────────────┐
│ 🎓 AI Viva    Dashboard  Resources  [👤]  │ ← Click here
└────────────────────────────────────────────┘
                                      ↓
                            ┌──────────────────┐
                            │  Profile Modal   │
                            ├──────────────────┤
                            │   [Avatar]       │
                            │   Teacher Name   │
                            │   Teacher        │
                            ├──────────────────┤
                            │ 📧 Email         │
                            │ 🆔 Enrollment    │
                            ├──────────────────┤
                            │ Theme            │
                            │ ┌────┐  ┌─────┐ │
                            │ │Dark│  │Light│ │ ← HERE!
                            │ └────┘  └─────┘ │
                            ├──────────────────┤
                            │ [Logout Button]  │
                            └──────────────────┘
```

## Theme Button Behavior

### Active State
- The currently selected theme button will have:
  - Gradient background (blue to purple)
  - White text
  - Bold font weight

### Inactive State
- Non-selected button will have:
  - Light transparent background
  - Gray text
  - Normal font weight

### Example
```
When Dark theme is active:
┌──────────┐  ┌──────┐
│   Dark   │  │ Light│
│ (Active) │  │      │
└──────────┘  └──────┘

When Light theme is active:
┌──────┐  ┌──────────┐
│ Dark │  │  Light   │
│      │  │ (Active) │
└──────┘  └──────────┘
```

## Automatic Features

### ✅ Persistence
- Your theme choice is automatically saved
- Persists across page refreshes
- Syncs across all pages

### ✅ Instant Apply
- Theme changes apply immediately
- No page reload required
- Smooth visual transition

### ✅ Global Effect
- Affects all pages in the application
- Consistent experience throughout
- All components themed properly

## Testing the Theme

### Quick Test Steps
1. Switch to Light theme
2. Navigate to different pages:
   - Home page
   - Dashboard
   - Class overview
   - Viva test page
3. Verify all pages show light theme
4. Refresh the page
5. Verify theme persists

### What to Look For
- ✅ White/light backgrounds
- ✅ Blue accent colors
- ✅ Dark text on light backgrounds
- ✅ Clean shadows and borders
- ✅ Readable text everywhere
- ✅ Proper button colors
- ✅ Modal backgrounds are light
- ✅ Tables and cards are light

## Troubleshooting

### Theme Not Changing?
1. Clear browser cache
2. Check browser console for errors
3. Verify localStorage is enabled
4. Try in incognito/private mode

### Theme Not Persisting?
1. Check if cookies/localStorage are blocked
2. Verify browser settings allow local storage
3. Try a different browser

### Some Elements Still Dark?
1. Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
2. Clear browser cache
3. Report the specific component/page

## Support
If you encounter any issues with the theme switcher, please report them with:
- Browser name and version
- Page where issue occurs
- Screenshot if possible
- Steps to reproduce

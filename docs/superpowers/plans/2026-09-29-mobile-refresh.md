# Mobile layout refresh

Approved scope: all mobile routes, loading with subject imagery rather than a text pill, and landscape behavior.

Use a single final mobile CSS contract to replace conflicting min-heights and tray rules. Respect safe areas and viewport height, horizontal icon trays and accessible touch controls. Keep 3D orbit independent of native orientation. Attempt landscape fullscreen on the first explicit world/animal selection when supported; provide a retry/exit control and retain usable portrait layout on unsupported browsers. No CSS rotation or forced reload.

Loading is indeterminate, with the selected subject image and animated ring, accessible status and real retry behavior. Do not invent progress percentages. Stale requests must not alter the current route.

Check portrait 360x640/390x844, landscape 844x390/667x375, resize in place, image and model routes, delayed loads, failures and back navigation.

## Updated direction: mandatory landscape

The user clarified that portrait gameplay is not wanted. Touch devices must display a blocking orientation gate in portrait on initial entry and when rotating back. Gate includes an animated phone cue, start/fullscreen action, and physical-rotation fallback. Background navigation is inert. Optimize actual gameplay for landscape, retain subject-image loading and retry, and remove settings buttons/dialog everywhere. Test direct links, denied orientation/fullscreen, reorientation, mobile trays and desktop regression.

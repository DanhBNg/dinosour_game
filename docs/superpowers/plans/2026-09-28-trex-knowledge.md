# T-Rex visual knowledge pilot

Approved scope: only T-Rex. Profile has exactly seven icons: one animated model entry and six visual topics (habitat, food, footprints, size, growth, range). Other species stay on the published legacy interface.

Implementation: knowledge.js owns topic data, accessible SVG symbols, narration and selection states. knowledge.css owns layout. app.js routes profile/topic/learn and moves all twelve action buttons into the learning page's frosted tray with previous/next scroll controls. scene.js adds a low sandstone/olive pedestal below ground zero; habitat PNG is a static CSS backdrop behind the alpha renderer.

Generation: six separate built-in imagegen assets, no generated labels. Habitat image doubles as stage background. Size and growth remain fully visible, with selectable comparison/stage buttons. Notes and sources are optional. Voice uses vi-VN for explanations; English lessons unchanged.

Validation: seven icons, six decoded topic images, topic deep-link refresh, controls and selection states, all twelve actions, scroll arrows, pedestal, child speech/replay, legacy species, desktop/mobile. Initial knowledge test fails because the old page lacks the seven-icon hub.

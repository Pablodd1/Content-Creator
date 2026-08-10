const fs = require('fs');
let code = fs.readFileSync('src/components/VideoGenerator.tsx', 'utf8');

// The collections
code = code.replace(
  "id: 'pvc_metallic', \n    nameES: 'Papel Tapiz PVC Metálico de Lujo', \n    nameEN: 'Luxury Metallic Foil PVC Wallpaper'",
  "id: 'ev_charger_demo', \n    nameES: 'Demo Interfaz EV Charger', \n    nameEN: 'EV Charger Interface Demo'"
);

// We'll just replace "PVC" with "EV" in some general places.
// Let's replace the visual banner text
code = code.replace(
  "Cree animaciones de texturas hiperrealistas de papel tapiz PVC de alta calidad con Runway Gen-4.5",
  "Cree animaciones hiperrealistas del monitor de estaciones de carga eléctrica con Runway Gen-4.5"
);
code = code.replace(
  "Generate hyper-realistic textured wallpaper animations with Runway Gen-4.5",
  "Generate hyper-realistic EV charger monitor animations with Runway Gen-4.5"
);

// Replace "Revestimientos de Papel Tapiz PVC y WPC de Lujo" with "Electric Charger Monitor Locator"
code = code.replace(/Revestimientos de Papel Tapiz PVC y WPC de Lujo/g, 'Electric Charger Monitor Locator');
code = code.replace(/Luxury PVC & WPC Wall Cladding/g, 'Electric Charger Monitor Locator');

fs.writeFileSync('src/components/VideoGenerator.tsx', code);

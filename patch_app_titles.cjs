const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace('<option>Panel WPC & Tapiz 3D</option>', '<option>Electric Charger Monitor</option>');
code = code.replace('<option>Luxury Decking & Mármol</option>', '<option>EV Locator Colombia</option>');

// Update the placeholder text inside the Copies UI
code = code.replace(
  /Dale a tus espacios el cambio que merecen con Panel WPC\.<br\/>.*?#ParedesModernas/s,
  `Boost your EV charging station visibility with our Monitor Locator in Colombia!<br/>
   Fast, dynamic, and efficient locator helping thousands of users every day. ✨<br/><br/>
   #EVCharging #Colombia #ElectricVehicles`
);

fs.writeFileSync('src/App.tsx', code);

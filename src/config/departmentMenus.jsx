// src/config/menus/departmentMenus.js
import adminMenu from "./menus/adminMenu";
import pharmacyMenu from "./menus/pharmacyMenu";
import labMenu from "./menus/labMenu";
import recordsMenu from "./menus/recordsMenu";
import claimsMenu from "./menus/claimsMenu";
import consultationMenu from "./menus/consultationMenu";
import informationManagerMenu from './menus/informationManagerMenu'
import maternityMenu from "./menus/maternityMenu";
import wardMenu from "./menus/wardMenu";
import surgeryMenu from "./menus/surgeryMenu";
import opdMenu from "./menus/opdMenu";
import storeMenu from "./menus/storeMenu";
import clerkMenu from "./menus/clerkMenu";
// Add more department menus here...

const departmentMenus = {
  Admin: adminMenu,
  Pharmacy: pharmacyMenu,
  Lab: labMenu,
  Records: recordsMenu, // Alias for Lab,
  Claims: claimsMenu,
  Consultation: consultationMenu,
  "Information Manager": informationManagerMenu,
  "Antenatal Care (ANC)": maternityMenu,
  Surgery: surgeryMenu,
  Ward: wardMenu,
  OPD: opdMenu,
  Store: storeMenu,
  Clerk:clerkMenu
};

export default departmentMenus;

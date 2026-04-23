# Emerald cleaning system VC

\-az alkalmazas celja hogy tudjuk kovetni, hogy melyik takarittono melyik szobat takaritotta es mikor vegzett a takarittasal
\-lehessen szobakat a beallitasokban letrehozni
\-lehessen regisztralni takarittonoket username es pin
\-a felhasznalo tipusok: admin, menedzser, takaritto
\-az admin mindent lat
\-a menedzser latja melyik szoba volt utoljara takaritva, megtudja nezni melyik takarittono takaritotta a szobat es mikor
\-a takarittono latja az osszes szobat es hogy volt e es kell e takatittani
\-a szobaknak legyen meghatarozva
\-a szobaknak legyen individualis task listaja (peldaul, furdoszoba, haloszoba...)
\-a szobak listajat lehessen klonozni

megjelenittesek:
attekintes dashboard
\-osszes szoba listaja, mikor kell takarittani ha kell takarittani mar es nem volt takaritva narancsal jelezze, ha takaritani kell es takaritva volt jelezze zoldel, ha a napi deadline utan van akkor vorossel
\-takarittonok listaja, mikor jegyzett be valamit
\-express takarittas gomb - ami egy felugro ablakban betud irni gyors takarittast ahol kivalasztja melyik szobat melyik nap kell kitakarittani (default nap a beiras napja)

takarittonok listaja
\-uj takaritto letrehozasa
\-a takarittono reszletek (slideoutban) ahol latom az aktivitasat, tudok valtoztatni pint
\-takarittono deaktivalasa
\-letrehozni tud admin es menedzser

szobak listaja
\-szobak helyszine, neve, utolso takarittas (mikor es ki), szerkesztes
\-szerkesztesre kattintva a szoba feladatlistaja
\-deadline - hany oraig kell a takarittas napjan kitakarittani
\-letrehozni tud admin es menedzser

takarittasok listaja
\-lehessen letrehozni uj takarittast ahol meghararozzak melyik nap, melyik szobat kell takarittani
\-takarittasra kattintva lehessen latni, hogy milyen statuszba van (kitakaritva, takarittasra var) es ha ki lett takaritva, melyik alkalmazott, mikor tette ezt meg
\-letrehozni tud admin, menedzser, takaritto

egyeb funkciok
\-beallitasokba belehelyezni egy smtp vel valo notifikacio kuldest, ahol kuld egy emailt a beallitott cimre, ha nem volt a takarittas deadlinon belul elvegezve
\-lehessen a sajat jelszavat valtoztatni
\-lehessen nyelvet valtoztatni (szlovak, magyar es angol) - kerlek translate filet hasznalj
\-a master bejelentkezes legyen: cstudios 12345
\-felhasznalot az admin es menedzser tud letrehozni
\-it should work offline and instalable to the phone. when offline it will collect data and when back online will sync it
\-the UX/UI should be optimized for phone use, but also work on desktop
\-if the system is offline, a red marking should be on top
\-there should be two login possibilites one with pin and user for cleaners and one user and pass for managers
\-the data primarly the dashboards should be updated as soon as something is changed.
\-add created by Cstudios to the footer

a rendszer php backendel keszuljon Yii2 keretrendszerrel, smaragd es arany szinben legyen. az online app neve Emerald cleaning url [https://cleaning.emeraldapartments.sk/](https://emeraldapartments.sk/)
frontend legyen react
a vizualis stilus legyen apple liquid glass

# prompt

# Emerald Cleaning - Project Specification
*   The goal of the application is to track which cleaner cleaned which room and when they finished the cleaning.
## Property & Room Hierarchy
*   **Property Management:** The system supports multiple properties.
*   **Rooms:** Every property contains its own set of rooms.
*   **Checklists:** Every room has its own individual task checklist.
    *   Each task is represented as a single row.
    *   Checklists can be copied/cloned from a master list or from other rooms.
*   **Theming & Colors:** Each property is uniquely distinguished.
    *   **Dynamic Interface:** The application interface color adapts dynamically based on the currently selected property's theme color.
    *   **Default State:** If no specific property is selected (e.g., global screens), the interface defaults to a neutral gray color palette.
    *   **Assets:** Each property has a specific color code and a cover image (used on dashboards and property selection screens).
## User Roles & Assignments
*   **Admin:** \* Sees everything across all properties.
    *   The only user type capable of assigning users (Managers and Cleaners) to specific properties.
*   **Manager:** \* Assigned to specific properties.
    *   Sees only the data related to their assigned properties.
    *   Can mark rooms for cleaning.
    *   Can check which cleaner cleaned a room and when.
*   **Cleaner:** \* Assigned to multiple properties.
    *   Upon login, they see only the properties and rooms they are assigned to.
    *   Can view whether a room has been cleaned or needs cleaning and complete tasks.
## Displays
### Property Selection Screen
*   A dedicated landing view where users select which of their assigned properties they want to view or work on.
*   Utilizes the property cover images and specific theme colors.
### Unified Rooms View
*   A global view where all rooms from all the properties the user is assigned to are visible at once.
*   Rooms are clearly **grouped by property**.
*   Displays the standard color-coded statuses (see below).
### Property Overview Dashboard
*   A dashboard specific to the _currently selected property_.
*   **List of rooms (for this property):** \* If it needs to be cleaned already and hasn't been cleaned: indicate with **orange**.
    *   If it needs to be cleaned and was cleaned: indicate with **green**.
    *   If it's after the daily deadline: indicate with **red**.
*   **List of cleaners:** When they logged something.
*   **Express Cleaning Button:** A popup window to enter a quick cleaning where they select which room needs to be cleaned on which day (default day is the day of entry).
### Cleaner List
*   Create new cleaner.
*   **Cleaner details (in slide-out):** View activity, change pin.
*   Deactivate cleaner.
*   _Permission:_ Admin and manager can create; Admin assigns to properties.
### Room List
*   Property-specific room locations, name, last cleaning (when and who), edit.
*   **Edit mode:** Clicking edit shows the room's task list (rows).
*   **Deadline:** Until what time it must be cleaned on the day of cleaning.
*   _Permission:_ Admin and manager can create.
### Cleanings List
*   Create a new cleaning defining which day and which room needs to be cleaned.
*   **Status details:** Clicking on a cleaning shows its status (cleaned, waiting for cleaning); if cleaned, shows which employee did it and when.
*   _Permission:_ Admin, manager, and cleaner can create.
## Quality of Life (QoL) Enhancements
*   **Damage Report:**
    *   A dedicated "Report Issue" button for cleaners to flag broken furniture, leaks, or missing items with a description and optional photo. This immediately notifies the Manager.
*   **Smart Sorting:**
    *   Cleaners' room lists are automatically sorted by **proximity to deadline** (Red items first, then Orange).
*   **Notes for the Next Shift:**
    *   Ability to leave a text note on a room (e.g., "Guest left a tip on the table" or "Stain on carpet wouldn't come out").
*   **Bulk Actions:**
    *   Managers can select multiple rooms to mark as "Needs Cleaning" for the next day in one click.
## Other Functions
*   **SMTP Notifications:** Settings to send an email to a designated address if cleaning was not performed within the deadline.
*   Change own password.
*   **Language Switch:** The interface must use a JSON translation file supporting Slovak, Hungarian, English, German, and Ukrainian. Every user must be able to set and save their preferred language.
*   **Master Login:** Hardcoded credentials (`cstudios` / `12345`) managed securely via the configuration file (see Technical Specifications).
*   **PWA / Offline:** It should work offline and be installable to the phone. When offline, it collects data and syncs when back online.
*   **Optimization:** UX/UI optimized for phone use, but also works on desktop. Use large touch targets for cleaners who may be wearing gloves or have wet hands.
*   **Offline Indicator:** A red marking on top if the system is offline.
*   **Dual Login:**
    1. PIN and user for cleaners.
    2. Username and password for managers.
*   **Real-time:** Data (primarily dashboards) should be updated as soon as something is changed.
*   **Footer:** Add "Created by Cstudios".
## Technical Specifications
*   **Backend:** PHP using Yii2 framework.
*   **Frontend:** React.
*   **Security & Configuration (config.php):** To maximize security, the database credentials and master password must be set within a backend `config.php` (or an equivalent `.env` implementation native to Yii2).
    *   **File Location:** The configuration file MUST reside strictly outside the public web root directory (e.g., above the `/web` or `/public_html` folder) to prevent direct browser access.
    *   **Version Control:** This file must be excluded from version control (added to `.gitignore`).
    *   **File Permissions:** Server permissions on the configuration file should be restricted (e.g., `600` or `640`) so it is only readable by the server executing the PHP process.
    *   **Master Password Storage:** Instead of keeping the master password as plain text in the config, it is highly recommended to store it as a bcrypt hash in the `config.php` and verify it using PHP's `password_verify()` function on login.
*   **Global Colors:** The default is grey. If the property has set a color, the UI will adapt.
*   **App Name:** CCleaning Manager. -can be set in the config.php
*   **URL:** [https://cleaningdemo.cstudios.ninja](https://www.google.com/search?q=https://cleaningdemo.cstudios.ninja)
*   **Visual Style:** Apple Liquid Glass (Glassmorphism).

shell: ssh [uid167681@shell.r5.websupport.sk](mailto:uid167681@shell.r5.websupport.sk) -p29607
password: 9a91956d48
[emeraldapartmenrs.sk/sub/cleaning](http://emeraldapartmenrs.sk/sub/cleaning) is a the root directory, it is empty for now. the service is PHP8.5

database is mariaDB 11, credentials:
password: y;FL\_0Lyhb=F~CJ>HFe1
db name: VhN86lvh
db login: Y52w6EsZ
db url: [http://db.r6.websupport.sk](http://db.r6.websupport.sk) port 3306
socket: /tmp/mariadb114.sock

git: [https://github.com/cstudios-slovakia/cleaning.git](https://github.com/cstudios-slovakia/cleaning.git)

push the code in git, pull to the server and test it on the url [https://cleaningdemo.cstudios.ninja](https://cleaningdemo.cstudios.ninja)
/**
 * KronoGX Scoreboard - Professional Basketball Console
 * 
 * Core functionality for the basketball scoreboard console,
 * including game clock, shot clock, scoreboard, and settings management.
 * 
 * @version 1.0.0
 * @license All Rights Reserved
 */

// Global variables for clock management
let gameClockInterval, shotClockInterval;  // Timer intervals for game and shot clocks
let gameMinutes = 10, gameSeconds = 0, shotSeconds = 24;  // Current time values
let gameRunning = false, shotRunning = false;  // Clock running states
let shotClockHidden = false;  // Shot clock visibility state
let lastShotClockValue = shotSeconds;  // Last valid shot clock value
let currentLang = "en";  // Current interface language

// Hotkey configuration from localStorage or default values
let clockHotkey = localStorage.getItem('clockHotkey') || 'k';
let shotClockStartHotkey = localStorage.getItem('shotClockStartHotkey') || 's';
let shotClockReset24Hotkey = localStorage.getItem('shotClockReset24Hotkey') || 'z';
let shotClockReset14Hotkey = localStorage.getItem('shotClockReset14Hotkey') || 'x';
let shotClockShowHotkey = localStorage.getItem('shotClockShowHotkey') || 'w';

/**
 * Translation strings for English and Spanish interfaces
 * @type {Object}
 */
const translations = {
    en: {
        "Game Clock": "Game Clock",
        "Shot Clock": "Shot Clock",
        "Quarter": "Quarter",
        "Home": "Home",
        "Away": "Away",
        "Score": "Score",
        "Fouls": "Fouls",
        "Reset Fouls": "Reset Fouls",
        "Reset Scoreboard": "Reset Scoreboard",
        "Start": "Start",
        "Pause": "Pause",
        "Reset": "Reset",
        "Change Language": "Change Language",
        "Edit Clocks": "Edit Clocks",
        "Hide": "Hide",
        "Show": "Show",
        "Reset 24": "Reset 24",
        "Reset 14": "Reset 14",
        "1st": "1st",
        "2nd": "2nd",
        "3rd": "3rd",
        "4th": "4th",
        "OT": "OT",
        "Settings": "Settings",
        "Back": "Back",
        "Clock Settings": "Clock Settings",
        "Display Settings": "Display Settings",
        "Sound Settings": "Sound Settings",
        "Default Game Time": "Default Game Time",
        "Default Shot Clock": "Default Shot Clock",
        "Clock Font Size": "Clock Font Size",
        "Show Shot Clock": "Show Shot Clock",
        "Enable Sound Effects": "Enable Sound Effects",
        "Volume": "Volume",
        "Small": "Small",
        "Medium": "Medium",
        "Large": "Large",
        "Always": "Always",
        "Optional": "Optional",
        "Never": "Never",
        "On": "On",
        "Off": "Off",
        "Save": "Save",
        "Clock Hotkey": "Clock Hotkey",
        "Shot Clock Start Hotkey": "Shot Clock Start Hotkey",
        "Shot Clock Reset 24 Hotkey": "Shot Clock Reset 24 Hotkey",
        "Shot Clock Reset 14 Hotkey": "Shot Clock Reset 14 Hotkey",
        "Shot Clock Show Hotkey": "Shot Clock Show Hotkey",
        "Settings saved successfully": "Settings saved successfully"
    },
    es: {
        "Game Clock": "Reloj de Juego",
        "Shot Clock": "Reloj de Posesión",
        "Quarter": "Cuarto",
        "Home": "Local",
        "Away": "Visitante",
        "Score": "Puntaje",
        "Fouls": "Faltas",
        "Reset Fouls": "Reiniciar Faltas",
        "Reset Scoreboard": "Reiniciar Marcador",
        "Start": "Iniciar",
        "Pause": "Pausar",
        "Reset": "Reiniciar",
        "Change Language": "Cambiar Idioma",
        "Edit Clocks": "Editar Relojes",
        "Hide": "Ocultar",
        "Show": "Mostrar",
        "Reset 24": "Reset 24",
        "Reset 14": "Reset 14",
        "1st": "1Q",
        "2nd": "2Q",
        "3rd": "3Q",
        "4th": "4Q",
        "OT": "ET",
        "Settings": "Configuración",
        "Back": "Volver",
        "Clock Settings": "Configuración de Relojes",
        "Display Settings": "Configuración de Pantalla",
        "Sound Settings": "Configuración de Sonido",
        "Default Game Time": "Tiempo de Juego por Defecto",
        "Default Shot Clock": "Reloj de Posesión por Defecto",
        "Clock Font Size": "Tamaño de Fuente del Reloj",
        "Show Shot Clock": "Mostrar Reloj de Posesión",
        "Enable Sound Effects": "Activar Efectos de Sonido",
        "Volume": "Volumen",
        "Small": "Pequeño",
        "Medium": "Mediano",
        "Large": "Grande",
        "Always": "Siempre",
        "Optional": "Opcional",
        "Never": "Nunca",
        "On": "Activado",
        "Off": "Desactivado",
        "Save": "Guardar",
        "Clock Hotkey": "Tecla de Reloj",
        "Shot Clock Start Hotkey": "Tecla de Inicio de Posesión",
        "Shot Clock Reset 24 Hotkey": "Tecla de Reset 24",
        "Shot Clock Reset 14 Hotkey": "Tecla de Reset 14",
        "Shot Clock Show Hotkey": "Tecla de Mostrar Posesión",
        "Settings saved successfully": "Configuración guardada exitosamente"
    }
};

/**
 * Updates the game clock display
 * Formats the time as MM:SS and updates the DOM
 */
function updateGameClockDisplay() {
    const gameClockElement = document.getElementById("gameClock");
    if (gameClockElement) {
    let display = `${gameMinutes}:${gameSeconds < 10 ? '0' : ''}${gameSeconds}`;
        gameClockElement.innerText = display;
    }
}

/**
 * Updates the shot clock display
 * Shows the current seconds or '---' if hidden
 */
function updateShotClockDisplay() {
    const shotClockElement = document.getElementById("shotClock");
    if (shotClockElement) {
        let display = shotClockHidden ? "---" : shotSeconds;
        shotClockElement.innerText = display;
    }
}

/**
 * Toggles the game clock between running and paused states
 * Also updates the button text based on current state
 */
function toggleGameClock() {
    if (gameRunning) {
        pauseGameClock();
    } else {
        startGameClock();
    }
    updateUI();
}

/**
 * Starts the game clock countdown
 * Updates the display every second
 */
function startGameClock() {
    if (!gameRunning) {
        gameRunning = true;
        gameClockInterval = setInterval(() => {
            if (gameMinutes === 0 && gameSeconds === 0) {
                pauseGameClock();
                return;
            }
            if (gameSeconds === 0) {
                gameMinutes--;
                gameSeconds = 59;
            } else {
                gameSeconds--;
            }
            updateGameClockDisplay();
        }, 1000);
    }
}

/**
 * Pauses the game clock
 * Clears the interval and updates button state
 */
function pauseGameClock() {
    clearInterval(gameClockInterval);
    gameRunning = false;
    if (gameMinutes === 0 && gameSeconds === 0) {
        document.getElementById("toggleGameClock").innerText = translations[currentLang]["Start"];
    }
}

/**
 * Resets the game clock to default values
 * Also updates the display and button state
 */
function resetGameClock() {
    pauseGameClock();
    gameMinutes = 10;
    gameSeconds = 0;
    updateGameClockDisplay();
    document.getElementById("toggleGameClock").innerText = translations[currentLang]["Start"];
}

/**
 * Toggles the shot clock between running and paused states
 * Updates the display and button text accordingly
 */
function toggleShotClock() {
    if (!document.getElementById("editClocks").classList.contains("editing")) {
        if (shotRunning) {
            pauseShotClock();
        } else {
            startShotClock();
        }
        updateUI();
    }
}

/**
 * Starts the shot clock countdown
 * Updates the display every second
 */
function startShotClock() {
    if (!shotRunning) {
        shotRunning = true;
        shotClockInterval = setInterval(() => {
            if (shotSeconds === 0) {
                pauseShotClock();
                return;
            }
            shotSeconds--;
            updateShotClockDisplay();
        }, 1000);
    }
}

/**
 * Pauses the shot clock
 * Clears the interval and updates button state
 */
function pauseShotClock() {
    clearInterval(shotClockInterval);
    shotRunning = false;
    if (shotSeconds === 0) {
        document.getElementById("toggleShotClock").innerText = translations[currentLang]["Start"];
    }
}

/**
 * Resets the shot clock to specified value
 * @param {number} seconds - New value for shot clock
 */
function resetShotClock(seconds) {
    shotSeconds = seconds;
    updateShotClockDisplay();
    if (shotClockHidden) {
        toggleShotClockVisibility();
    }
}

/**
 * Toggles shot clock visibility
 * Updates display and button text
 */
function toggleShotClockVisibility() {
    if (shotClockHidden) {
        // Si está oculto, solo mostrarlo
        shotClockHidden = false;
        shotSeconds = lastShotClockValue;
        updateShotClockDisplay();
    } else {
        if (shotRunning) {
            pauseShotClock();
        }
        lastShotClockValue = shotSeconds;
        shotClockHidden = true;
        updateShotClockDisplay();
    }
    updateUI();
}

/**
 * Updates all UI elements based on current language and state
 */
function updateUI() {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[currentLang][key]) {
            if (element.id === 'toggleGameClock') {
                const buttonText = gameRunning ? translations[currentLang]["Pause"] : translations[currentLang]["Start"];
                element.innerText = `${buttonText} (${clockHotkey.toUpperCase()})`;
            } else if (element.id === 'toggleShotClock') {
                const buttonText = shotRunning ? translations[currentLang]["Pause"] : translations[currentLang]["Start"];
                element.innerText = `${buttonText} (${shotClockStartHotkey.toUpperCase()})`;
            } else if (element.id === 'toggleShotClockVisibility') {
                const buttonText = shotClockHidden ? translations[currentLang]["Show"] : translations[currentLang]["Hide"];
                element.innerText = `${buttonText} (${shotClockShowHotkey.toUpperCase()})`;
            } else if (element.id === 'resetShotClock24' || element.getAttribute('onclick')?.includes('resetShotClock(24)')) {
                element.innerText = `${translations[currentLang]["Reset 24"]} (${shotClockReset24Hotkey.toUpperCase()})`;
            } else if (element.id === 'resetShotClock14' || element.getAttribute('onclick')?.includes('resetShotClock(14)')) {
                element.innerText = `${translations[currentLang]["Reset 14"]} (${shotClockReset14Hotkey.toUpperCase()})`;
            } else if (element.getAttribute('for') === 'clockHotkey') {
                element.innerText = translations[currentLang]["Clock Hotkey"] + ` (${clockHotkey.toUpperCase()})`;
            } else if (element.getAttribute('for') === 'shotClockStartHotkey') {
                element.innerText = translations[currentLang]["Shot Clock Start Hotkey"] + ` (${shotClockStartHotkey.toUpperCase()})`;
            } else if (element.getAttribute('for') === 'shotClockReset24Hotkey') {
                element.innerText = translations[currentLang]["Shot Clock Reset 24 Hotkey"] + ` (${shotClockReset24Hotkey.toUpperCase()})`;
            } else if (element.getAttribute('for') === 'shotClockReset14Hotkey') {
                element.innerText = translations[currentLang]["Shot Clock Reset 14 Hotkey"] + ` (${shotClockReset14Hotkey.toUpperCase()})`;
            } else if (element.getAttribute('for') === 'shotClockShowHotkey') {
                element.innerText = translations[currentLang]["Shot Clock Show Hotkey"] + ` (${shotClockShowHotkey.toUpperCase()})`;
            } else {
                element.innerText = translations[currentLang][key];
            }
        }
    });
}

/**
 * Toggles between English and Spanish interfaces
 */
function toggleLanguage() {
    currentLang = currentLang === "en" ? "es" : "en";
    updateUI();
}

/**
 * Adds points to specified team
 * @param {string} team - Team identifier ('A' or 'B')
 * @param {number} points - Points to add
 */
function addPoints(team, points) {
    let scoreElement = document.getElementById(`score${team}`);
    scoreElement.value = parseInt(scoreElement.value) + points;
    updateScoreDisplay(team);
}

/**
 * Subtracts points from specified team
 * @param {string} team - Team identifier ('A' or 'B')
 */
function subtractPoints(team) {
    let scoreElement = document.getElementById(`score${team}`);
    scoreElement.value = Math.max(0, parseInt(scoreElement.value) - 1);
    updateScoreDisplay(team);
}

/**
 * Updates the score display for a team
 * @param {string} team - Team identifier ('A' or 'B')
 */
function updateScoreDisplay(team) {
    document.getElementById(`score${team}`).value = Math.max(0, parseInt(document.getElementById(`score${team}`).value) || 0);
}

/**
 * Adds a foul to specified team
 * @param {string} team - Team identifier ('A' or 'B')
 */
function addFoul(team) {
    let foulsElement = document.getElementById(`fouls${team}`);
    foulsElement.value = Math.min(5, parseInt(foulsElement.value) + 1);
    updateFoulsDisplay(team);
}

/**
 * Subtracts a foul from specified team
 * @param {string} team - Team identifier ('A' or 'B')
 */
function subtractFoul(team) {
    let foulsElement = document.getElementById(`fouls${team}`);
    foulsElement.value = Math.max(0, parseInt(foulsElement.value) - 1);
    updateFoulsDisplay(team);
}

/**
 * Updates the fouls display for a team
 * @param {string} team - Team identifier ('A' or 'B')
 */
function updateFoulsDisplay(team) {
    document.getElementById(`fouls${team}`).value = Math.min(5, Math.max(0, parseInt(document.getElementById(`fouls${team}`).value) || 0));
}

/**
 * Resets all fouls to zero
 */
function resetFouls() {
    document.getElementById("foulsA").value = 0;
    document.getElementById("foulsB").value = 0;
}

/**
 * Resets the entire scoreboard
 * Clears scores, fouls, and resets clocks
 */
function resetScoreboard() {
    document.getElementById("scoreA").value = 0;
    document.getElementById("scoreB").value = 0;
    resetFouls();
}

/**
 * Saves current settings to localStorage
 */
function saveSettings() {
    // Guardar configuración de tiempo por defecto
    const defaultGameTime = document.getElementById('defaultGameTime').value;
    const defaultShotClock = document.getElementById('defaultShotClock').value;
    localStorage.setItem('defaultGameTime', defaultGameTime);
    localStorage.setItem('defaultShotClock', defaultShotClock);

    // Guardar configuración de tamaño de fuente
    const clockFontSize = document.getElementById('clockFontSize').value;
    localStorage.setItem('clockFontSize', clockFontSize);

    // Guardar configuración de visibilidad del shot clock
    const showShotClock = document.getElementById('showShotClock').value;
    localStorage.setItem('showShotClock', showShotClock);

    // Guardar configuración de sonido
    const soundEffects = document.getElementById('soundEffects').value;
    const volume = document.getElementById('volume').value;
    localStorage.setItem('soundEffects', soundEffects);
    localStorage.setItem('volume', volume);

    // Guardar configuración de teclas de acceso rápido
    const clockHotkey = document.getElementById('clockHotkey').value.toLowerCase();
    const shotClockStartHotkey = document.getElementById('shotClockStartHotkey').value.toLowerCase();
    const shotClockReset24Hotkey = document.getElementById('shotClockReset24Hotkey').value.toLowerCase();
    const shotClockReset14Hotkey = document.getElementById('shotClockReset14Hotkey').value.toLowerCase();
    const shotClockShowHotkey = document.getElementById('shotClockShowHotkey').value.toLowerCase();

    // Validar que las teclas sean caracteres válidos
    if (/[a-z0-9]/.test(clockHotkey)) {
        localStorage.setItem('clockHotkey', clockHotkey);
        window.clockHotkey = clockHotkey;
    }
    if (/[a-z0-9]/.test(shotClockStartHotkey)) {
        localStorage.setItem('shotClockStartHotkey', shotClockStartHotkey);
        window.shotClockStartHotkey = shotClockStartHotkey;
    }
    if (/[a-z0-9]/.test(shotClockReset24Hotkey)) {
        localStorage.setItem('shotClockReset24Hotkey', shotClockReset24Hotkey);
        window.shotClockReset24Hotkey = shotClockReset24Hotkey;
    }
    if (/[a-z0-9]/.test(shotClockReset14Hotkey)) {
        localStorage.setItem('shotClockReset14Hotkey', shotClockReset14Hotkey);
        window.shotClockReset14Hotkey = shotClockReset14Hotkey;
    }
    if (/[a-z0-9]/.test(shotClockShowHotkey)) {
        localStorage.setItem('shotClockShowHotkey', shotClockShowHotkey);
        window.shotClockShowHotkey = shotClockShowHotkey;
    }

    // Mostrar mensaje de confirmación
    alert(translations[currentLang]["Settings saved successfully"]);
    
    // Redirigir a la página principal
    window.location.href = 'index.html';
}

/**
 * Loads settings from localStorage
 * Applies saved settings to UI
 */
function loadSettings() {
    // Cargar valores por defecto
    const defaultGameTime = localStorage.getItem('defaultGameTime') || '10:00';
    const defaultShotClock = localStorage.getItem('defaultShotClock') || '24';
    const defaultFontSize = localStorage.getItem('defaultFontSize') || '48';
    const defaultSoundEffects = localStorage.getItem('defaultSoundEffects') || 'true';
    const defaultHotkey = localStorage.getItem('defaultHotkey') || 'K';
    const defaultShotClockStartHotkey = localStorage.getItem('defaultShotClockStartHotkey') || 'S';
    const defaultShotClockReset24Hotkey = localStorage.getItem('defaultShotClockReset24Hotkey') || 'Z';
    const defaultShotClockReset14Hotkey = localStorage.getItem('defaultShotClockReset14Hotkey') || 'X';
    const defaultShotClockShowHotkey = localStorage.getItem('defaultShotClockShowHotkey') || 'W';

    // Actualizar los campos de entrada
    document.getElementById('defaultGameTime').value = defaultGameTime;
    document.getElementById('defaultShotClock').value = defaultShotClock;
    document.getElementById('defaultFontSize').value = defaultFontSize;
    document.getElementById('defaultSoundEffects').checked = defaultSoundEffects === 'true';
    document.getElementById('clockHotkey').value = defaultHotkey;
    document.getElementById('shotClockStartHotkey').value = defaultShotClockStartHotkey;
    document.getElementById('shotClockReset24Hotkey').value = defaultShotClockReset24Hotkey;
    document.getElementById('shotClockReset14Hotkey').value = defaultShotClockReset14Hotkey;
    document.getElementById('shotClockShowHotkey').value = defaultShotClockShowHotkey;

    // Actualizar las variables globales
    clockHotkey = defaultHotkey;
    shotClockStartHotkey = defaultShotClockStartHotkey;
    shotClockReset24Hotkey = defaultShotClockReset24Hotkey;
    shotClockReset14Hotkey = defaultShotClockReset14Hotkey;
    shotClockShowHotkey = defaultShotClockShowHotkey;

    // Actualizar la UI con los nuevos valores
    updateUI();
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const darkModeButton = document.getElementById("darkModeToggle");
    const shotClock = document.getElementById("shotClock");
    const hideShotClockButton = document.getElementById("toggleShotClockVisibility");
    const languageButton = document.getElementById("languageToggle");
    const gameClock = document.getElementById("gameClock");
    
    // Set initial dark mode
    const isDarkMode = localStorage.getItem("dark-mode") === "enabled";
    document.body.classList.toggle("dark-mode", isDarkMode);
    updateDarkModeButton(isDarkMode);
    
    // Apply saved font size
    const savedFontSize = localStorage.getItem('clockFontSize') || 'medium';
    updateClockFontSize(savedFontSize);
    
    // Clock click events
    gameClock.addEventListener("click", () => {
        if (!document.getElementById("editClocks").classList.contains("editing")) {
            toggleGameClock();
        }
    });

    shotClock.addEventListener("click", () => {
        if (!document.getElementById("editClocks").classList.contains("editing")) {
            toggleShotClock();
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (event) => {
        if (document.getElementById("editClocks").classList.contains("editing")) return;

        const key = event.key.toLowerCase();
        if (key === clockHotkey) {
            toggleGameClock();
        } else if (key === shotClockStartHotkey) {
            toggleShotClock();
        } else if (key === shotClockReset24Hotkey) {
            resetShotClock(24);
        } else if (key === shotClockReset14Hotkey) {
            resetShotClock(14);
        } else if (key === shotClockShowHotkey) {
            const button = document.getElementById("toggleShotClockVisibility");
            if (button) button.click();
        }
    });
    
    // Dark mode toggle
    if (darkModeButton) {
        darkModeButton.addEventListener("click", toggleDarkMode);
    }
    
    // Language toggle
    if (languageButton) {
        languageButton.addEventListener("click", toggleLanguage);
    }

    // Shot clock visibility toggle
    if (hideShotClockButton) {
        hideShotClockButton.addEventListener('click', () => {
            toggleShotClockVisibility();
        });
    }

    // Clock edit mode
    const editClocksButton = document.getElementById("editClocks");
    if (editClocksButton) {
        editClocksButton.addEventListener("click", () => {
            const isEditing = editClocksButton.classList.contains("editing");
            
            if (!isEditing) {
                // Enter edit mode
                editClocksButton.classList.add("editing");
                editClocksButton.innerText = translations[currentLang]["Save"];
                
                // Pause clocks if running
                if (gameRunning) {
                    pauseGameClock();
                    document.getElementById("toggleGameClock").innerText = translations[currentLang]["Start"];
                }
                if (shotRunning) {
                    pauseShotClock();
                    document.getElementById("toggleShotClock").innerText = translations[currentLang]["Start"];
                }
                
                // Convert displays to inputs
                const gameClock = document.getElementById("gameClock");
                const shotClock = document.getElementById("shotClock");
                
                // Create input for game clock
                const gameClockInput = document.createElement("input");
                gameClockInput.type = "text";
                gameClockInput.value = `${gameMinutes}:${gameSeconds < 10 ? '0' : ''}${gameSeconds}`;
                gameClockInput.maxLength = 5;
                gameClockInput.pattern = "[0-9]{1,2}:[0-9]{2}";
                gameClockInput.title = "Format: MM:SS";
                gameClockInput.className = "clock-input";
                
                // Create input for shot clock
                const shotClockInput = document.createElement("input");
                shotClockInput.type = "text";
                shotClockInput.value = shotClockHidden ? "---" : shotSeconds;
                shotClockInput.maxLength = 2;
                shotClockInput.pattern = "[0-9]{1,2}";
                shotClockInput.title = "Format: SS";
                shotClockInput.className = "clock-input";
                
                // Replace displays with inputs
                gameClock.parentNode.replaceChild(gameClockInput, gameClock);
                shotClock.parentNode.replaceChild(shotClockInput, shotClock);
                
            } else {
                // Save changes
                const allClockControls = document.querySelectorAll(".clock-controls");
                const gameClockInput = allClockControls[0].querySelector("input.clock-input");
                const shotClockInput = allClockControls[1].querySelector("input.clock-input");
                
                // Store previous states
                const wasGameRunning = gameRunning;
                const wasShotRunning = shotRunning;
                
                // Debug log inputs
                console.log("Game Clock Input:", gameClockInput ? gameClockInput.value : "No encontrado");
                console.log("Shot Clock Input:", shotClockInput ? shotClockInput.value : "No encontrado");
                
                // Validate and update game clock
                if (gameClockInput && validateGameClockInput(gameClockInput.value)) {
                    const [minutes, seconds] = gameClockInput.value.split(":").map(Number);
                    gameMinutes = minutes;
                    gameSeconds = seconds;
                }
                
                // Validate and update shot clock
                if (shotClockInput && validateShotClockInput(shotClockInput.value)) {
                    if (shotClockInput.value !== "---") {
                        shotSeconds = parseInt(shotClockInput.value);
                        console.log("Shot clock value updated to:", shotSeconds);
                    }
                }
                
                // Exit edit mode
                editClocksButton.classList.remove("editing");
                editClocksButton.innerText = translations[currentLang]["Edit Clocks"];
                
                if (allClockControls && allClockControls.length >= 2) {
                    // Recreate game clock element
                    const gameClockElement = document.createElement("div");
                    gameClockElement.id = "gameClock";
                    gameClockElement.className = "clock";
                    gameClockElement.innerText = `${gameMinutes}:${gameSeconds < 10 ? '0' : ''}${gameSeconds}`;
                    
                    // Recreate shot clock element
                    const shotClockElement = document.createElement("div");
                    shotClockElement.id = "shotClock";
                    shotClockElement.className = "clock";
                    shotClockElement.innerText = shotClockHidden ? "---" : shotSeconds;
                    
                    // Apply font size from settings
                    const fontSize = localStorage.getItem('clockFontSize') || 'medium';
                    switch(fontSize) {
                        case 'small':
                            gameClockElement.style.fontSize = '24px';
                            shotClockElement.style.fontSize = '24px';
                            break;
                        case 'large':
                            gameClockElement.style.fontSize = '48px';
                            shotClockElement.style.fontSize = '48px';
                            break;
                        default:
                            gameClockElement.style.fontSize = '36px';
                            shotClockElement.style.fontSize = '36px';
                    }
                    
                    // Clean and replace game clock
                    const gameClockContainer = allClockControls[0];
                    const oldGameClock = gameClockContainer.querySelector("#gameClock");
                    if (oldGameClock) {
                        oldGameClock.remove();
                    }
                    const gameClockInputToReplace = gameClockContainer.querySelector("input.clock-input");
                    if (gameClockInputToReplace) {
                        gameClockInputToReplace.parentNode.replaceChild(gameClockElement, gameClockInputToReplace);
                    } else {
                        gameClockContainer.querySelector("p").insertAdjacentElement('afterend', gameClockElement);
                    }
                    
                    // Clean and replace shot clock
                    const shotClockContainer = allClockControls[1];
                    const oldShotClock = shotClockContainer.querySelector("#shotClock");
                    if (oldShotClock) {
                        oldShotClock.remove();
                    }
                    const shotClockInputToReplace = shotClockContainer.querySelector("input.clock-input");
                    if (shotClockInputToReplace) {
                        shotClockInputToReplace.parentNode.replaceChild(shotClockElement, shotClockInputToReplace);
                    } else {
                        shotClockContainer.querySelector("p").insertAdjacentElement('afterend', shotClockElement);
                    }
                    
                    // Reattach click events
                    gameClockElement.addEventListener("click", () => {
                        if (!editClocksButton.classList.contains("editing")) {
                            toggleGameClock();
                        }
                    });
                    
                    shotClockElement.addEventListener("click", () => {
                        if (!editClocksButton.classList.contains("editing")) {
                            if (shotClockHidden) {
                                shotClockHidden = false;
                                shotSeconds = lastShotClockValue;
                                updateShotClockDisplay();
                                const shotClockVisibilityButton = document.getElementById("toggleShotClockVisibility");
                                if (shotClockVisibilityButton) {
                                    shotClockVisibilityButton.innerText = translations[currentLang]["Hide"];
                                }
                                startShotClock();
                                const shotClockButton = document.getElementById("toggleShotClock");
                                if (shotClockButton) {
                                    shotClockButton.innerText = translations[currentLang]["Pause"];
                                }
                            } else {
                                toggleShotClock();
                            }
                        }
                    });
                    
                    // Restore clock states and button texts
                    if (wasGameRunning) {
                        startGameClock();
                        const gameClockButton = document.getElementById("toggleGameClock");
                        if (gameClockButton) {
                            gameClockButton.innerText = translations[currentLang]["Pause"];
                        }
                    } else {
                        const gameClockButton = document.getElementById("toggleGameClock");
                        if (gameClockButton) {
                            gameClockButton.innerText = translations[currentLang]["Start"];
                        }
                    }
                    
                    if (wasShotRunning) {
                        startShotClock();
                        const shotClockButton = document.getElementById("toggleShotClock");
                        if (shotClockButton) {
                            shotClockButton.innerText = translations[currentLang]["Pause"];
                        }
                    } else {
                        const shotClockButton = document.getElementById("toggleShotClock");
                        if (shotClockButton) {
                            shotClockButton.innerText = translations[currentLang]["Start"];
                        }
                    }
                }
            }
        });
    }

    // Initialize settings page if we're on it
    if (document.querySelector('.settings-container')) {
        loadSettings();
        setupSettingsEventListeners();
    }
});

// Funciones para la página de configuración
function setupSettingsEventListeners() {
    document.getElementById('defaultGameTime').addEventListener('change', (e) => {
        localStorage.setItem('defaultGameTime', e.target.value);
    });

    document.getElementById('defaultShotClock').addEventListener('change', (e) => {
        localStorage.setItem('defaultShotClock', e.target.value);
    });

    document.getElementById('clockFontSize').addEventListener('change', (e) => {
        localStorage.setItem('clockFontSize', e.target.value);
        updateClockFontSize(e.target.value);
    });

    document.getElementById('showShotClock').addEventListener('change', (e) => {
        localStorage.setItem('showShotClock', e.target.value);
    });

    document.getElementById('soundEffects').addEventListener('change', (e) => {
        localStorage.setItem('soundEffects', e.target.value);
    });

    document.getElementById('volume').addEventListener('change', (e) => {
        localStorage.setItem('volume', e.target.value);
    });

    // Configuración de teclas de acceso rápido
    const clockHotkeyInput = document.getElementById('clockHotkey');
    const shotClockStartHotkeyInput = document.getElementById('shotClockStartHotkey');
    const shotClockReset24HotkeyInput = document.getElementById('shotClockReset24Hotkey');
    const shotClockReset14HotkeyInput = document.getElementById('shotClockReset14Hotkey');
    const shotClockShowHotkeyInput = document.getElementById('shotClockShowHotkey');
    const languageToggleButton = document.getElementById('languageToggle');

    if (clockHotkeyInput) {
        clockHotkeyInput.addEventListener('input', (event) => {
            const key = event.target.value.toLowerCase();
            if (key.length === 1 && /[a-z0-9]/.test(key)) {
                clockHotkey = key;
                localStorage.setItem('clockHotkey', key);
            }
        });
    }

    if (shotClockStartHotkeyInput) {
        shotClockStartHotkeyInput.addEventListener('input', (event) => {
            const key = event.target.value.toLowerCase();
            if (key.length === 1 && /[a-z0-9]/.test(key)) {
                shotClockStartHotkey = key;
                localStorage.setItem('shotClockStartHotkey', key);
            }
        });
    }

    if (shotClockReset24HotkeyInput) {
        shotClockReset24HotkeyInput.addEventListener('input', (event) => {
            const key = event.target.value.toLowerCase();
            if (key.length === 1 && /[a-z0-9]/.test(key)) {
                shotClockReset24Hotkey = key;
                localStorage.setItem('shotClockReset24Hotkey', key);
            }
        });
    }

    if (shotClockReset14HotkeyInput) {
        shotClockReset14HotkeyInput.addEventListener('input', (event) => {
            const key = event.target.value.toLowerCase();
            if (key.length === 1 && /[a-z0-9]/.test(key)) {
                shotClockReset14Hotkey = key;
                localStorage.setItem('shotClockReset14Hotkey', key);
            }
        });
    }

    if (shotClockShowHotkeyInput) {
        shotClockShowHotkeyInput.addEventListener('input', (event) => {
            const key = event.target.value.toLowerCase();
            if (key.length === 1 && /[a-z0-9]/.test(key)) {
                shotClockShowHotkey = key;
                localStorage.setItem('shotClockShowHotkey', key);
            }
        });
    }

    if (languageToggleButton) {
        languageToggleButton.addEventListener('click', () => {
            toggleLanguage();
            updateUI();
        });
    }
}

function updateClockFontSize(size) {
    const gameClock = document.getElementById('gameClock');
    const shotClock = document.getElementById('shotClock');
    
    if (gameClock && shotClock) {
        switch(size) {
            case 'small':
                gameClock.style.fontSize = '24px';
                shotClock.style.fontSize = '24px';
                break;
            case 'medium':
                gameClock.style.fontSize = '36px';
                shotClock.style.fontSize = '36px';
                break;
            case 'large':
                gameClock.style.fontSize = '48px';
                shotClock.style.fontSize = '48px';
                break;
        }
    }
}

// Input validation functions
function validateGameClockInput(input) {
    if (!input || typeof input !== 'string') return false;
    const pattern = /^[0-9]{1,2}:[0-9]{2}$/;
    if (!pattern.test(input)) return false;
    
    const [minutes, seconds] = input.split(":").map(Number);
    return !isNaN(minutes) && !isNaN(seconds) && minutes >= 0 && minutes <= 60 && seconds >= 0 && seconds < 60;
}

function validateShotClockInput(input) {
    if (!input || typeof input !== 'string') return false;
    if (input === "---") return true;
    const pattern = /^[0-9]{1,2}$/;
    if (!pattern.test(input)) return false;
    
    const seconds = parseInt(input);
    return !isNaN(seconds) && seconds >= 0 && seconds <= 35;
}

function updateDarkModeButton(isDarkMode) {
    const darkModeButton = document.getElementById("darkModeToggle");
    const iconMoon = document.getElementById("icon-moon");
    const iconSun = document.getElementById("icon-sun");
    
    if (isDarkMode) {
        darkModeButton.style.background = "white";
        iconMoon.style.opacity = "0";
        iconSun.style.opacity = "1";
    } else {
        darkModeButton.style.background = "black";
        iconMoon.style.opacity = "1";
        iconSun.style.opacity = "0";
    }
}

function toggleDarkMode() {
        const darkModeEnabled = document.body.classList.toggle("dark-mode");
        localStorage.setItem("dark-mode", darkModeEnabled ? "enabled" : "disabled");
        updateDarkModeButton(darkModeEnabled);
} 
// Variables globales
let gameClockInterval, shotClockInterval;
let gameMinutes = 10, gameSeconds = 0, shotSeconds = 24;
let gameRunning = false, shotRunning = false;
let shotClockHidden = false;
let lastShotClockValue = shotSeconds;
let currentLang = "en";

// Traducciones
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
        "Off": "Off"
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
        "Off": "Desactivado"
    }
};

// Funciones del reloj
function updateGameClockDisplay() {
    let display = `${gameMinutes}:${gameSeconds < 10 ? '0' : ''}${gameSeconds}`;
    document.getElementById("gameClock").innerText = display;
}

function updateShotClockDisplay() {
    let display = shotClockHidden ? "---" : shotSeconds;
    document.getElementById("shotClock").innerText = display;
}

function toggleGameClock() {
    if (!document.getElementById("editClocks").classList.contains("editing")) {
        if (gameRunning) {
            pauseGameClock();
        } else {
            startGameClock();
        }
        document.getElementById("toggleGameClock").innerText = gameRunning ? translations[currentLang]["Pause"] : translations[currentLang]["Start"];
    }
}

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

function pauseGameClock() {
    clearInterval(gameClockInterval);
    gameRunning = false;
}

function resetGameClock() {
    pauseGameClock();
    gameMinutes = 10;
    gameSeconds = 0;
    updateGameClockDisplay();
    document.getElementById("toggleGameClock").innerText = translations[currentLang]["Start"];
}

function toggleShotClock() {
    if (!document.getElementById("editClocks").classList.contains("editing")) {
        if (shotRunning) {
            pauseShotClock();
        } else {
            startShotClock();
        }
        document.getElementById("toggleShotClock").innerText = shotRunning ? translations[currentLang]["Pause"] : translations[currentLang]["Start"];
    }
}

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

function pauseShotClock() {
    clearInterval(shotClockInterval);
    shotRunning = false;
}

function resetShotClock(value) {
    shotSeconds = value;
    updateShotClockDisplay();
    if (shotClockHidden) {
        toggleShotClockVisibility();
    }
}

// Funciones de puntuación
function updateScoreDisplay(team) {
    document.getElementById(`score${team}`).value = Math.max(0, parseInt(document.getElementById(`score${team}`).value) || 0);
}

function addPoints(team, points) {
    let scoreElement = document.getElementById(`score${team}`);
    scoreElement.value = parseInt(scoreElement.value) + points;
    updateScoreDisplay(team);
}

function subtractPoints(team) {
    let scoreElement = document.getElementById(`score${team}`);
    scoreElement.value = Math.max(0, parseInt(scoreElement.value) - 1);
    updateScoreDisplay(team);
}

function updateFoulsDisplay(team) {
    document.getElementById(`fouls${team}`).value = Math.min(5, Math.max(0, parseInt(document.getElementById(`fouls${team}`).value) || 0));
}

function addFoul(team) {
    let foulsElement = document.getElementById(`fouls${team}`);
    foulsElement.value = Math.min(5, parseInt(foulsElement.value) + 1);
    updateFoulsDisplay(team);
}

function subtractFoul(team) {
    let foulsElement = document.getElementById(`fouls${team}`);
    foulsElement.value = Math.max(0, parseInt(foulsElement.value) - 1);
    updateFoulsDisplay(team);
}

function resetFouls() {
    document.getElementById("foulsA").value = 0;
    document.getElementById("foulsB").value = 0;
}

function resetScoreboard() {
    document.getElementById("scoreA").value = 0;
    document.getElementById("scoreB").value = 0;
    resetFouls();
}

// Funciones de UI
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

function toggleLanguage() {
    currentLang = currentLang === "en" ? "es" : "en";
    document.querySelectorAll("[data-translate]").forEach(element => {
        const translationKey = element.dataset.translate;
        if (translations[currentLang][translationKey]) {
            element.innerText = translations[currentLang][translationKey];
        }
    });
    
    // Translate quarter select options if they exist
    const quarterSelect = document.getElementById("quarter");
    if (quarterSelect) {
        quarterSelect.querySelectorAll("option").forEach(option => {
            const translationKey = option.dataset.translate;
            if (translations[currentLang][translationKey]) {
                option.innerText = translations[currentLang][translationKey];
            }
        });
    }
    
    // Update dynamic buttons if they exist
    const gameClockButton = document.getElementById("toggleGameClock");
    if (gameClockButton) {
        gameClockButton.innerText = gameRunning ? translations[currentLang]["Pause"] : translations[currentLang]["Start"];
    }
    
    const shotClockButton = document.getElementById("toggleShotClock");
    if (shotClockButton) {
        shotClockButton.innerText = shotRunning ? translations[currentLang]["Pause"] : translations[currentLang]["Start"];
    }
    
    const shotClockVisibilityButton = document.getElementById("toggleShotClockVisibility");
    if (shotClockVisibilityButton) {
        shotClockVisibilityButton.innerText = shotClockHidden ? translations[currentLang]["Show"] : translations[currentLang]["Hide"];
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Set initial dark mode
    const isDarkMode = localStorage.getItem("dark-mode") === "enabled";
    document.body.classList.toggle("dark-mode", isDarkMode);
    updateDarkModeButton(isDarkMode);
    
    // Apply saved font size
    const savedFontSize = localStorage.getItem('clockFontSize') || 'medium';
    updateClockFontSize(savedFontSize);
    
    // Dark mode toggle
    const darkModeButton = document.getElementById("darkModeToggle");
    if (darkModeButton) {
        darkModeButton.addEventListener("click", toggleDarkMode);
    }
    
    // Language toggle
    const languageButton = document.getElementById("languageToggle");
    if (languageButton) {
        languageButton.addEventListener("click", toggleLanguage);
    }

    // Clock click events
    const gameClock = document.getElementById("gameClock");
    if (gameClock) {
        gameClock.addEventListener("click", () => {
            if (!document.getElementById("editClocks").classList.contains("editing")) {
                toggleGameClock();
            }
        });
    }

    // Shot clock visibility toggle
    const hideShotClockButton = document.getElementById("toggleShotClockVisibility");
    if (hideShotClockButton) {
        hideShotClockButton.addEventListener("click", () => {
            if (shotClockHidden) {
                // If hidden, show it and start it
                shotClockHidden = false;
                shotSeconds = lastShotClockValue;
                updateShotClockDisplay();
                startShotClock();
                document.getElementById("toggleShotClock").innerText = translations[currentLang]["Pause"];
            } else {
                if (shotRunning) {
                    pauseShotClock();
                    document.getElementById("toggleShotClock").innerText = translations[currentLang]["Start"];
                }
                lastShotClockValue = shotSeconds;
                shotClockHidden = true;
                updateShotClockDisplay();
            }
            hideShotClockButton.innerText = shotClockHidden ? translations[currentLang]["Show"] : translations[currentLang]["Hide"];
        });
    }

    // Shot clock click handler
    const shotClock = document.getElementById("shotClock");
    if (shotClock) {
        shotClock.addEventListener("click", () => {
            if (!document.getElementById("editClocks").classList.contains("editing")) {
                if (shotClockHidden) {
                    // If hidden, first show it
                    shotClockHidden = false;
                    shotSeconds = lastShotClockValue;
                    updateShotClockDisplay();
                    document.getElementById("toggleShotClockVisibility").innerText = translations[currentLang]["Hide"];
                    // Then start it
                    startShotClock();
                    document.getElementById("toggleShotClock").innerText = translations[currentLang]["Pause"];
                } else {
                    toggleShotClock();
                }
            }
        });
    }

    // Clock edit mode
    const editClocksButton = document.getElementById("editClocks");
    if (editClocksButton) {
        editClocksButton.addEventListener("click", () => {
            const gameClock = document.getElementById("gameClock");
            const shotClock = document.getElementById("shotClock");
            
            if (gameClock.contentEditable === "true") {
                gameClock.contentEditable = "false";
                shotClock.contentEditable = "false";
                editClocksButton.innerText = translations[currentLang]["Edit Clocks"];
                editClocksButton.classList.remove("editing");
                document.getElementById("toggleGameClock").disabled = false;
                document.getElementById("toggleShotClock").disabled = false;
            } else {
                gameClock.contentEditable = "true";
                shotClock.contentEditable = "true";
                editClocksButton.innerText = translations[currentLang]["Save Clocks"];
                editClocksButton.classList.add("editing");
                document.getElementById("toggleGameClock").disabled = true;
                document.getElementById("toggleShotClock").disabled = true;
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
function loadSettings() {
    // Cargar configuración de tiempo por defecto
    const defaultGameTime = localStorage.getItem('defaultGameTime') || 10;
    const defaultShotClock = localStorage.getItem('defaultShotClock') || 24;
    document.getElementById('defaultGameTime').value = defaultGameTime;
    document.getElementById('defaultShotClock').value = defaultShotClock;

    // Cargar configuración de tamaño de fuente
    const clockFontSize = localStorage.getItem('clockFontSize') || 'medium';
    document.getElementById('clockFontSize').value = clockFontSize;

    // Cargar configuración de visibilidad del shot clock
    const showShotClock = localStorage.getItem('showShotClock') || 'always';
    document.getElementById('showShotClock').value = showShotClock;

    // Cargar configuración de sonido
    const soundEffects = localStorage.getItem('soundEffects') || 'on';
    const volume = localStorage.getItem('volume') || 50;
    document.getElementById('soundEffects').value = soundEffects;
    document.getElementById('volume').value = volume;
}

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
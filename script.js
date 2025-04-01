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
        "OT": "OT"
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
        "OT": "ET"
    }
};

// Funciones del reloj
function updateGameClockDisplay() {
    let display = `${gameMinutes}:${gameSeconds < 10 ? '0' : ''}${gameSeconds}`;
    document.getElementById("gameClock").innerText = display;
}

function updateShotClockDisplay() {
    let display = shotClockHidden ? "" : shotSeconds;
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

// Event Listeners
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
    
    // Dark mode toggle
    darkModeButton.addEventListener("click", () => {
        const darkModeEnabled = document.body.classList.toggle("dark-mode");
        localStorage.setItem("dark-mode", darkModeEnabled ? "enabled" : "disabled");
        updateDarkModeButton(darkModeEnabled);
    });

    // Shot clock visibility toggle
    hideShotClockButton.addEventListener("click", () => {
        if (shotClock.style.visibility === "hidden") {
            shotClock.style.visibility = "visible";
            hideShotClockButton.innerText = translations[currentLang]["Hide"];
        } else {
            shotClock.style.visibility = "hidden";
            hideShotClockButton.innerText = translations[currentLang]["Show"];
        }
    });

    // Language toggle
    languageButton.addEventListener("click", () => {
        currentLang = currentLang === "en" ? "es" : "en";
        document.querySelectorAll("[data-translate]").forEach(element => {
            const translationKey = element.dataset.translate;
            if (translations[currentLang][translationKey]) {
                element.innerText = translations[currentLang][translationKey];
            }
        });
        
        // Translate quarter select options
        const quarterSelect = document.getElementById("quarter");
        quarterSelect.querySelectorAll("option").forEach(option => {
            const translationKey = option.dataset.translate;
            if (translations[currentLang][translationKey]) {
                option.innerText = translations[currentLang][translationKey];
            }
        });
        
        // Update dynamic buttons
        const gameClockButton = document.getElementById("toggleGameClock");
        gameClockButton.innerText = gameRunning ? translations[currentLang]["Pause"] : translations[currentLang]["Start"];
        
        const shotClockButton = document.getElementById("toggleShotClock");
        shotClockButton.innerText = shotRunning ? translations[currentLang]["Pause"] : translations[currentLang]["Start"];
        
        const shotClockVisibilityButton = document.getElementById("toggleShotClockVisibility");
        shotClockVisibilityButton.innerText = shotClockHidden ? translations[currentLang]["Show"] : translations[currentLang]["Hide"];
    });

    // Clock edit mode
    document.getElementById("editClocks").addEventListener("click", () => {
        const gameClock = document.getElementById("gameClock");
        const shotClock = document.getElementById("shotClock");
        const editButton = document.getElementById("editClocks");
        
        if (gameClock.contentEditable === "true") {
            gameClock.contentEditable = "false";
            shotClock.contentEditable = "false";
            editButton.innerText = translations[currentLang]["Edit Clocks"];
            editButton.classList.remove("editing");
            document.getElementById("toggleGameClock").disabled = false;
            document.getElementById("toggleShotClock").disabled = false;
        } else {
            gameClock.contentEditable = "true";
            shotClock.contentEditable = "true";
            editButton.innerText = translations[currentLang]["Save Clocks"];
            editButton.classList.add("editing");
            document.getElementById("toggleGameClock").disabled = true;
            document.getElementById("toggleShotClock").disabled = true;
        }
    });

    // Shot clock visibility toggle
    document.getElementById("toggleShotClockVisibility").addEventListener("click", () => {
        if (shotClockHidden) {
            shotClockHidden = false;
            shotSeconds = lastShotClockValue;
            updateShotClockDisplay();
        } else {
            if (shotRunning) {
                pauseShotClock();
                document.getElementById("toggleShotClock").innerText = translations[currentLang]["Start"];
            }
            lastShotClockValue = shotSeconds;
            shotClockHidden = true;
            updateShotClockDisplay();
        }
        document.getElementById("toggleShotClockVisibility").innerText = shotClockHidden ? translations[currentLang]["Show"] : translations[currentLang]["Hide"];
    });
}); 
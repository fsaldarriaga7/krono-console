# KronoGX Scoreboard

Professional console for basketball game control, including scoreboard, game clock, and shot clock.

## Features

- **Game Clock**: Timer with start/pause/reset functionality
- **Shot Clock**: 24-second timer with customizable reset values
- **Scoreboard**: Points and fouls tracking for both teams
- **Configuration**: Customization of times, font sizes, and hotkeys
- **Multilingual**: Support for English and Spanish
- **Dark Mode**: Toggle between light and dark themes
- **Hotkeys**: Customizable keyboard shortcuts for quick control

## Installation

1. Clone the repository:
```bash
git clone [PRIVATE_REPOSITORY_URL]
```

2. Open `index.html` in your web browser

## Usage

### Game Clock
- Start/Pause: Click on the clock or press `K`
- Reset: Click the reset button

### Shot Clock
- Start/Pause: Click on the clock or press `S`
- Reset to 24s: Press `Z`
- Reset to 14s: Press `X`
- Show/Hide: Press `W`

### Scoreboard
- Add points: Click on +1, +2, or +3 buttons
- Subtract points: Click on the -1 button
- Add/Subtract fouls: Use respective buttons
- Reset: Click the reset button

### Configuration
- Access settings through the configuration button
- Customize:
  - Default game time
  - Default shot clock time
  - Clock font size
  - Hotkeys
  - Language
  - Dark mode

## Technical Documentation

### Main Functions

#### Game Clock
```javascript
toggleGameClock() // Toggles between running and paused states
startGameClock()  // Starts countdown
pauseGameClock()  // Pauses countdown
resetGameClock()  // Resets to default time
```

#### Shot Clock
```javascript
toggleShotClock()           // Toggles between running and paused states
startShotClock()            // Starts countdown
pauseShotClock()            // Pauses countdown
resetShotClock(value)       // Resets to specified value
toggleShotClockVisibility() // Shows/hides shot clock
```

#### Scoreboard Functions
```javascript
addPoints(team, points)     // Adds points to specified team
subtractPoints(team)        // Subtracts one point from team
addFoul(team)              // Adds a foul to the team
subtractFoul(team)         // Subtracts a foul from the team
resetFouls()               // Resets all fouls to zero
resetScoreboard()          // Resets entire scoreboard
```

#### UI Functions
```javascript
toggleDarkMode()           // Toggles between light and dark themes
toggleLanguage()           // Switches between English and Spanish
updateUI()                 // Updates all UI elements
```

## Change Log

### v1.0.0
- Initial version
- Basic game clock functionality
- Shot clock with 24/14 second options
- Scoreboard with points and fouls tracking
- Configuration panel with customization options
- Dark mode support
- Multilingual support (English/Spanish)
- Customizable hotkeys

## License

This is a private project. All rights reserved. 
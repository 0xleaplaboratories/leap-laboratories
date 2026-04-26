---
title: "Coding Blocks"
description: "Visual programming with Scratch"
lastUpdated: "2026-04-21T12:32:00Z"
banner: "/assets/images/banners/coding-blocks-banner.png"
logo: "/assets/images/logo-square.png"
pages:
  - page: 1
    slug: "scratch-level-1"
  - page: 2
    slug: "scratch-level-2"
---

# Scratch Programming: Level 1 Learning Track

This syllabus outlines the foundational journey for students learning Scratch. Level 1 focuses on spatial awareness, game logic, basic data handling, and structured programming through three hands-on projects.

## Level 1 Overview

| Project | Session | Topic | Key Learning Objectives |
| :---- | :---- | :---- | :---- |
| **Shooting Game** | 1 | Coordinate Awareness | Understanding the X and Y axes, positioning sprites, and Stage boundaries. |
| | 2 | Conditional Moves | Using if-then blocks to control movement and detect edge collisions. |
| | 3 | Frames Per Second (FPS) | Introduction to game loops and how timing affects animation smoothness. |
| | 4 | Controls & Triggers | Mapping keyboard inputs and mouse clicks to specific game actions. |
| **Beetle Maze** | 5 | Conditional Navigation I | Implementing walls/obstacles using color detection and sensing blocks. |
| | 6 | Conditional Navigation II | Refining movement logic to prevent "glitching" through maze walls. |
| | 7 | Intro to Variables | Creating and displaying "Lives" or "Timer" to track game state. |
| | 8 | Functions & Refactoring | Using "My Blocks" to organize code and eliminate repetitive scripts. |
| | 9 | Dynamic Stages | Using broadcast messages to switch levels and reset sprite positions. |
| **Paddle Pong** | 10 | Degree Awareness | Understanding angles, rotation, and the concept of "bounce" (Reflection). |
| | 11 | Arithmetic Operators | Using addition, subtraction, and multiplication for speed scaling. |
| | 12 | Scoring System | Implementing high scores and complex win/loss conditions. |

## Detailed Learning Outcomes

### Project 1: Shooting Game (Foundations)

- **Spatial Logic:** Students will master the 2D coordinate system (X and Y axes).
- **Event Handling:** Learning how to start scripts with green flags and key presses.

<iframe src="https://scratch.mit.edu/projects/1310730369/embed" allowtransparency="true" width="485" height="402" frameborder="0" scrolling="no" allowfullscreen></iframe>

### Project 2: Beetle Maze (Logic & Structure)

- **Algorithm Design:** Creating paths and logical checks for "win" areas versus "wall" areas.
- **Data Literacy:** Understanding that a variable is a "container" for information that can change.
- **Broadcasting:** Mastering the "Message" system to allow different sprites to communicate.

<iframe src="https://scratch.mit.edu/projects/1310732505/embed" allowtransparency="true" width="485" height="402" frameborder="0" scrolling="no" allowfullscreen></iframe>

### Project 3: Paddle Pong (Physics & Math)

- **Mathematical Application:** Using operators to determine the ball's trajectory.
- **Game Balance:** Learning how to increase difficulty by adjusting variables over time.

<iframe src="https://scratch.mit.edu/projects/1310733653/embed" allowtransparency="true" width="485" height="402" frameborder="0" scrolling="no" allowfullscreen></iframe>

Have access to teacher resources at: [Coding Level 1](https://github.com/0xleaplaboratories/coding-curriculum)

---

# Scratch Programming: Level 2 Learning Track

This syllabus builds on the foundations established in Level 1. Level 2 introduces physics simulation, sprite cloning, list-based data structures, and branching narrative logic through three progressively challenging projects.

## Level 2 Overview

| Project | Session | Topic | Key Learning Objectives |
|---|---|---|---|
| **1. Platformer Game** | 1 | Gravity Simulation | Using variables to simulate gravitational pull and jump velocity on a sprite. |
| | 2 | Platform Collision | Detecting floor and ceiling contact using color sensing to anchor or restrict movement. |
| | 3 | Sprite Animation States | Switching costumes dynamically to reflect idle, walk, jump, and fall states. |
| | 4 | Multi-Level Design | Using broadcasts and backdrop switching to build seamless level transitions. |
| **2. Space Invaders** | 5 | Sprite Cloning | Using the "create clone" block to generate multiple enemies from a single sprite. |
| | 6 | Clone Behavior & Targeting | Programming each clone to act independently and respond to projectile collisions. |
| | 7 | Lists & Data Structures | Storing and retrieving game data (e.g. enemy types, wave patterns) using Scratch lists. |
| | 8 | Wave & Difficulty Scaling | Using arithmetic and list length to increase enemy count and speed across waves. |
| **3. Adventure RPG** | 9 | Dialogue Systems | Building a text-rendering engine using lists and string operators for character dialogue. |
| | 10 | Branching Logic | Implementing nested if-else blocks to create meaningful player choices and outcomes. |
| | 11 | Inventory & State Management | Using multiple variables and lists to track player stats, items, and world state. |
| | 12 | Polish & Game Feel | Adding sound cues, visual effects, and playtesting loops to refine the overall experience. |

## Detailed Learning Outcomes

### Project 1: Platformer Game (Physics & Animation)

- **Physics Simulation:** Students will model real-world gravity by incrementally adjusting a velocity variable each frame, creating natural arc-based jumping.
- **Precise Collision:** Moving beyond simple edge detection, students learn to use color-based sensing for reliable platform landing and wall-stopping logic.
- **Animation State Machines:** Students will design costume-switching logic that reflects the sprite's current action, introducing the concept of state-driven animation.

### Project 2: Space Invaders (Cloning & Data)

- **Clone Architecture:** Students will understand how a single sprite definition can produce dozens of independent, behaviorally consistent clones at runtime.
- **List Literacy:** Building on the variable knowledge from Level 1, students will use lists to manage ordered collections of data such as enemy formations and score histories.
- **Scalable Difficulty:** Students will apply arithmetic operators to programmatically increase challenge over time, reinforcing the connection between math and game design.

### Project 3: Adventure RPG (Narrative & State)

- **Dialogue Engineering:** Students will construct a reusable dialogue engine using lists as script containers, learning to separate data from logic.
- **Decision Trees:** Through nested conditionals and flag variables, students will map out branching storylines where player choices have lasting consequences.
- **Holistic Game Design:** The final session introduces iterative playtesting and the role of audio-visual polish in shaping player experience and perceived quality.
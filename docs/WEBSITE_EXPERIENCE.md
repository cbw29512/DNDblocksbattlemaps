# Public Website and Conversion Experience Contract

> Status: Stage 0 product contract.
>
> Purpose: DND Blocks Battle Maps is not just an editor hidden behind a website. The public website is the front door to the product and must immediately show what the tool does, look professional, and get a DM or player into the correct flow with almost no friction.

## Product / Website Principle

The marketing site and the application should feel like one product.

Do not build a separate decorative brochure that sends users through several pages before they can use the map.

The homepage should answer three questions immediately:

1. What is this?
2. Why is it easier than other VTTs?
3. What do I click to start?

## Primary Homepage Goal

Within a few seconds, a visitor should understand:

> **Build a 3D tabletop battle map from simple blocks in minutes. No download. No complicated setup.**

The primary actions are:

- **Build a Map**
- **Join a Game**

These must be visible above the fold on desktop and mobile.

## Homepage Hero

The hero should combine:

- product name/logo
- one short headline
- one short supporting sentence
- primary **Build a Map** button
- secondary **Join a Game** button
- a strong real visual of the actual block board

Recommended working headline:

> **Build the battle map in your head. In minutes.**

Recommended supporting idea:

> Choose a terrain, drop in rooms, doors, traps, monsters, and props, then invite your players. Nothing to install.

Final copy can be tuned later, but it should stay this short.

## Immediate Terrain Start

Directly in or immediately below the hero, ask:

> **What terrain do you want?**

Use large visual cards/buttons.

Initial examples:

- Castle
- Inn
- Field
- Sea
- Volcano

These are examples, not the complete theme catalog.

Selecting a terrain should take the visitor directly into the builder with that theme active.

### Sign-in friction

A visitor should be able to **try building immediately** without first filling out a long registration flow.

Recommended MVP behavior:

- terrain choice opens a local/temporary builder immediately
- user can place blocks and understand the product
- durable DM sign-in is required when they attempt to Save, Share, or create a persistent game

This preserves the durable-DM identity contract while keeping the first experience frictionless.

If implementation/security constraints later make this materially harder, revisit the exact guest-demo boundary before changing it.

## Player Entry

Players should not have to navigate the marketing site to find their game.

Primary player paths:

- direct join link opens Join flow immediately
- homepage **Join a Game** opens a simple code/name screen

Player entry should remain:

> Game Code -> Name -> Join

No feature tour should interrupt a player who is already trying to join a table.

## Homepage Structure

Keep the page focused.

Recommended order:

### 1. Header

Minimal navigation:

- Logo / Home
- Build a Map
- Join a Game
- My Maps / Sign In

Do not create a large multi-level navigation menu for MVP.

### 2. Hero + Real Product Visual

Show the actual product, not generic fantasy stock art.

Best long-term hero visual:

- a real example map rendered by our actual Three.js board
- gentle orbit/animation only if it remains lightweight
- otherwise use a high-quality screenshot/render from the real application

Avoid fake UI screenshots that no longer match the product.

### 3. Terrain Quick Start

Large theme cards:

- Castle
- Inn
- Field
- Sea
- Volcano

Each card should have:

- simple original scene/block thumbnail
- plain text label
- one-click start

### 4. Three-Step Explanation

Keep it almost child-level:

1. **Pick a terrain**
2. **Drop in blocks**
3. **Share with your players**

Use real product visuals, not long paragraphs.

### 5. Why It Is Different

Four compact ideas are enough:

- **Build in minutes** — no mapmaking expertise
- **Nothing to install** — browser-first
- **DM stays in control** — no rules engine required
- **Anything can happen** — hidden traps, stacked objects, transforming surprises, etc.

Do not publish a giant feature matrix on the homepage.

### 6. Product Showcase

Show a small set of polished real examples such as:

- Castle room
- Inn encounter
- Field ambush
- Pit/trap encounter
- Chest -> mimic surprise

The point is to communicate possibility without making setup look complicated.

### 7. Player Simplicity

Explain that players:

- click the invite link
- enter their name
- control their piece

This addresses a major adoption concern for DMs: their players do not need to learn another complicated tool.

### 8. Final CTA

Repeat:

- **Build a Map**
- **Join a Game**

Do not make the user scroll back to the top to find the primary action.

## Logged-In DM Home

After sign-in, the DM should not be sent back into a marketing page.

Show a simple product dashboard:

- **New Map**
- recent/saved maps
- active games if any
- Join/Share controls only where relevant

Do not build a campaign-management suite for MVP.

## Core Routes

Recommended initial routes:

- `/` — public landing / quick start
- `/build` — builder
- `/join` — enter game code/name
- `/game/:code` — active player/game route
- `/maps` — signed-in DM's saved maps
- `/login` — durable DM sign-in

Keep marketing and application in the **same Vite project/repository** unless a real requirement later proves separation is useful.

Reason:

- one deployment
- one design system
- one dependency graph
- shared assets
- simpler routing
- fewer Netlify deploy surfaces
- less drift between "website" and "app"

## Visual Direction

The site should feel like a premium digital tabletop workshop, not an enterprise dashboard.

Working direction:

- dark or neutral tabletop/workshop background
- strong readable typography
- warm fantasy/tabletop accents
- crisp 3D block renders
- subtle grid language
- restrained glow/shadow for depth
- large, tactile buttons/cards
- generous spacing
- strong contrast

Avoid:

- cluttered fantasy borders everywhere
- tiny medieval fonts
- excessive parchment textures
- generic stock dragons
- animated effects competing with the product
- dozens of navigation links
- "developer tool" visual language

The board itself should be the hero.

## Original Brand Rule

Do not visually imitate Minecraft, Roll20, TaleSpire, or another VTT.

We may learn from product structure and usability, but:

- original logo
- original icons
- original block art
- original color/type system
- original screenshots/renders

## Current VTT Website Lessons

Current competitor research reinforces several patterns:

### Owlbear Rodeo

Owlbear positions itself as browser-based, intuitive, and focused on the battle-map experience. Its player onboarding documentation says players primarily open the GM's link and join.

Lesson:

> Low setup and browser access are powerful selling points.

### Roll20

Roll20's current homepage makes its browser/no-download value explicit and uses a strong account/start CTA, but it also markets a very broad feature set.

Lesson:

> Make the first action obvious, but do not copy the feature-density strategy.

### Foundry VTT

Foundry emphasizes a powerful modern platform and self-hosted control.

Lesson:

> Power attracts some users, but our differentiation is the opposite side of the spectrum: minimal setup and minimal learning.

### TaleSpire

TaleSpire quickly explains the core fantasy: build a digital tabletop and invite players.

Lesson:

> Show the actual board immediately. The product visual can explain more than several paragraphs.

## Performance Is Part of Design

The landing page must feel fast.

Targets/guardrails:

- useful content appears immediately
- hero copy/buttons must not wait for Three.js
- avoid loading the full builder engine merely to paint the first text/button
- lazy-load heavy 3D/product showcase content when appropriate
- compress images/assets
- no autoplay video required for basic understanding
- site remains usable on a normal phone/tablet

A beautiful site that loads slowly fails the product requirement.

## Mobile / Touch

Homepage and Join flow must work well on mobile.

Builder remains touch-aware per the placement/camera contracts.

Key buttons must have comfortable touch targets.

Do not make hover the only way to discover important actions.

## Accessibility

Required:

- semantic HTML
- keyboard-accessible primary navigation/actions
- visible focus state
- high enough text/background contrast
- no color-only meaning
- image alt text where appropriate
- motion should remain subtle and avoid blocking usage

## SEO / Shareability

Because the public website is intended to attract users, MVP should include basic discoverability:

- useful page title and meta description
- canonical URL once domain is selected
- Open Graph/social image
- favicon/app icon
- descriptive headings
- crawlable explanatory text on the homepage
- sitemap/robots configuration when the public domain is ready

Do not build a large content-marketing system before the core product works.

## Trust

The website should clearly communicate:

- browser-based
- no download required
- what requires sign-in
- what a player must do to join
- whether the current product is Beta/Early Access when applicable
- privacy/terms links before public launch

Do not pretend unfinished features exist.

## Conversion / Usability Tests

A new visitor should be able to answer these without help:

- What does this site do?
- Can I use it in my browser?
- How do I start building?
- How does a player join?
- Do I need to download anything?

The homepage should also pass:

### DM Test

From homepage to seeing a usable grid:

- one obvious Build action or one terrain-card click
- no unnecessary onboarding questionnaire
- no documentation required

### Player Test

From homepage/direct link to table:

- Join Game
- code/name
- enter table

### Child Test

A child should be able to identify:

- "Build"
- "Join"
- terrain choices
- what the product image represents

without reading a paragraph.

## Netlify Deployment Policy

Netlify is the selected public host.

User reports an existing paid/Plus Netlify plan.

Regardless of available plan capacity:

- **all normal development and automated testing happens locally**
- GitHub pushes should be meaningful repository checkpoints, not a substitute for local testing
- Netlify production deploys are milestone releases only
- do not publish every experiment
- deploy when the current slice is locally tested and worth reviewing as a live product
- preserve the ability to roll back to a known-good deploy

Exact account-specific Netlify plan limits should be read from the user's Netlify dashboard when deployment begins rather than guessed from public pricing.

## Release Principle

The public site should never be noticeably worse than the last known-good public version merely because development is in progress.

Workflow:

1. build locally
2. run tests locally
3. visually inspect locally
4. commit/push the coherent checkpoint to GitHub
5. deploy/publish to Netlify only when the milestone is ready
6. verify the live site
7. record result in `PROJECT_STATE.md`

## MVP Website Definition of Done

Before calling the public website ready for first outside users:

- homepage immediately explains the product
- Build a Map CTA works
- Join a Game CTA works
- terrain cards work
- real product visual is shown
- mobile layout is usable
- header is simple
- logged-in DM can reach saved maps
- players can join without a permanent account
- public pages do not expose DM-only/game-private state
- basic SEO/share metadata exists
- accessibility basics pass
- page performance is acceptable
- no copied/proprietary competitor art
- privacy/terms/status language is appropriate for the release stage
- live Netlify build matches the tested release checkpoint

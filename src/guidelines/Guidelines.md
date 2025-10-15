# Typography Guidelines

## Font Usage

The application uses two primary fonts:

### DM Serif Display
- **Usage**: All titles and headings (h1, h2, h3, h4), brand names, and primary call-to-action headings
- **Purpose**: Creates visual hierarchy and elegant brand presence with serif typography
- **CSS Variable**: `var(--font-title)`
- **Tailwind Class**: `font-title`
- **Font Sizes**: Automatically increased by 2px from base Tailwind sizes for enhanced prominence
- **Examples**: "Where Art Meets Innovation", "Featured Artworks", "Artistrial", "Explore Categories", "Ready to Share Your Art?"

### Neue Montreal  
- **Usage**: All other text elements (body text, buttons, navigation, links, inputs, labels, etc.)
- **Purpose**: Provides clean, readable typography for UI elements
- **CSS Variable**: `var(--font-body)`  
- **Tailwind Class**: `font-body`

## Implementation
Fonts are applied globally through CSS custom properties and base layer styles. All elements automatically inherit the appropriate font family unless explicitly overridden.

### Manual Override
To override the default font assignment, use the utility classes:
- `.font-title` - Apply DM Serif Display to any element
- `.font-body` - Apply Neue Montreal to any element

### Best Practices
- Use `font-title` for major headings, brand elements, and important CTAs
- Keep `font-body` for all UI elements and body text
- Maintain consistency across similar content types

**Add your own guidelines here**
<!--

System Guidelines

Use this file to provide the AI with rules and guidelines you want it to follow.
This template outlines a few examples of things you can add. You can add your own sections and format it to suit your needs

TIP: More context isn't always better. It can confuse the LLM. Try and add the most important rules you need

# General guidelines

Any general rules you want the AI to follow.
For example:

* Only use absolute positioning when necessary. Opt for responsive and well structured layouts that use flexbox and grid by default
* Refactor code as you go to keep code clean
* Keep file sizes small and put helper functions and components in their own files.

--------------

# Design system guidelines
Rules for how the AI should make generations look like your company's design system

Additionally, if you select a design system to use in the prompt box, you can reference
your design system's components, tokens, variables and components.
For example:

* Use a base font-size of 14px
* Date formats should always be in the format “Jun 10”
* The bottom toolbar should only ever have a maximum of 4 items
* Never use the floating action button with the bottom toolbar
* Chips should always come in sets of 3 or more
* Don't use a dropdown if there are 2 or fewer options

You can also create sub sections and add more specific details
For example:


## Button
The Button component is a fundamental interactive element in our design system, designed to trigger actions or navigate
users through the application. It provides visual feedback and clear affordances to enhance user experience.

### Usage
Buttons should be used for important actions that users need to take, such as form submissions, confirming choices,
or initiating processes. They communicate interactivity and should have clear, action-oriented labels.

### Variants
* Primary Button
  * Purpose : Used for the main action in a section or page
  * Visual Style : Bold, filled with the primary brand color
  * Usage : One primary button per section to guide users toward the most important action
* Secondary Button
  * Purpose : Used for alternative or supporting actions
  * Visual Style : Outlined with the primary color, transparent background
  * Usage : Can appear alongside a primary button for less important actions
* Tertiary Button
  * Purpose : Used for the least important actions
  * Visual Style : Text-only with no border, using primary color
  * Usage : For actions that should be available but not emphasized
-->

"""Draws PlantQuest's app icon, Android adaptive icon, splash image and favicon (Binhi on a sunny sky).

Run from the project root:  python scripts/make-icons.py
Everything is drawn here from shapes (no downloaded art). Shapes match src/components/art/Binhi.tsx.
"""
from PIL import Image, ImageDraw

OUT = 'assets/images'
SS = 4  # supersampling for smooth edges

SKY = '#7FD4F7'
SUN = '#FFD23F'
HILL_LIGHT = '#8EDB6E'
HILL = '#5CC44A'
LEAF = '#5CC44A'
LEAF_LIGHT = '#8EDB6E'
LEAF_DARK = '#3A9A2E'
CORAL = '#FF7A59'
CORAL_LIGHT = '#FF9F80'
INK = '#2B2D42'
PINK = '#FF8FB8'
WHITE = '#FFFFFF'


def quad(p0, c, p1, n=24):
    return [
        ((1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * c[0] + t ** 2 * p1[0],
         (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * c[1] + t ** 2 * p1[1])
        for t in (i / n for i in range(n + 1))
    ]


def draw_binhi(d, cx, cy, s, shadow='#2B2D4222'):
    """Binhi (Binhi.tsx viewBox 0 0 80 92) centered on (cx, cy) at s pixels per unit."""
    ox, oy = cx - 40 * s, cy - 50 * s
    P = lambda x, y: (ox + x * s, oy + y * s)

    def poly(points, fill):
        d.polygon([P(x, y) for x, y in points], fill=fill)

    def ellipse(x, y, rx, ry, fill):
        d.ellipse([P(x - rx, y - ry), P(x + rx, y + ry)], fill=fill)

    ellipse(40, 88, 26, 4, shadow)
    # stem and leaves
    d.line([P(40, 53), P(40, 29)], fill=LEAF_DARK, width=round(4.5 * s))
    ellipse(40, 29, 2.25, 2.25, LEAF_DARK)
    poly(quad((40, 40), (18, 38), (14, 19)) + quad((14, 19), (34, 19), (40, 39)), LEAF)
    poly(quad((40, 34), (60, 30), (64, 11)) + quad((64, 11), (44, 13), (40, 33)), LEAF_LIGHT)
    # pot
    poly([(20, 58), (60, 58), (55, 86), (25, 86)], CORAL)
    d.rounded_rectangle([P(16, 52), P(64, 62)], radius=5 * s, fill=CORAL_LIGHT)
    # cheerful face
    for ex in (32, 48):
        ellipse(ex, 69, 3.2, 3.2, INK)
        ellipse(ex + 1, 68, 1.1, 1.1, WHITE)
    ellipse(26, 75, 3.5, 2.2, PINK)
    ellipse(54, 75, 3.5, 2.2, PINK)
    poly(quad((34, 74), (40, 81), (46, 74)), INK)


def scene(size):
    """Sky, sun and hills."""
    img = Image.new('RGBA', (size, size), SKY)
    d = ImageDraw.Draw(img)
    u = size / 100
    # Solid colors only: semi-transparent fills would punch see-through holes in the icon.
    circle = lambda x, y, r, fill: d.ellipse([(x - r) * u, (y - r) * u, (x + r) * u, (y + r) * u], fill=fill)
    circle(84, 16, 15, '#FFE58A')
    circle(84, 16, 10, SUN)
    for x, y, r in ((15, 24, 6), (23, 19, 8), (31, 24, 6)):
        circle(x, y, r, WHITE)
    d.rounded_rectangle([7 * u, 22 * u, 38 * u, 30 * u], radius=4 * u, fill=WHITE)
    d.polygon(quad((-5 * u, 80 * u), (40 * u, 62 * u), (105 * u, 76 * u), 40) + [(105 * u, 105 * u), (-5 * u, 105 * u)], fill=HILL_LIGHT)
    d.polygon(quad((-5 * u, 90 * u), (55 * u, 76 * u), (105 * u, 88 * u), 40) + [(105 * u, 105 * u), (-5 * u, 105 * u)], fill=HILL)
    return img, d


def save(img, name, size):
    img.resize((size, size), Image.LANCZOS).save(f'{OUT}/{name}')
    print('wrote', name)


# App icon (iOS / store / general): full scene, Binhi large.
big = 1024 * SS
img, d = scene(big)
draw_binhi(d, big / 2, big * 0.56, big / 100 * 0.8, shadow='#45A636')
save(img, 'icon.png', 1024)

# Android adaptive icon: Binhi alone, kept inside the 66% safe zone so any mask shape fits.
fg = Image.new('RGBA', (big, big), (0, 0, 0, 0))
draw_binhi(ImageDraw.Draw(fg), big / 2, big * 0.52, big / 100 * 0.72)
save(fg, 'adaptive-icon.png', 1024)

# Splash: Binhi alone on transparent (background color is set in app.json).
save(fg, 'splash-icon.png', 1024)

# Web favicon.
img, d = scene(256 * SS)
draw_binhi(d, 128 * SS, 256 * SS * 0.56, 256 * SS / 100 * 0.8, shadow='#45A636')
save(img, 'favicon.png', 48)

#!/usr/bin/env python3
"""
Nova Voss — UGC Video Generator
Renders "I let AI dress me for a week" as a 9:16 MP4
"""

import math
import os
import textwrap

import imageio
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

# ── Config ──────────────────────────────────────────────────────────────────
W, H = 720, 1280          # 9:16 vertical
FPS = 30
OUT_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "nova_ugc.mp4")

FONT_BOLD   = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
FONT_REGULAR = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
FONT_ITALIC  = "/usr/share/fonts/truetype/liberation/LiberationSans-Italic.ttf"

# ── Colour palette (Nova brand) ──────────────────────────────────────────────
WHITE      = (255, 255, 255)
OFF_WHITE  = (240, 235, 228)
CREAM      = (220, 210, 195)
GOLD       = (212, 175, 55)
GOLD_LIGHT = (255, 215, 100)
STONE_400  = (168, 162, 158)
STONE_600  = (87, 83, 78)
BLACK      = (0, 0, 0)

# ── Scene definitions ────────────────────────────────────────────────────────
SCENES = [
    {
        "duration": 2.5,
        "caption": "POV: You let AI dress\nyou for a week...",
        "subcaption": None,
        "badge": "POV",
        "badge_color": (255, 255, 255, 30),
        "grad_top": (18, 15, 12),
        "grad_bot": (35, 28, 22),
        "accent": GOLD,
    },
    {
        "duration": 3.0,
        "caption": "Day 1 — I gave the AI\nmy vibe board.",
        "subcaption": "Neutral tones. Clean lines. No clutter.",
        "badge": "Day 1 of 7",
        "badge_color": (212, 175, 55, 50),
        "grad_top": (28, 22, 16),
        "grad_bot": (45, 35, 25),
        "accent": GOLD,
    },
    {
        "duration": 3.0,
        "caption": "It came back\nwith THIS.",
        "subcaption": "Cream ribbed set. Black belt. Gold hoops.",
        "badge": "✦ Outfit Reveal",
        "badge_color": (255, 255, 255, 40),
        "grad_top": (20, 18, 14),
        "grad_bot": (50, 40, 28),
        "accent": GOLD_LIGHT,
    },
    {
        "duration": 3.0,
        "caption": "And the\ncraziest part?",
        "subcaption": "It matched my skin perfectly.",
        "badge": None,
        "badge_color": None,
        "grad_top": (15, 12, 10),
        "grad_bot": (40, 30, 20),
        "accent": CREAM,
    },
    {
        "duration": 3.5,
        "caption": "The vitiligo\npatches?",
        "subcaption": "It styled AROUND them. On purpose.",
        "badge": None,
        "badge_color": None,
        "grad_top": (12, 10, 8),
        "grad_bot": (35, 28, 20),
        "accent": OFF_WHITE,
    },
    {
        "duration": 3.0,
        "caption": "I wore it.\nI got 47 compliments.",
        "subcaption": "(I counted.)",
        "badge": "Real Results",
        "badge_color": (52, 211, 153, 40),
        "grad_top": (10, 20, 15),
        "grad_bot": (25, 45, 35),
        "accent": (100, 220, 160),
    },
    {
        "duration": 3.0,
        "caption": "Built with bolt.diy",
        "subcaption": "AI that actually gets you.",
        "badge": "Powered by bolt.diy",
        "badge_color": (212, 175, 55, 60),
        "grad_top": (30, 20, 8),
        "grad_bot": (12, 10, 8),
        "accent": GOLD_LIGHT,
    },
    {
        "duration": 4.0,
        "caption": "Build it.\nWear it. Own it.",
        "subcaption": "↓  Link in bio to try it yourself  ↓",
        "badge": "Try it free",
        "badge_color": (255, 255, 255, 220),
        "grad_top": (8, 6, 5),
        "grad_bot": (20, 16, 12),
        "accent": WHITE,
    },
]

TOTAL_DURATION = sum(s["duration"] for s in SCENES)
TOTAL_FRAMES   = int(TOTAL_DURATION * FPS)

# ── Helpers ──────────────────────────────────────────────────────────────────

def lerp_color(c1, c2, t):
    return tuple(int(c1[i] + (c2[i] - c1[i]) * t) for i in range(3))

def make_gradient(w, h, top_color, bot_color):
    """Vertical linear gradient."""
    arr = np.zeros((h, w, 3), dtype=np.uint8)
    for y in range(h):
        t = y / (h - 1)
        arr[y, :] = lerp_color(top_color, bot_color, t)
    return Image.fromarray(arr, "RGB")

def add_noise(img, strength=8):
    arr = np.array(img).astype(np.int16)
    noise = np.random.randint(-strength, strength, arr.shape, dtype=np.int16)
    arr = np.clip(arr + noise, 0, 255).astype(np.uint8)
    return Image.fromarray(arr)

def add_vignette(img):
    w, h = img.size
    arr = np.array(img).astype(np.float32)
    cx, cy = w / 2, h / 2
    ys, xs = np.mgrid[0:h, 0:w]
    dist = np.sqrt(((xs - cx) / cx) ** 2 + ((ys - cy) / cy) ** 2)
    vig = np.clip(1.0 - dist * 0.55, 0.3, 1.0)
    arr *= vig[:, :, np.newaxis]
    return Image.fromarray(arr.astype(np.uint8))

def draw_vitiligo_patches(draw, rng, alpha_base=18):
    """Scattered soft white blobs — decorative representation of vitiligo."""
    centers = [
        (int(W * 0.38), int(H * 0.36)),
        (int(W * 0.44), int(H * 0.31)),
        (int(W * 0.52), int(H * 0.34)),
        (int(W * 0.48), int(H * 0.41)),
        (int(W * 0.36), int(H * 0.44)),
        (int(W * 0.55), int(H * 0.52)),
        (int(W * 0.42), int(H * 0.55)),
    ]
    for (cx, cy) in centers:
        rx = int(rng.integers(22, 52))
        ry = int(rng.integers(16, 42))
        patch = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        pd = ImageDraw.Draw(patch)
        pd.ellipse([cx - rx, cy - ry, cx + rx, cy + ry],
                   fill=(255, 255, 255, alpha_base + int(rng.integers(-4, 4))))
        patch = patch.filter(ImageFilter.GaussianBlur(radius=rx // 2))
        draw._image.paste(Image.alpha_composite(draw._image.convert("RGBA"), patch))

def draw_silhouette(canvas):
    """Soft glowing bust silhouette in the frame centre."""
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    # Head
    d.ellipse([W//2 - 80, H//4 - 60, W//2 + 80, H//4 + 100],
              fill=(180, 140, 100, 18))
    # Shoulders / torso
    d.ellipse([W//2 - 150, H//4 + 60, W//2 + 150, H//4 + 340],
              fill=(160, 120, 80, 14))
    overlay = overlay.filter(ImageFilter.GaussianBlur(radius=55))
    canvas.paste(Image.alpha_composite(canvas.convert("RGBA"), overlay))

def draw_progress_bar(draw, elapsed_frac, scene_idx):
    bar_y = 58
    bar_h = 3
    seg_gap = 4
    total = len(SCENES)
    total_w = W - 50
    seg_w = (total_w - seg_gap * (total - 1)) / total
    x0 = 25
    total_dur = TOTAL_DURATION
    elapsed_total = sum(SCENES[i]["duration"] for i in range(scene_idx)) + \
                    elapsed_frac * SCENES[scene_idx]["duration"]

    for i, sc in enumerate(SCENES):
        sx = int(x0 + i * (seg_w + seg_gap))
        ex = int(sx + seg_w)
        # Background
        draw.rounded_rectangle([sx, bar_y, ex, bar_y + bar_h],
                                radius=bar_h // 2, fill=(255, 255, 255, 40))
        # Fill
        sc_start = sum(SCENES[j]["duration"] for j in range(i))
        sc_end   = sc_start + sc["duration"]
        if elapsed_total >= sc_end:
            fill_w = ex - sx
        elif elapsed_total > sc_start:
            fill_w = int((elapsed_total - sc_start) / sc["duration"] * seg_w)
        else:
            fill_w = 0
        if fill_w > 0:
            draw.rounded_rectangle([sx, bar_y, sx + fill_w, bar_y + bar_h],
                                    radius=bar_h // 2, fill=(255, 255, 255, 230))

def draw_tiktok_ui(draw, font_tiny):
    """Right-side actions and bottom creator bar."""
    ax = W - 60
    actions = [("♥", "47k"), ("💬", "1.2k"), ("↗", "Share")]
    for idx, (icon, label) in enumerate(actions):
        ay = H - 340 + idx * 82
        draw.ellipse([ax - 22, ay - 22, ax + 22, ay + 22],
                     fill=(255, 255, 255, 25), outline=(255, 255, 255, 40))
        try:
            draw.text((ax, ay), icon, font=font_tiny, anchor="mm",
                      fill=(255, 255, 255, 210))
        except Exception:
            pass
        draw.text((ax, ay + 30), label, font=font_tiny, anchor="mm",
                  fill=(255, 255, 255, 130))

    # Bottom gradient bar
    bar_h = 160
    for y in range(H - bar_h, H):
        alpha = int(180 * (y - (H - bar_h)) / bar_h)
        draw.line([(0, y), (W, y)], fill=(0, 0, 0, alpha))

    # Avatar circle
    draw.ellipse([22, H - 110, 68, H - 64], fill=(160, 120, 60, 255),
                 outline=(255, 255, 255, 120), width=2)
    draw.text((45, H - 87), "N", font=font_tiny, anchor="mm",
              fill=(255, 255, 255, 240))

    # Handle
    draw.text((80, H - 100), "@nova.voss", font=font_tiny,
              fill=(255, 255, 255, 230))
    draw.text((80, H - 82), "✦", font=font_tiny, fill=(212, 175, 55, 220))
    draw.text((80, H - 65), "#UGC #AIFashion #bolt",
              font=font_tiny, fill=(255, 255, 255, 100))

def draw_badge(draw, text, color, font_small, y_pos=None):
    if text is None:
        return
    r, g, b, a = color if len(color) == 4 else (*color, 180)
    yp = y_pos or int(H * 0.62)

    bbox = draw.textbbox((0, 0), text, font=font_small)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    pad_x, pad_y = 20, 8
    rx0 = W // 2 - tw // 2 - pad_x
    ry0 = yp
    rx1 = W // 2 + tw // 2 + pad_x
    ry1 = yp + th + pad_y * 2

    pill = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    pd   = ImageDraw.Draw(pill)
    pd.rounded_rectangle([rx0, ry0, rx1, ry1], radius=(ry1 - ry0) // 2,
                         fill=(r, g, b, a), outline=(255, 255, 255, 60))
    draw._image.paste(Image.alpha_composite(draw._image.convert("RGBA"), pill))

    text_color = (10, 8, 6, 255) if a > 150 else (255, 255, 255, 230)
    draw.text((W // 2, yp + pad_y + th // 2), text, font=font_small,
              anchor="mm", fill=text_color)

def ease_in_out(t):
    return t * t * (3 - 2 * t)

def render_frame(scene_idx, scene_frac, fade_alpha, rng):
    sc  = SCENES[scene_idx]
    img = make_gradient(W, H, sc["grad_top"], sc["grad_bot"])
    img = add_noise(img, 6)

    draw_silhouette(img)

    img = img.convert("RGBA")
    draw = ImageDraw.Draw(img)

    # Light vitiligo patches
    draw_vitiligo_patches(draw, rng, alpha_base=14)

    # Progress bar
    draw_progress_bar(draw, scene_frac, scene_idx)

    # Notch simulation (top centre)
    draw.rounded_rectangle([W//2 - 55, 8, W//2 + 55, 28],
                            radius=10, fill=(0, 0, 0, 200))

    # Fonts
    try:
        font_hero    = ImageFont.truetype(FONT_BOLD, 62)
        font_sub     = ImageFont.truetype(FONT_REGULAR, 30)
        font_small   = ImageFont.truetype(FONT_REGULAR, 22)
        font_tiny    = ImageFont.truetype(FONT_REGULAR, 18)
    except Exception:
        font_hero = font_sub = font_small = font_tiny = ImageFont.load_default()

    # Caption fade-in: text visible after 0.08 of scene duration
    text_alpha = min(1.0, max(0.0, (scene_frac - 0.08) / 0.25))
    text_alpha = ease_in_out(text_alpha)

    # Badge
    badge_y = int(H * 0.60)
    if sc["badge"]:
        badge_alpha = int(text_alpha * 255)
        bc = sc["badge_color"]
        bc_mod = (bc[0], bc[1], bc[2], min(bc[3], badge_alpha) if len(bc) == 4 else badge_alpha)
        draw_badge(draw, sc["badge"], bc_mod, font_small, y_pos=badge_y)

    # Main caption
    caption_y = int(H * 0.66)
    lines = sc["caption"].split("\n")
    accent = sc["accent"]
    line_h = 72
    for li, line in enumerate(lines):
        y = caption_y + li * line_h
        # Shadow
        draw.text((W // 2 + 2, y + 2), line, font=font_hero, anchor="mm",
                  fill=(0, 0, 0, int(180 * text_alpha)))
        draw.text((W // 2, y), line, font=font_hero, anchor="mm",
                  fill=(*accent, int(255 * text_alpha)))

    # Sub-caption
    if sc["subcaption"]:
        sy = caption_y + len(lines) * line_h + 14
        draw.text((W // 2, sy), sc["subcaption"], font=font_sub, anchor="mm",
                  fill=(255, 255, 255, int(180 * text_alpha)))

    # TikTok UI chrome
    draw_tiktok_ui(draw, font_tiny)

    # Scene-fade overlay (black letterbox fade at start/end)
    if fade_alpha > 0:
        overlay = Image.new("RGBA", (W, H), (0, 0, 0, int(fade_alpha * 255)))
        img = Image.alpha_composite(img, overlay)

    return np.array(img.convert("RGB"))


def compute_fade(scene_frac, fade_frames=8):
    """Return 0..1 fade alpha for first/last N frames of a scene."""
    total_frames = int(SCENES[0]["duration"] * FPS)  # approx
    fade_frac = fade_frames / (SCENES[0]["duration"] * FPS)
    if scene_frac < fade_frac:
        return 1.0 - scene_frac / fade_frac
    if scene_frac > 1.0 - fade_frac:
        return (scene_frac - (1.0 - fade_frac)) / fade_frac
    return 0.0


def main():
    rng = np.random.default_rng(42)
    writer = imageio.get_writer(
        OUT_PATH,
        fps=FPS,
        codec="libx264",
        quality=8,
        macro_block_size=None,
        ffmpeg_params=["-pix_fmt", "yuv420p", "-crf", "18", "-preset", "fast"],
    )

    print(f"Rendering {TOTAL_FRAMES} frames ({TOTAL_DURATION:.1f}s) at {FPS}fps …")

    frame_num = 0
    for si, scene in enumerate(SCENES):
        n_frames = int(scene["duration"] * FPS)
        fade_frames = min(9, n_frames // 6)
        for fi in range(n_frames):
            scene_frac = fi / max(n_frames - 1, 1)

            # Fade calc
            if fi < fade_frames:
                fade = ease_in_out(1.0 - fi / fade_frames)
            elif fi >= n_frames - fade_frames:
                fade = ease_in_out((fi - (n_frames - fade_frames)) / fade_frames)
            else:
                fade = 0.0

            frame = render_frame(si, scene_frac, fade, rng)
            writer.append_data(frame)
            frame_num += 1

            if frame_num % 30 == 0:
                pct = frame_num / TOTAL_FRAMES * 100
                print(f"  {pct:5.1f}%  scene {si+1}/{len(SCENES)}", end="\r", flush=True)

    writer.close()
    size_mb = os.path.getsize(OUT_PATH) / 1024 / 1024
    print(f"\nDone! → {OUT_PATH}  ({size_mb:.1f} MB)")


if __name__ == "__main__":
    main()

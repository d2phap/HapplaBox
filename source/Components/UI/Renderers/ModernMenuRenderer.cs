﻿
using HapplaBox.UI.WinApi;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Windows.Forms;

namespace HapplaBox.UI.Renderers {
    public class ModernMenuRenderer: ToolStripProfessionalRenderer {
        private Theme theme { get; set; }

        public ModernMenuRenderer(Theme theme) : base(new ModernColors()) {
            this.theme = theme;
        }

        protected override void OnRenderItemText(ToolStripItemTextRenderEventArgs e) {
            if (e.Item.Enabled) {
                // on hover
                if (e.Item.Selected) {
                    e.TextColor = theme.MenuTextHoverColor;
                }
                else {
                    e.TextColor = theme.MenuTextColor;
                }

                base.OnRenderItemText(e);
            }
            else {
                if (theme.MenuBackgroundColor.GetBrightness() > 0.5) // light background color
                {
                    e.TextColor = ThemeUtils.DarkenColor(theme.MenuBackgroundColor, 0.5f);
                }
                else // dark background color
                {
                    e.TextColor = ThemeUtils.LightenColor(theme.MenuBackgroundColor, 0.5f);
                }

                base.OnRenderItemText(e);
            }
        }

        protected override void OnRenderSeparator(ToolStripSeparatorRenderEventArgs e) {
            if (e.Vertical || !(e.Item is ToolStripSeparator)) {
                base.OnRenderSeparator(e);
            }
            else {
                var tsBounds = new Rectangle(Point.Empty, e.Item.Size);

                var lineY = tsBounds.Bottom - (tsBounds.Height / 2);
                var lineLeft = tsBounds.Left;
                var lineRight = tsBounds.Right;

                using var pen = new Pen(Color.Black);
                if (theme.MenuBackgroundColor.GetBrightness() > 0.5) // light background color
                {
                    pen.Color = Color.FromArgb(35, 0, 0, 0);
                }
                else // dark background color
                {
                    pen.Color = Color.FromArgb(35, 255, 255, 255);
                }

                e.Graphics.SmoothingMode = SmoothingMode.HighQuality;
                e.Graphics.DrawLine(pen, lineLeft, lineY, lineRight, lineY);

                base.OnRenderSeparator(e);
            }
        }

        protected override void OnRenderToolStripBackground(ToolStripRenderEventArgs e) {
            if (e.ToolStrip is ToolStripDropDown) {
                e.Graphics.SmoothingMode = SmoothingMode.HighQuality;

                // draw background
                using var brush = new SolidBrush(theme.MenuBackgroundColor);
                e.Graphics.FillRectangle(brush, e.AffectedBounds);

                // draw border
                using var pen = new Pen(Color.Black);
                if (theme.MenuBackgroundColor.GetBrightness() > 0.5) // light background color
                {
                    pen.Color = Color.FromArgb(35, 0, 0, 0);
                }
                else // dark background color
                {
                    pen.Color = Color.FromArgb(35, 255, 255, 255);
                }

                e.Graphics.DrawRectangle(pen, 0, 0, e.AffectedBounds.Width - 1, e.AffectedBounds.Height - 1);
            }

            base.OnRenderToolStripBackground(e);
        }


        protected override void OnRenderArrow(ToolStripArrowRenderEventArgs e) {
            var textColor = e.Item.Selected ? theme.MenuTextHoverColor : theme.MenuTextColor;

            if (!e.Item.Enabled) {
                if (theme.MenuBackgroundColor.GetBrightness() > 0.5) //light background color
                {
                    textColor = ThemeUtils.DarkenColor(theme.MenuBackgroundColor, 0.5f);
                }
                else //dark background color
                {
                    textColor = ThemeUtils.LightenColor(theme.MenuBackgroundColor, 0.5f);
                }
            }

            using var pen = new Pen(textColor, DPIScaling.Transform<float>(1));
            e.Graphics.SmoothingMode = SmoothingMode.HighQuality;

            e.Graphics.DrawLine(pen,
                e.Item.Width - (5 * e.Item.Height / 8),
                3 * e.Item.Height / 8,
                e.Item.Width - (4 * e.Item.Height / 8),
                e.Item.Height / 2);

            e.Graphics.DrawLine(pen,
                e.Item.Width - (4 * e.Item.Height / 8),
                e.Item.Height / 2,
                e.Item.Width - (5 * e.Item.Height / 8),
                5 * e.Item.Height / 8);


            // Render ShortcutKeyDisplayString for menu item with dropdown
            if (e.Item is ToolStripMenuItem) {
                var mnu = e.Item as ToolStripMenuItem;

                if (!string.IsNullOrWhiteSpace(mnu?.ShortcutKeyDisplayString)) {
                    var shortcutSize = e.Graphics.MeasureString(mnu.ShortcutKeyDisplayString, mnu.Font);
                    var shortcutRect = new RectangleF(e.ArrowRectangle.X - shortcutSize.Width - DPIScaling.Transform<float>(13),
                        e.Item.Height / 2 - shortcutSize.Height / 2,
                        shortcutSize.Width,
                        shortcutSize.Height);

                    e.Graphics.DrawString(mnu.ShortcutKeyDisplayString,
                        e.Item.Font,
                        new SolidBrush(textColor),
                        shortcutRect);
                }
            }
        }

        protected override void OnRenderItemCheck(ToolStripItemImageRenderEventArgs e) {
            var textColor = e.Item.Selected ? theme.MenuTextHoverColor : theme.MenuTextColor;
            using var pen = new Pen(textColor, DPIScaling.Transform<float>(2));
            e.Graphics.SmoothingMode = SmoothingMode.HighQuality;

            e.Graphics.DrawLine(pen,
                (2 * e.Item.Height / 10) + 1,
                e.Item.Height / 2,
                (4 * e.Item.Height / 10) + 1,
                7 * e.Item.Height / 10);

            e.Graphics.DrawLine(pen,
                4 * e.Item.Height / 10,
                7 * e.Item.Height / 10,
                8 * e.Item.Height / 10,
                3 * e.Item.Height / 10);
        }


        protected override void OnRenderMenuItemBackground(ToolStripItemRenderEventArgs e) {
            // hover on enable item
            if (e.Item.Selected && e.Item.Enabled) {
                e.Graphics.SmoothingMode = SmoothingMode.HighQuality;

                // Windows 11 style
                var borderRadius = 5;
                var rect = new Rectangle(3, 1, e.Item.Bounds.Width - 6, e.Item.Bounds.Height - 2);
                using var brush = new SolidBrush(theme.MenuBackgroundHoverColor);

                using var path = ThemeUtils.GetRoundRectanglePath(rect, borderRadius);
                e.Graphics.FillPath(brush, path);

                return;
            }

            base.OnRenderMenuItemBackground(e);
        }

    }

    public class ModernColors: ProfessionalColorTable {
        public override Color MenuItemSelected => Color.Transparent;
        public override Color MenuBorder => Color.Transparent;
        public override Color MenuItemBorder => Color.Transparent;

        public override Color ImageMarginGradientBegin => Color.Transparent;
        public override Color ImageMarginGradientMiddle => Color.Transparent;
        public override Color ImageMarginGradientEnd => Color.Transparent;
        public override Color SeparatorDark => Color.Transparent;
        public override Color SeparatorLight => Color.Transparent;
        public override Color CheckBackground => Color.Transparent;
        public override Color CheckPressedBackground => Color.Transparent;
        public override Color CheckSelectedBackground => Color.Transparent;
        public override Color ButtonSelectedBorder => Color.Transparent;
        public override Color ToolStripDropDownBackground => base.ToolStripDropDownBackground;


    }
}

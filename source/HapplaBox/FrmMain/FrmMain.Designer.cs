namespace HapplaBox
{
    partial class FrmMain
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(FrmMain));
            this.Web2 = new Microsoft.Web.WebView2.WinForms.WebView2();
            ((System.ComponentModel.ISupportInitialize)(this.Web2)).BeginInit();
            this.SuspendLayout();
            // 
            // Web2
            // 
            this.Web2.CreationProperties = null;
            this.Web2.DefaultBackgroundColor = System.Drawing.Color.Transparent;
            this.Web2.Dock = System.Windows.Forms.DockStyle.Fill;
            this.Web2.Location = new System.Drawing.Point(0, 0);
            this.Web2.Name = "Web2";
            this.Web2.Size = new System.Drawing.Size(1149, 690);
            this.Web2.TabIndex = 0;
            this.Web2.ZoomFactor = 1D;
            this.Web2.CoreWebView2InitializationCompleted += new System.EventHandler<Microsoft.Web.WebView2.Core.CoreWebView2InitializationCompletedEventArgs>(this.Web2_CoreWebView2InitializationCompleted);
            this.Web2.NavigationCompleted += new System.EventHandler<Microsoft.Web.WebView2.Core.CoreWebView2NavigationCompletedEventArgs>(this.Web2_NavigationCompleted);
            // 
            // FrmMain
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(9F, 23F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(1149, 690);
            this.Controls.Add(this.Web2);
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.Name = "FrmMain";
            this.Text = "HapplaBox";
            ((System.ComponentModel.ISupportInitialize)(this.Web2)).EndInit();
            this.ResumeLayout(false);

        }

        #endregion

        private Microsoft.Web.WebView2.WinForms.WebView2 Web2;
    }
}
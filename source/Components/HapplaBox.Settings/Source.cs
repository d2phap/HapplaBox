using Microsoft.Extensions.Configuration;
using System;

namespace HapplaBox.Settings
{
    public class Source
    {

        #region Public properties

        /// <summary>
        /// Gets the user config file name.
        /// </summary>
        public string UserFilename { get => "happlaboxConfig.json"; }


        /// <summary>
        /// Gets the default config file located.
        /// </summary>
        public string DefaultFilename { get => "happlaboxConfig.default.json"; }


        /// <summary>
        /// Gets the admin config file name.
        /// </summary>
        public string AdminFilename { get => "happlaboxConfig.admin.json"; }


        /// <summary>
        /// Config file description
        /// </summary>
        public string Description { get; set; } = "HapplaBox configuration file";


        /// <summary>
        /// Config file version
        /// </summary>
        public string Version { get; set; } = "10.0";


        /// <summary>
        /// Gets, sets value indicates that the config file is compatible with this HapplaBox version or not
        /// </summary>
        public bool IsCompatible { get; set; } = true;


        #endregion




        #region Public methods


        /// <summary>
        /// Loads all config files: default, user, command-lines, admin;
        /// then unify configs.
        /// </summary>
        public IConfigurationRoot LoadUserConfigs()
        {
            var userConfig = new ConfigurationBuilder()
              .SetBasePath(App.ConfigDir(PathType.Dir))
              .AddJsonFile(this.DefaultFilename, optional: true)
              .AddJsonFile(this.UserFilename, optional: true)
              .AddCommandLine(Environment.GetCommandLineArgs())
              .AddJsonFile(this.AdminFilename, optional: true)
              .Build();

            return userConfig;
        }


        #endregion


    }
}

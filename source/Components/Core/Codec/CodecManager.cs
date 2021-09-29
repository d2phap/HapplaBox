using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;

namespace HapplaBox.Core.Codec
{
    public class CodecManager
    {
        public List<ICodec> Items { get; set; } = new List<ICodec>();


        /// <summary>
        /// Gets a codec
        /// </summary>
        /// <param name="codecId">Codec type fullname</param>
        /// <returns></returns>
        public ICodec? Get(string codecId)
        {
            var codec = this.Items.Find(item => item.GetType().FullName == codecId);

            return codec;
        }


        /// <summary>
        /// Loads all *.dll files and all codecs inside.
        /// </summary>
        /// <param name="codecDir"></param>
        public void LoadAllCodecs(string codecDir)
        {
            Directory.CreateDirectory(codecDir);
            var files = Directory.GetFiles(codecDir, "*.dll", SearchOption.TopDirectoryOnly);


            this.Items = files.SelectMany(path =>
            {
                var pluginAssembly = LoadPlugin(path);

                return CreateCodecs(pluginAssembly);
            }).ToList();
        }


        /// <summary>
        /// Loads all codecs in the assembly file
        /// </summary>
        /// <param name="assembly"></param>
        /// <returns></returns>
        private IEnumerable<ICodec> CreateCodecs(Assembly assembly)
        {
            foreach (Type type in assembly.GetTypes())
            {
                if (typeof(ICodec).IsAssignableFrom(type))
                {
                    if (Activator.CreateInstance(type) is ICodec result)
                    {
                        yield return result;
                    }
                }
            }
        }

        private Assembly LoadPlugin(string relativePath)
        {
            // Navigate up to the solution root
            var root = Path.GetFullPath(Path.Combine(
                Path.GetDirectoryName(
                    Path.GetDirectoryName(
                        Path.GetDirectoryName(
                            Path.GetDirectoryName(
                                Path.GetDirectoryName(typeof(CodecManager).Assembly.Location)))))));

            var pluginLocation = Path.GetFullPath(Path.Combine(root, relativePath.Replace('\\', Path.DirectorySeparatorChar)));

            var loadContext = new DllLoadContext(pluginLocation);

            return loadContext.LoadFromAssemblyName(new AssemblyName(Path.GetFileNameWithoutExtension(pluginLocation)));
        }
    }
}

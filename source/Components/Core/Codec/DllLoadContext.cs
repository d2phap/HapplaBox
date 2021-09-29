﻿using System;
using System.Reflection;
using System.Runtime.Loader;


namespace HapplaBox.Core.Codec
{
    public class DllLoadContext : AssemblyLoadContext
    {
        private AssemblyDependencyResolver _resolver;

        public DllLoadContext(string pluginPath)
        {
            _resolver = new AssemblyDependencyResolver(pluginPath);
        }

        protected override Assembly? Load(AssemblyName assemblyName)
        {
            var assemblyPath = _resolver.ResolveAssemblyToPath(assemblyName);
            if (!string.IsNullOrEmpty(assemblyPath))
            {
                return LoadFromAssemblyPath(assemblyPath);
            }

            return null;
        }

        protected override IntPtr LoadUnmanagedDll(string unmanagedDllName)
        {
            var libraryPath = _resolver.ResolveUnmanagedDllToPath(unmanagedDllName);

            if (!string.IsNullOrEmpty(libraryPath))
            {
                return LoadUnmanagedDllFromPath(libraryPath);
            }

            return IntPtr.Zero;
        }
    }
}

using HapplaBox.Core.Codec;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Threading.Tasks;

namespace HapplaBox.Core.Services
{
    public class GalleryService : IDisposable
    {

        #region IDisposable Disposing

        private bool _disposed = false;

        protected virtual void Dispose(bool disposing)
        {
            if (_disposed)
                return;

            if (disposing)
            {
                // Free any other managed objects here.
                this.ImgList.Dispose();
                this.QueuedList.Clear();
                this.CacheItems.Clear();

                if (this.Worker != null)
                {
                    this.Worker.DoWork -= Worker_DoWork;
                    this.Worker.Dispose();
                }
            }

            // Free any unmanaged objects here.
            _disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        ~GalleryService()
        {
            Dispose(false);
        }

        #endregion


        #region PRIVATE PROPERTIES

        /// <summary>
        /// Background service worker
        /// </summary>
        private BackgroundWorker Worker;


        private int MaxCacheItems { get; set; } = 50;


        /// <summary>
        /// The dictionary of thumbnails
        /// </summary>
        private Dictionary<int, string> CacheItems { get; set; }


        /// <summary>
        /// The list of image indexes that waiting for loading
        /// </summary>
        private List<int> QueuedList { get; set; } = new();


        private ImgFactory ImgList { get; set; }

        #endregion


        #region PUBLIC PROPERTIES

        /// <summary>
        /// Gets, sets default codec
        /// </summary>
        public ICodec Codec { get; set; }

        /// <summary>
        /// Gets, sets thumbnail width
        /// </summary>
        public int Width { get; set; } = 100;

        /// <summary>
        /// Gets, sets thumbnail height
        /// </summary>
        public int Height { get; set; } = 100;


        /// <summary>
        /// The handler to notify thumbnail item is rendered
        /// </summary>
        public ItemRenderedEvent ItemRenderedHandler { get; set; }
        public delegate void ItemRenderedEvent(int itemIndex);

        #endregion


        /// <summary>
        /// Initializes instance
        /// </summary>
        /// <param name="defaultCodec">Default codec</param>
        /// <param name="thumbnailIndexes">List of thumbnail indexes</param>
        public GalleryService(ICodec defaultCodec, ImgFactory list)
        {
            Initialize(defaultCodec, list);
        }


        #region PRIVATE FUNCTIONS

        /// <summary>
        /// Initializes instance
        /// </summary>
        /// <param name="defaultCodec">Default codec</param>
        /// <param name="thumbnailIndexes">List of thumbnail indexes</param>
        private void Initialize(ICodec defaultCodec, ImgFactory list)
        {
            this.Codec = defaultCodec;
            this.ImgList = list;
            this.CacheItems = new(this.MaxCacheItems);

            // import filenames to the list
            this.CacheItems.Clear();

            // background worker
            this.Worker = new();
            this.Worker.DoWork -= Worker_DoWork;
            this.Worker.DoWork += Worker_DoWork;
        }

        private void Worker_DoWork(object? sender, DoWorkEventArgs e)
        {
            while (this.QueuedList.Count > 0)
            {
                // pop out the first item
                var index = this.QueuedList[0];
                QueuedList.RemoveAt(0);

                _ = Task.Run(() =>
                {
                    if (this.CacheItems.ContainsKey(index) is false)
                    {
                        // limit number of items cached
                        if (this.CacheItems.Count == this.MaxCacheItems - 1)
                        {
                            this.CacheItems.Remove(0);
                        }

                        // start loading thumbnail
                        var thumbnailData = this.Codec.GetThumbnailBase64(this.ImgList.GetFileName(index), this.Width, this.Height);
                        this.CacheItems.Add(index, thumbnailData);
                    }

                    // emit event
                    ItemRenderedHandler?.Invoke(index);
                });
            }
        }

        #endregion




        /// <summary>
        /// Adds item indexes to the queue
        /// </summary>
        /// <param name="indexes"></param>
        public void AddToQueue(int[] indexes)
        {
            this.QueuedList.AddRange(indexes);
            this.Worker.RunWorkerAsync();
        }

        /// <summary>
        /// Gets thumbnail data as base64 string
        /// </summary>
        /// <param name="index"></param>
        /// <returns></returns>
        public string Get(int index)
        {
            return this.CacheItems[index];
        }

    }
}

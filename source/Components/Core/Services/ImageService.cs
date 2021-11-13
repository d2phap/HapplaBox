
using HapplaBox.Core.Codec;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace HapplaBox.Core
{
    public class ImageService : IDisposable
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
                this.FileNames.Clear();
                this.QueuedList.Clear();
                this.ImgList.Clear();
                this.FreeList.Clear();

                if (this.ImageBooster != null)
                {
                    this.ImageBooster.DoWork -= ImageBooster_DoWork;
                    this.ImageBooster.Dispose();
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

        ~ImageService()
        {
            Dispose(false);
        }

        #endregion



        #region PRIVATE PROPERTIES

        /// <summary>
        /// Image booster background service
        /// </summary>
        private BackgroundWorker ImageBooster = new();


        /// <summary>
        /// The list of Imgs
        /// </summary>
        private List<Img> ImgList { get; set; } = new();


        /// <summary>
        /// The list of image index that waiting for loading
        /// </summary>
        private List<int> QueuedList { get; set; } = new();


        /// <summary>
        /// The list of image index that waiting for releasing resource
        /// </summary>
        private List<int> FreeList { get; set; } = new();


        #endregion



        #region PUBLIC PROPERTIES

        /// <summary>
        /// Gets, sets default codec
        /// </summary>
        public ICodec Codec { get; set; }


        /// <summary>
        /// Gets length of Img list
        /// </summary>
        public int Length => this.ImgList.Count;


        /// <summary>
        /// Gets, sets image size
        /// </summary>
        public Size ImgSize { get; set; } = new();


        /// <summary>
        /// Gets filenames list
        /// </summary>
        public List<string> FileNames
        {
            get
            {
                var list = this.ImgList.Select(item => item.Filename).ToList();

                return list;
            }
        }


        /// <summary>
        /// Gets, sets the number of maximum items in queue list for 1 direction (Next or Back navigation).
        /// The maximum number of items in queue list is 2x + 1.
        /// </summary>
        public int MaxQueue { get; set; } = 1;


        #endregion



        /// <summary>
        /// Initializes instance
        /// </summary>
        /// <param name="defaultCodec">Default codec</param>
        public ImageService(ICodec defaultCodec)
        {
            Initialize(defaultCodec, new List<string>(0));
        }


        /// <summary>
        /// Initializes instance
        /// </summary>
        /// <param name="defaultCodec">Default codec</param>
        /// <param name="filenames">List of filenames</param>
        public ImageService(ICodec defaultCodec, IEnumerable<string> filenames)
        {
            Initialize(defaultCodec, filenames);
        }



        #region PRIVATE FUNCTIONS

        /// <summary>
        /// Initializes instance
        /// </summary>
        /// <param name="defaultCodec">Default codec</param>
        /// <param name="filenames">List of filenames</param>
        private void Initialize(ICodec defaultCodec, IEnumerable<string> filenames)
        {
            this.Codec = defaultCodec;

            // todo:
            // sort and filter file list
            ///////////////////////////////////////////////////

            // import filenames to the list
            this.ImgList.Clear();
            foreach (var filename in filenames)
            {
                this.ImgList.Add(new Img(filename, this.Codec));
            }

            // background worker
            this.ImageBooster.DoWork -= ImageBooster_DoWork;
            this.ImageBooster.DoWork += ImageBooster_DoWork;
        }

        private async void ImageBooster_DoWork(object? sender, DoWorkEventArgs e)
        {
            while (this.QueuedList.Count > 0)
            {
                // pop out the first item
                var index = this.QueuedList[0];
                var img = this.ImgList[index];

                QueuedList.RemoveAt(0);


                if (!img.IsDone)
                {
                    // start loading image file
                    await img.LoadAsync(this.ImgSize.Width, this.ImgSize.Height);
                }
            }
        }


        /// <summary>
        /// Add index of the image to queue list
        /// </summary>
        /// <param name="index">Current index of image list</param>
        private void UpdateQueueList(int index)
        {
            // check valid index
            if (index < 0 || index >= this.ImgList.Count) return;

            var list = new HashSet<int> { index };


            var maxCachedItems = this.MaxQueue * 2 + 1;
            var iRight = index;
            var iLeft = index;


            // add index in the range in order: index -> right -> left -> ...
            for (int i = 0; list.Count < maxCachedItems && list.Count < this.ImgList.Count; i++)
            {
                // if i is even number
                if ((i & 1) == 0)
                {
                    // add right item: [index + 1; ...; to]
                    iRight += 1;

                    if (iRight < this.ImgList.Count)
                    {
                        list.Add(iRight);
                    }
                    else
                    {
                        list.Add(iRight - this.ImgList.Count);
                    }
                }
                // if i is odd number
                else
                {
                    // add left item: [index - 1; ...; from]
                    iLeft -= 1;

                    if (iLeft >= 0)
                    {
                        list.Add(iLeft);
                    }
                    else
                    {
                        list.Add(this.ImgList.Count + iLeft);
                    }
                }
            }


            // release the resources
            foreach (var indexItem in this.FreeList)
            {
                if (!list.Contains(indexItem) && indexItem >= 0 && indexItem < this.ImgList.Count)
                {
                    this.Unload(indexItem);
                }
            }


            // update new index of free list
            this.FreeList.Clear();
            this.FreeList.AddRange(list);

            // update queue list
            this.QueuedList.Clear();
            this.QueuedList.AddRange(list);
        }

        #endregion



        #region PUBLIC FUNCTIONS

        /// <summary>
        /// Get Img data
        /// </summary>
        /// <param name="index">image index</param>
        /// <param name="useCache"></param>
        /// <returns></returns>
        public async Task<Img?> GetAsync(int index, bool useCache = true)
        {
            // reload fresh new image data
            if (!useCache)
            {
                await this.ImgList[index].LoadAsync(this.ImgSize.Width, this.ImgSize.Height);
            }

            // get image data from cache
            else
            {
                // update queue list according to index
                UpdateQueueList(index);

                this.ImageBooster.RunWorkerAsync(index);
            }


            // wait until the image loading is done
            if (ImgList.Count > 0)
            {
                while (!this.ImgList[index].IsDone)
                {
                    await Task.Delay(10);
                }

                return ImgList[index];
            }


            return null;
        }


        /// <summary>
        /// Gets filename with the given index
        /// </summary>
        /// <param name="index"></param>
        /// <returns>Returns filename or empty string</returns>
        public string GetFileName(int index)
        {
            try
            {
                return this.ImgList[index].Filename;
            }
            catch (ArgumentOutOfRangeException)
            {
                return string.Empty;
            }
        }


        /// <summary>
        /// Set filename
        /// </summary>
        /// <param name="index"></param>
        /// <param name="filename">Image filename</param>
        public void SetFileName(int index, string filename)
        {
            if (this.ImgList[index] != null)
            {
                this.ImgList[index].Filename = filename;
            }
        }


        /// <summary>
        /// Find index with the given filename
        /// </summary>
        /// <param name="filename">Image filename</param>
        /// <returns></returns>
        public int IndexOf(string filename)
        {
            if (string.IsNullOrEmpty(filename.Trim()))
            {
                return -1;
            }

            // case sensitivity, esp. if filename passed on command line
            return this.ImgList.FindIndex(item => item.Filename.ToUpperInvariant() == filename.ToUpperInvariant());
        }


        /// <summary>
        /// Unload and release resources of item with the given index
        /// </summary>
        /// <param name="index"></param>
        public void Unload(int index)
        {
            if (this.ImgList[index] != null)
            {
                var item = this.ImgList[index];

                this.ImgList[index].Dispose();
                this.ImgList[index] = new Img(item.Filename, this.Codec);
            }
        }


        /// <summary>
        /// Remove an item in the list with the given index
        /// </summary>
        /// <param name="index"></param>
        public void Remove(int index)
        {
            this.Unload(index);
            this.ImgList.RemoveAt(index);
        }


        /// <summary>
        /// Clear all cached images and release resource of the list
        /// </summary>
        public void ClearCache()
        {
            // release the resources of the img list
            for (int i = 0; i < this.ImgList.Count; i++)
            {
                this.Unload(i);
            }

            this.QueuedList.Clear();
        }


        /// <summary>
        /// Update cached images
        /// </summary>
        public void UpdateCache()
        {
            // clear current queue list
            this.QueuedList.Clear();

            var cachedIndexList = this.ImgList
                .Select((item, index) => new { ImgItem = item, Index = index })
                .Where(item => item.ImgItem.IsDone)
                .Select(item => item.Index)
                .ToList();

            // release the cachced images
            foreach (var index in cachedIndexList)
            {
                this.Unload(index);
            }

            // add to queue list
            this.QueuedList.AddRange(cachedIndexList);
        }


        /// <summary>
        /// Empty and release resource of the list
        /// </summary>
        public void Clear()
        {
            // release the resources of the img list
            this.ClearCache();
            this.ImgList.Clear();
        }


        /// <summary>
        /// Check if the folder path of input filename exists in the list
        /// </summary>
        /// <param name="filename"></param>
        /// <returns></returns>
        public bool ContainsDirPathOf(string filename)
        {
            var target = Path.GetDirectoryName(filename)?.ToUpperInvariant();

            var index = this.ImgList.FindIndex(item => Path.GetDirectoryName(item.Filename)?.ToUpperInvariant() == target);

            return index != -1;
        }

        #endregion

    }
}

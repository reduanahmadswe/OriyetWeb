'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { Search, FileText, Download, Eye, Calendar, Newspaper } from 'lucide-react';
import { newsletterAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { Loading, Pagination } from '@/components/ui';

interface Newsletter {
  id: number;
  title: string;
  description?: string;
  thumbnail?: string;
  pdfLink: string;
  views: number;
  downloads: number;
  createdAt: string;
}

// Function to convert Google Drive link to embeddable/viewable format
const getGoogleDriveViewUrl = (url: string) => {
  if (!url) return '';
  
  // Extract file ID from various Google Drive URL formats
  let fileId = '';
  
  // Format: https://drive.google.com/file/d/FILE_ID/view
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) {
    fileId = fileMatch[1];
  }
  
  // Format: https://drive.google.com/open?id=FILE_ID
  const openMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (openMatch) {
    fileId = openMatch[1];
  }
  
  // Format: https://drive.google.com/uc?id=FILE_ID
  const ucMatch = url.match(/\/uc\?.*id=([a-zA-Z0-9_-]+)/);
  if (ucMatch) {
    fileId = ucMatch[1];
  }
  
  if (fileId) {
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }
  
  return url;
};

// Function to get Google Drive direct download URL
const getGoogleDriveDownloadUrl = (url: string) => {
  if (!url) return '';
  
  let fileId = '';
  
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) {
    fileId = fileMatch[1];
  }
  
  const openMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (openMatch) {
    fileId = openMatch[1];
  }
  
  const ucMatch = url.match(/\/uc\?.*id=([a-zA-Z0-9_-]+)/);
  if (ucMatch) {
    fileId = ucMatch[1];
  }
  
  if (fileId) {
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }
  
  return url;
};

// Function to get Google Drive thumbnail URL
const getGoogleDriveThumbnailUrl = (url: string) => {
  if (!url) return '';
  
  let fileId = '';
  
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) {
    fileId = fileMatch[1];
  }
  
  const openMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (openMatch) {
    fileId = openMatch[1];
  }
  
  const ucMatch = url.match(/\/uc\?.*id=([a-zA-Z0-9_-]+)/);
  if (ucMatch) {
    fileId = ucMatch[1];
  }
  
  if (fileId) {
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w400`;
  }
  
  return url;
};

export default function NewsletterPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [viewingNewsletter, setViewingNewsletter] = useState<Newsletter | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['newsletters', page, search],
    queryFn: async () => {
      const response = await newsletterAPI.getAll({
        page,
        limit: 12,
        search,
      });
      return response.data;
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const handleView = async (newsletter: Newsletter) => {
    setViewingNewsletter(newsletter);
    try {
      await newsletterAPI.incrementViews(newsletter.id);
    } catch (error) {
      console.error('Failed to increment views:', error);
    }
  };

  const handleDownload = async (newsletter: Newsletter) => {
    try {
      await newsletterAPI.incrementDownloads(newsletter.id);
      window.open(getGoogleDriveDownloadUrl(newsletter.pdfLink), '_blank');
    } catch (error) {
      console.error('Failed to increment downloads:', error);
      window.open(getGoogleDriveDownloadUrl(newsletter.pdfLink), '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#004aad]/5 to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ff7620]/5 rounded-full blur-3xl -mr-40 -mt-40 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#004aad]/5 rounded-full blur-3xl -ml-40 -mb-40 pointer-events-none" />

      {/* Header */}
      <section className="relative pt-20 pb-12 text-center z-10">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block py-1 px-3 rounded-full bg-[#004aad]/10 text-[#004aad] text-sm font-semibold mb-4">
              <Newspaper className="w-4 h-4 inline mr-1" />
              Stay Updated
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#004aad]">
              Newsletter
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Browse our collection of newsletters to stay informed about our latest updates, events, and insights.
            </p>

            {/* Search */}
            <form onSubmit={handleSearch} className="max-w-xl mx-auto relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-[#004aad] transition-colors" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search newsletters..."
                className="block w-full pl-11 pr-4 py-4 border-2 border-gray-100 rounded-2xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#004aad]/30 focus:ring-4 focus:ring-[#004aad]/5 transition-all shadow-lg shadow-gray-100/50"
              />
              <button
                type="submit"
                className="absolute inset-y-2 right-2 px-6 bg-[#004aad] hover:bg-[#003882] text-white rounded-xl font-medium transition-colors shadow-md hover:shadow-lg"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Newsletter Grid */}
      <section className="container-custom pb-24 relative z-10">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 animate-pulse">
                  <div className="h-48 bg-gray-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                    <div className="flex gap-2 pt-2">
                      <div className="h-10 bg-gray-200 rounded flex-1" />
                      <div className="h-10 bg-gray-200 rounded flex-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : data?.newsletters?.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {data.newsletters.map((newsletter: Newsletter) => (
                  <article 
                    key={newsletter.id} 
                    className="group bg-white rounded-2xl overflow-hidden shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300 border border-gray-100 flex flex-col hover:-translate-y-1"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-48 w-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-[#004aad]/10 to-[#ff7620]/10">
                      {newsletter.thumbnail ? (
                        <Image
                          src={getGoogleDriveThumbnailUrl(newsletter.thumbnail)}
                          alt={newsletter.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                          unoptimized
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <FileText className="w-16 h-16 text-[#004aad]/30" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-grow">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#004aad] transition-colors leading-tight">
                        {newsletter.title}
                      </h3>

                      {newsletter.description && (
                        <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-grow leading-relaxed">
                          {newsletter.description}
                        </p>
                      )}

                      {/* Stats */}
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(newsletter.createdAt)}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            {newsletter.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Download className="w-3.5 h-3.5" />
                            {newsletter.downloads}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2 border-t border-gray-100">
                        <button
                          onClick={() => handleView(newsletter)}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-[#004aad] hover:bg-[#003882] text-white text-sm font-medium rounded-xl transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                        <button
                          onClick={() => handleDownload(newsletter)}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-[#ff7620] hover:bg-[#e56a1a] text-white text-sm font-medium rounded-xl transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              {data.pagination?.totalPages > 1 && (
                <div className="pt-16 pb-8 flex justify-center">
                  <Pagination
                    currentPage={page}
                    totalPages={data.pagination.totalPages}
                    onPageChange={(newPage) => {
                      setPage(newPage);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-xl max-w-2xl mx-auto px-4">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Newspaper className="w-8 h-8 text-[#004aad]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No newsletters found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {search 
                  ? "No newsletters match your search. Try different keywords."
                  : "There are no newsletters available at the moment. Please check back later."}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* PDF Viewer Modal */}
      {viewingNewsletter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setViewingNewsletter(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col w-full max-w-6xl" style={{ height: '90vh' }}>
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-900 truncate">
                  {viewingNewsletter.title}
                </h3>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => handleDownload(viewingNewsletter)}
                  className="flex items-center gap-2 py-2 px-4 bg-[#ff7620] hover:bg-[#e56a1a] text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={() => setViewingNewsletter(null)}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* PDF Viewer */}
            <div className="flex-1 overflow-hidden bg-white">
              <iframe
                src={getGoogleDriveViewUrl(viewingNewsletter.pdfLink)}
                className="w-full h-full border-0"
                allow="autoplay"
                title={viewingNewsletter.title}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

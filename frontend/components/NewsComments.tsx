import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
}

interface NewsCommentsProps {
  newsId: string;
}

export default function NewsComments({ newsId }: NewsCommentsProps) {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());

  // Load comments from localStorage on component mount
  useEffect(() => {
    const loadComments = () => {
      try {
        const storedComments = localStorage.getItem(`news-comments-${newsId}`);
        if (storedComments) {
          setComments(JSON.parse(storedComments));
        } else {
          // Initialize with empty comments instead of sample comments
          setComments([]);
        }
      } catch (error) {
        console.error('Error loading comments from localStorage:', error);
        // Initialize with empty comments if there's an error
        setComments([]);
      }
    };

    // Load liked comments from localStorage
    const loadLikedComments = () => {
      try {
        const storedLikedComments = localStorage.getItem(`liked-comments-${newsId}`);
        if (storedLikedComments) {
          setLikedComments(new Set(JSON.parse(storedLikedComments)));
        }
      } catch (error) {
        console.error('Error loading liked comments from localStorage:', error);
      }
    };

    if (newsId) {
      loadComments();
      loadLikedComments();
    }
  }, [newsId]);

  // Save comments to localStorage whenever comments change
  useEffect(() => {
    if (newsId) {
      try {
        localStorage.setItem(`news-comments-${newsId}`, JSON.stringify(comments));
      } catch (error) {
        console.error('Error saving comments to localStorage:', error);
      }
    }
  }, [comments, newsId]);

  // Save liked comments to localStorage whenever liked comments change
  useEffect(() => {
    if (newsId) {
      try {
        localStorage.setItem(`liked-comments-${newsId}`, JSON.stringify(Array.from(likedComments)));
      } catch (error) {
        console.error('Error saving liked comments to localStorage:', error);
      }
    }
  }, [likedComments, newsId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('Yorum yapmak için giriş yapmalısınız.');
      return;
    }
    
    if (newComment.trim() === '') return;
    
    const comment: Comment = {
      id: Date.now().toString(), // Use timestamp for unique ID
      author: user?.name || 'Anonim Kullanıcı',
      content: newComment,
      timestamp: new Date().toISOString(),
      likes: 0
    };
    
    const updatedComments = [comment, ...comments];
    setComments(updatedComments);
    setNewComment('');
  };

  const handleLike = (id: string) => {
    // Check if user has already liked this comment
    if (likedComments.has(id)) {
      // User has already liked this comment, so remove the like
      const newLikedComments = new Set(likedComments);
      newLikedComments.delete(id);
      setLikedComments(newLikedComments);
      
      // Decrease comment likes
      const updatedComments = comments.map(comment => 
        comment.id === id ? { ...comment, likes: Math.max(0, comment.likes - 1) } : comment
      );
      setComments(updatedComments);
    } else {
      // User hasn't liked this comment yet, so add the like
      const newLikedComments = new Set(likedComments);
      newLikedComments.add(id);
      setLikedComments(newLikedComments);
      
      // Increase comment likes
      const updatedComments = comments.map(comment => 
        comment.id === id ? { ...comment, likes: comment.likes + 1 } : comment
      );
      setComments(updatedComments);
    }
  };

  // Function to delete comments (only for admin)
  const handleDeleteComment = (id: string) => {
    if (!isAdmin) return;
    
    if (window.confirm('Bu yorumu silmek istediğinizden emin misiniz?')) {
      const updatedComments = comments.filter(comment => comment.id !== id);
      setComments(updatedComments);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Yorumlar ({comments.length})</h2>
      
      {/* Add Comment Form */}
      {!isAuthenticated ? (
        <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Yorum yapmak için giriş yapmalısınız.
          </p>
          <div className="flex space-x-2">
            <Link href="/login">
              <span className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer">
                Giriş Yap
              </span>
            </Link>
            <span className="mx-2 text-gray-500 self-center">veya</span>
            <Link href="/register">
              <span className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors cursor-pointer">
                Kayıt Ol
              </span>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Yorum Ekle</h3>
          
          <div className="mb-4">
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Yorumunuz
            </label>
            <textarea
              id="comment"
              rows={4}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Yorumunuzu buraya yazın..."
              required
            />
          </div>
          
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Yorumu Gönder
          </button>
        </form>
      )}
      
      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">Henüz yorum yapılmadı. İlk yorumu siz yapın!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">{comment.author}</h4>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(comment.timestamp)}
                  </span>
                  {/* Show delete button only for admin users */}
                  {isAdmin && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Yorumu Sil"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                {comment.content}
              </p>
              
              <div className="flex items-center">
                <button
                  onClick={() => handleLike(comment.id)}
                  className={`flex items-center text-sm ${
                    likedComments.has(comment.id) 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : 'text-gray-500 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  {likedComments.has(comment.id) ? 'Beğenmekten Vazgeç' : 'Beğen'} ({comment.likes})
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
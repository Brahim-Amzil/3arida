'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/components/auth/AuthProvider';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  Timestamp,
  doc,
  updateDoc,
  increment,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Comment {
  id: string;
  petitionId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: Date;
  isAnonymous: boolean;
  likes: number;
  likedBy?: string[]; // Array of user IDs who liked this comment
  replies: Comment[];
}

interface PetitionCommentsProps {
  petitionId: string;
  className?: string;
  onCommentsCountChange?: (count: number) => void;
}

export default function PetitionComments({
  petitionId,
  className = '',
  onCommentsCountChange,
}: PetitionCommentsProps) {
  const { user, userProfile } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [sortBy, setSortBy] = useState<'latest' | 'mostLiked'>('latest');
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadComments();
  }, [petitionId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      console.log('🔍 Loading comments for petition:', petitionId);

      const commentsRef = collection(db, 'comments');
      const commentsQuery = query(
        commentsRef,
        where('petitionId', '==', petitionId),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(commentsQuery);
      const commentsList: Comment[] = [];

      console.log('📊 Found comments:', snapshot.size);

      snapshot.forEach((doc) => {
        const commentData = doc.data();
        const likedBy = commentData.likedBy || [];

        // Check if current user has liked this comment
        if (user && likedBy.includes(user.uid)) {
          setLikedComments((prev) => new Set(prev).add(doc.id));
        }

        commentsList.push({
          id: doc.id,
          petitionId: commentData.petitionId,
          authorId: commentData.authorId,
          authorName: commentData.authorName,
          content: commentData.content,
          createdAt: commentData.createdAt?.toDate() || new Date(),
          isAnonymous: commentData.isAnonymous || false,
          likes: commentData.likes || 0,
          likedBy: likedBy,
          replies: [], // TODO: Implement nested replies
        });
      });

      console.log('✅ Loaded comments:', commentsList.length);

      // Sort comments based on selected filter
      const sortedComments = sortComments(commentsList, sortBy);
      setComments(sortedComments);
      onCommentsCountChange?.(commentsList.length);
    } catch (error) {
      console.error('❌ Error loading comments:', error);
      alert('Failed to load comments. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const sortComments = (
    commentsList: Comment[],
    sortType: 'latest' | 'mostLiked'
  ) => {
    if (sortType === 'mostLiked') {
      return [...commentsList].sort((a, b) => b.likes - a.likes);
    }
    // Sort by latest (newest first)
    return [...commentsList].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  };

  // Re-sort when sortBy changes
  useEffect(() => {
    if (comments.length > 0) {
      setComments(sortComments(comments, sortBy));
    }
  }, [sortBy]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !userProfile || !newComment.trim()) return;

    try {
      setSubmitting(true);

      // Check rate limits (client-side check - also enforced server-side)
      const userCreatedAt = userProfile.createdAt || new Date();
      const { checkCommentRateLimit } = await import('@/lib/rate-limiting');
      const rateLimit = checkCommentRateLimit(user.uid, userCreatedAt);

      if (!rateLimit.allowed) {
        const resetDate = new Date(rateLimit.resetTime);
        const timeRemaining = Math.ceil(
          (rateLimit.resetTime - Date.now()) / 60000
        );
        alert(
          `${rateLimit.message}\n\nYou can comment again in ${timeRemaining} minute${timeRemaining !== 1 ? 's' : ''}.`
        );
        setSubmitting(false);
        return;
      }

      const commentData = {
        petitionId,
        authorId: user.uid,
        authorName: isAnonymous ? 'Anonymous' : userProfile.name,
        content: newComment.trim(),
        createdAt: Timestamp.fromDate(new Date()),
        isAnonymous,
        likes: 0,
      };

      const docRef = await addDoc(collection(db, 'comments'), commentData);

      // Add to local state
      const newCommentObj: Comment = {
        id: docRef.id,
        ...commentData,
        createdAt: new Date(),
        replies: [],
      };

      setComments((prev) => {
        const updated = [newCommentObj, ...prev];
        onCommentsCountChange?.(updated.length);
        return updated;
      });
      setNewComment('');
      setShowCommentForm(false);
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Failed to submit comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!user) {
      alert('Please sign in to like comments');
      return;
    }

    try {
      const commentRef = doc(db, 'comments', commentId);
      const isLiked = likedComments.has(commentId);

      if (isLiked) {
        // Unlike
        await updateDoc(commentRef, {
          likes: increment(-1),
          likedBy:
            comments
              .find((c) => c.id === commentId)
              ?.likedBy?.filter((id) => id !== user.uid) || [],
        });

        setLikedComments((prev) => {
          const newSet = new Set(prev);
          newSet.delete(commentId);
          return newSet;
        });

        setComments((prev) =>
          prev.map((c) =>
            c.id === commentId
              ? {
                  ...c,
                  likes: c.likes - 1,
                  likedBy: c.likedBy?.filter((id) => id !== user.uid),
                }
              : c
          )
        );
      } else {
        // Like
        const currentLikedBy =
          comments.find((c) => c.id === commentId)?.likedBy || [];
        await updateDoc(commentRef, {
          likes: increment(1),
          likedBy: [...currentLikedBy, user.uid],
        });

        setLikedComments((prev) => new Set(prev).add(commentId));

        setComments((prev) =>
          prev.map((c) =>
            c.id === commentId
              ? {
                  ...c,
                  likes: c.likes + 1,
                  likedBy: [...(c.likedBy || []), user.uid],
                }
              : c
          )
        );
      }
    } catch (error) {
      console.error('Error liking comment:', error);
      alert('Failed to like comment. Please try again.');
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString();
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <CardTitle>Discussion ({comments.length})</CardTitle>
          {user && !showCommentForm && (
            <Button onClick={() => setShowCommentForm(true)} size="sm">
              Add Comment
            </Button>
          )}
        </div>

        {/* Sort Filter */}
        {comments.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy('latest')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  sortBy === 'latest'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Latest
              </button>
              <button
                onClick={() => setSortBy('mostLiked')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  sortBy === 'mostLiked'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Most Liked
              </button>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Comment Form */}
        {showCommentForm && user && (
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <form onSubmit={handleSubmitComment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Share your thoughts
                </label>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Why do you support this petition?"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  disabled={submitting}
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="anonymous" className="text-sm text-gray-600">
                  Comment anonymously
                </label>
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={submitting || !newComment.trim()}
                  size="sm"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Posting...
                    </>
                  ) : (
                    'Post Comment'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowCommentForm(false);
                    setNewComment('');
                    setIsAnonymous(false);
                  }}
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Login Prompt */}
        {!user && (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <svg
              className="w-12 h-12 mx-auto mb-4 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Join the Discussion
            </h3>
            <p className="text-gray-600 mb-4">
              Sign in to share your thoughts and support this petition.
            </p>
            <Button asChild>
              <a
                href={`/auth/login?redirect=${encodeURIComponent(
                  typeof window !== 'undefined'
                    ? window.location.pathname
                    : '/petitions'
                )}`}
              >
                Sign In to Comment
              </a>
            </Button>
          </div>
        )}

        {/* Comments List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8">
            <svg
              className="w-12 h-12 mx-auto mb-4 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No comments yet
            </h3>
            <p className="text-gray-600">
              Be the first to share your thoughts on this petition.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-3">
                {/* Avatar */}
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-medium text-sm">
                    {comment.isAnonymous
                      ? '?'
                      : comment.authorName.charAt(0).toUpperCase()}
                  </span>
                </div>

                {/* Comment Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">
                      {comment.authorName}
                    </span>
                    {comment.isAnonymous && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        Anonymous
                      </span>
                    )}
                    <span className="text-sm text-gray-500">
                      {formatTimeAgo(comment.createdAt)}
                    </span>
                  </div>

                  <p className="text-gray-700 whitespace-pre-wrap mb-3">
                    {comment.content}
                  </p>

                  {/* Comment Actions */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLikeComment(comment.id)}
                      className={`flex items-center gap-1 text-sm transition-colors ${
                        likedComments.has(comment.id)
                          ? 'text-red-500 hover:text-red-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      disabled={!user}
                    >
                      <svg
                        className={`w-4 h-4 ${
                          likedComments.has(comment.id) ? 'fill-current' : ''
                        }`}
                        fill={
                          likedComments.has(comment.id)
                            ? 'currentColor'
                            : 'none'
                        }
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      {comment.likes > 0 && (
                        <span className="font-medium">{comment.likes}</span>
                      )}
                    </button>
                    <button className="text-sm text-gray-500 hover:text-gray-700">
                      Reply
                    </button>
                    {comment.authorId === user?.uid && (
                      <button className="text-sm text-red-500 hover:text-red-700">
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        {comments.length > 0 && comments.length % 10 === 0 && (
          <div className="text-center">
            <Button variant="outline" size="sm">
              Load More Comments
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

import { useAuth } from '@/components/auth/AuthProvider';
import { useBanner } from '@/contexts/BannerContext';
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
  limit,
  startAfter,
  DocumentSnapshot,
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
  likedBy?: string[];
  parentId?: string; // For replies
  replyCount?: number; // Number of replies
  replies?: Comment[]; // Nested replies
  deleted?: boolean; // Soft delete flag
  deletedAt?: Date; // When it was deleted
  deletedBy?: string; // Who deleted it
}

interface Signature {
  id: string;
  name: string;
  location?: {
    city?: string;
    country?: string;
  };
  comment?: string;
  signedAt: Date;
}

interface PetitionSupportersProps {
  petitionId: string;
  className?: string;
}

export default function PetitionSupporters({
  petitionId,
  className = '',
}: PetitionSupportersProps) {
  const { user, userProfile } = useAuth();
  const banner = useBanner();
  const [view, setView] = useState<'all' | 'comments' | 'signatures'>(
    'comments'
  );
  const [comments, setComments] = useState<Comment[]>([]);
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [sortBy, setSortBy] = useState<'latest' | 'mostLiked'>('latest');
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null); // Comment ID being replied to
  const [replyText, setReplyText] = useState('');
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(
    new Set()
  ); // Expanded comment IDs
  const [deletingComment, setDeletingComment] = useState<string | null>(null); // Comment ID being deleted (for confirmation)
  const [isDeleting, setIsDeleting] = useState(false); // Loading state for delete action
  const PAGE_SIZE = 20;

  useEffect(() => {
    loadData();
  }, [petitionId, view]);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([loadComments(), loadSignatures()]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const commentsRef = collection(db, 'comments');
      const commentsQuery = query(
        commentsRef,
        where('petitionId', '==', petitionId),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(commentsQuery);
      const allComments: Comment[] = [];
      const commentsMap = new Map<string, Comment>();

      // First pass: Create all comment objects
      snapshot.forEach((doc) => {
        const commentData = doc.data();
        const likedBy = commentData.likedBy || [];

        if (user && likedBy.includes(user.uid)) {
          setLikedComments((prev) => new Set(prev).add(doc.id));
        }

        const comment: Comment = {
          id: doc.id,
          petitionId: commentData.petitionId,
          authorId: commentData.authorId,
          authorName: commentData.authorName,
          content: commentData.content,
          createdAt: commentData.createdAt?.toDate() || new Date(),
          isAnonymous: commentData.isAnonymous || false,
          likes: commentData.likes || 0,
          likedBy: likedBy,
          parentId: commentData.parentId || null,
          replies: [],
          replyCount: 0,
          deleted: commentData.deleted || false,
          deletedAt: commentData.deletedAt?.toDate(),
          deletedBy: commentData.deletedBy,
        };

        commentsMap.set(doc.id, comment);
        allComments.push(comment);
      });

      // Second pass: Organize into parent-child structure
      const topLevelComments: Comment[] = [];

      allComments.forEach((comment) => {
        if (comment.parentId) {
          // This is a reply
          const parent = commentsMap.get(comment.parentId);
          if (parent) {
            parent.replies = parent.replies || [];
            parent.replies.push(comment);
            parent.replyCount = (parent.replyCount || 0) + 1;
          }
        } else {
          // This is a top-level comment
          topLevelComments.push(comment);
        }
      });

      // Sort replies by date (oldest first for natural conversation flow)
      topLevelComments.forEach((comment) => {
        if (comment.replies && comment.replies.length > 0) {
          comment.replies.sort(
            (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
          );
        }
      });

      setComments(sortComments(topLevelComments, sortBy));
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const loadSignatures = async (loadMore = false) => {
    try {
      if (loadMore) {
        setLoadingMore(true);
      }

      const signaturesRef = collection(db, 'signatures');
      let q = query(
        signaturesRef,
        where('petitionId', '==', petitionId),
        orderBy('createdAt', 'desc'),
        limit(PAGE_SIZE)
      );

      if (loadMore && lastDoc) {
        q = query(
          signaturesRef,
          where('petitionId', '==', petitionId),
          orderBy('createdAt', 'desc'),
          startAfter(lastDoc),
          limit(PAGE_SIZE)
        );
      }

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setHasMore(false);
        return;
      }

      const newSignatures = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.signerName || data.name || 'Anonymous',
          location: data.signerLocation || data.location,
          comment: data.comment,
          signedAt:
            data.createdAt?.toDate() || data.verifiedAt?.toDate() || new Date(),
        };
      });

      if (loadMore) {
        setSignatures((prev) => [...prev, ...newSignatures]);
      } else {
        setSignatures(newSignatures);
      }

      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === PAGE_SIZE);
    } catch (error) {
      console.error('Error loading signatures:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const sortComments = (
    commentsList: Comment[],
    sortType: 'latest' | 'mostLiked'
  ) => {
    if (sortType === 'mostLiked') {
      return [...commentsList].sort((a, b) => b.likes - a.likes);
    }
    return [...commentsList].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  };

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

      const newCommentObj: Comment = {
        id: docRef.id,
        ...commentData,
        createdAt: new Date(),
        replies: [],
        replyCount: 0,
      };

      setComments((prev) => [newCommentObj, ...prev]);
      setNewComment('');
      setShowCommentForm(false);
    } catch (error) {
      console.error('Error submitting comment:', error);
      banner.error('Failed to submit comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!user || !userProfile || !replyText.trim()) return;

    try {
      setSubmitting(true);

      const replyData = {
        petitionId,
        authorId: user.uid,
        authorName: userProfile.name, // Replies are never anonymous
        content: replyText.trim(),
        createdAt: Timestamp.fromDate(new Date()),
        isAnonymous: false,
        likes: 0,
        parentId, // Link to parent comment
      };

      const docRef = await addDoc(collection(db, 'comments'), replyData);

      const newReply: Comment = {
        id: docRef.id,
        ...replyData,
        createdAt: new Date(),
      };

      // Update local state
      setComments((prev) =>
        prev.map((comment) => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newReply],
              replyCount: (comment.replyCount || 0) + 1,
            };
          }
          return comment;
        })
      );

      // Expand replies to show the new reply
      setExpandedReplies((prev) => new Set(prev).add(parentId));

      // Clear reply form
      setReplyText('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Error submitting reply:', error);
      banner.error('Failed to submit reply. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleReplies = (commentId: string) => {
    setExpandedReplies((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const handleLikeComment = async (commentId: string) => {
    if (!user) {
      banner.info('Please sign in to like comments');
      return;
    }

    try {
      const commentRef = doc(db, 'comments', commentId);
      const isLiked = likedComments.has(commentId);

      if (isLiked) {
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
      banner.error('Failed to like comment. Please try again.');
    }
  };

  const handleDeleteComment = async (
    commentId: string,
    isReply: boolean = false
  ) => {
    if (!user || isDeleting) return;

    try {
      setIsDeleting(true);
      const commentRef = doc(db, 'comments', commentId);

      // Soft delete - mark as deleted but keep in database
      await updateDoc(commentRef, {
        deleted: true,
        deletedAt: Timestamp.fromDate(new Date()),
        deletedBy: user.uid,
      });

      // Update local state
      setComments((prev) =>
        prev.map((comment) => {
          if (comment.id === commentId) {
            // Deleting a top-level comment
            return {
              ...comment,
              deleted: true,
              deletedAt: new Date(),
              deletedBy: user.uid,
            };
          } else if (comment.replies) {
            // Check if it's a reply being deleted
            return {
              ...comment,
              replies: comment.replies.map((reply) =>
                reply.id === commentId
                  ? {
                      ...reply,
                      deleted: true,
                      deletedAt: new Date(),
                      deletedBy: user.uid,
                    }
                  : reply
              ),
            };
          }
          return comment;
        })
      );

      // Clear the confirmation state
      setDeletingComment(null);
      banner.success(
        isReply ? 'Reply deleted successfully' : 'Comment deleted successfully'
      );
    } catch (error) {
      console.error('Error deleting comment:', error);
      banner.error('Failed to delete. Please try again.');
    } finally {
      setIsDeleting(false);
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

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadSignatures(true);
    }
  };

  // Combine and sort all items for "all" view
  const getAllItems = () => {
    const items: Array<
      | { type: 'comment'; data: Comment }
      | { type: 'signature'; data: Signature }
    > = [];

    comments.forEach((comment) => {
      items.push({ type: 'comment', data: comment });
    });

    signatures.forEach((signature) => {
      if (signature.comment) {
        items.push({ type: 'signature', data: signature });
      }
    });

    return items.sort((a, b) => {
      const dateA = a.type === 'comment' ? a.data.createdAt : a.data.signedAt;
      const dateB = b.type === 'comment' ? b.data.createdAt : b.data.signedAt;
      return dateB.getTime() - dateA.getTime();
    });
  };

  const totalCount =
    view === 'all'
      ? comments.length + signatures.filter((s) => s.comment).length
      : view === 'comments'
        ? comments.length
        : signatures.length;

  return (
    <div className={className}>
      {/* Modern Tab Design */}
      <div className="space-y-3 mb-4">
        {/* Full-width Pill-shaped Tabs */}
        <div className="flex gap-2 p-1 bg-gray-100 rounded-full w-full">
          <button
            onClick={() => setView('comments')}
            className={`flex-1 py-2 text-sm font-medium rounded-full transition-all whitespace-nowrap ${
              view === 'comments'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Comments ({comments.length})
          </button>
          <button
            onClick={() => setView('signatures')}
            className={`flex-1 py-2 text-sm font-medium rounded-full transition-all whitespace-nowrap ${
              view === 'signatures'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Signatures ({signatures.length})
          </button>
        </div>

        {/* Add Comment & Sort - Only show in comments view */}
        {view === 'comments' && (
          <div className="flex items-center justify-between">
            {/* Circular Add Comment Button */}
            {user && !showCommentForm && (
              <button
                onClick={() => setShowCommentForm(true)}
                className="w-11 h-11 flex items-center justify-center bg-green-600 text-white rounded-full hover:bg-green-700 transition-all shadow-md hover:shadow-lg flex-shrink-0"
                title="Add Comment"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            )}

            {/* Sort Buttons - Only show if there are comments */}
            {comments.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={() => setSortBy('latest')}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                    sortBy === 'latest'
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Latest
                </button>
                <button
                  onClick={() => setSortBy('mostLiked')}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                    sortBy === 'mostLiked'
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Most Liked
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-6">
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
                    : `/petitions/${petitionId}`
                )}`}
              >
                Sign In to Comment
              </a>
            </Button>
          </div>
        )}

        {/* Content */}
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
        ) : totalCount === 0 ? (
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
              No{' '}
              {view === 'comments'
                ? 'comments'
                : view === 'signatures'
                  ? 'signatures'
                  : 'activity'}{' '}
              yet
            </h3>
            <p className="text-gray-600">
              {view === 'comments'
                ? 'Be the first to share your thoughts on this petition.'
                : view === 'signatures'
                  ? 'Be the first to sign this petition!'
                  : 'Be the first to support this petition.'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* All View - Mixed comments and signatures with comments */}
            {view === 'all' &&
              getAllItems().map((item, index) => {
                if (item.type === 'comment') {
                  const comment = item.data as Comment;
                  return (
                    <div
                      key={`comment-${comment.id}`}
                      className="flex items-start space-x-3"
                    >
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 font-medium text-sm">
                          {comment.isAnonymous
                            ? '?'
                            : comment.authorName.charAt(0).toUpperCase()}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">
                            {comment.authorName}
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            Comment
                          </span>
                          {comment.isAnonymous && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                              Anonymous
                            </span>
                          )}
                          <span
                            className="text-sm text-gray-500"
                            suppressHydrationWarning
                          >
                            {formatTimeAgo(comment.createdAt)}
                          </span>
                        </div>

                        {comment.deleted ? (
                          <p className="text-gray-400 italic mb-3">
                            [Comment deleted]
                          </p>
                        ) : (
                          <p className="text-gray-700 whitespace-pre-wrap mb-3">
                            {comment.content}
                          </p>
                        )}

                        <div className="flex items-center gap-4">
                          {!comment.deleted && (
                            <>
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
                                    likedComments.has(comment.id)
                                      ? 'fill-current'
                                      : ''
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
                                  <span className="font-medium">
                                    {comment.likes}
                                  </span>
                                )}
                              </button>

                              {/* Reply Button */}
                              <button
                                onClick={() => {
                                  if (!user) {
                                    alert('Please sign in to reply');
                                    return;
                                  }
                                  setReplyingTo(comment.id);
                                  setReplyText('');
                                }}
                                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                              >
                                Reply
                              </button>

                              {/* Delete Button - Only show for comment author */}
                              {user && user.uid === comment.authorId && (
                                <button
                                  onClick={() => setDeletingComment(comment.id)}
                                  className="text-sm text-red-500 hover:text-red-600 transition-colors"
                                >
                                  Delete
                                </button>
                              )}
                            </>
                          )}

                          {/* Show Replies Button */}
                          {(comment.replyCount || 0) > 0 && (
                            <button
                              onClick={() => toggleReplies(comment.id)}
                              className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                            >
                              {expandedReplies.has(comment.id)
                                ? `Hide ${comment.replyCount} ${comment.replyCount === 1 ? 'reply' : 'replies'}`
                                : `Show ${comment.replyCount} ${comment.replyCount === 1 ? 'reply' : 'replies'}`}
                            </button>
                          )}
                        </div>

                        {/* Delete Confirmation */}
                        {deletingComment === comment.id && (
                          <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                            <p className="text-sm text-gray-700 mb-3">
                              Are you sure you want to delete this comment?
                              Replies will still be visible.
                            </p>
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  handleDeleteComment(comment.id, false)
                                }
                                disabled={isDeleting}
                                className="px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                              >
                                {isDeleting && (
                                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                )}
                                {isDeleting ? 'Deleting...' : 'Delete'}
                              </button>
                              <button
                                onClick={() => setDeletingComment(null)}
                                disabled={isDeleting}
                                className="px-3 py-1.5 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors disabled:opacity-50"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Reply Form */}
                        {replyingTo === comment.id && (
                          <div className="mt-3 ml-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <textarea
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Write your reply..."
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-none text-sm"
                              disabled={submitting}
                            />
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={() => handleSubmitReply(comment.id)}
                                disabled={submitting || !replyText.trim()}
                                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {submitting ? 'Posting...' : 'Post Reply'}
                              </button>
                              <button
                                onClick={() => {
                                  setReplyingTo(null);
                                  setReplyText('');
                                }}
                                className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Replies List */}
                        {expandedReplies.has(comment.id) &&
                          comment.replies &&
                          comment.replies.length > 0 && (
                            <div className="mt-4 ml-2 space-y-3 border-l-2 border-gray-200 pl-2">
                              {comment.replies.map((reply) => (
                                <div
                                  key={reply.id}
                                  className="flex items-start space-x-2"
                                >
                                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-blue-600 font-medium text-xs">
                                      {reply.authorName.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-medium text-sm text-gray-900">
                                        {reply.authorName}
                                      </span>
                                      <span
                                        className="text-xs text-gray-500"
                                        suppressHydrationWarning
                                      >
                                        {formatTimeAgo(reply.createdAt)}
                                      </span>
                                    </div>
                                    {reply.deleted ? (
                                      <p className="text-sm text-gray-400 italic">
                                        [Reply deleted]
                                      </p>
                                    ) : (
                                      <p className="text-sm text-gray-700">
                                        {reply.content}
                                      </p>
                                    )}
                                    {!reply.deleted && (
                                      <div className="flex items-center gap-3 mt-1">
                                        <button
                                          onClick={() =>
                                            handleLikeComment(reply.id)
                                          }
                                          className={`flex items-center gap-1 text-xs transition-colors ${
                                            likedComments.has(reply.id)
                                              ? 'text-red-500 hover:text-red-600'
                                              : 'text-gray-500 hover:text-gray-700'
                                          }`}
                                          disabled={!user}
                                        >
                                          <svg
                                            className={`w-3 h-3 ${
                                              likedComments.has(reply.id)
                                                ? 'fill-current'
                                                : ''
                                            }`}
                                            fill={
                                              likedComments.has(reply.id)
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
                                          {reply.likes > 0 && (
                                            <span className="font-medium">
                                              {reply.likes}
                                            </span>
                                          )}
                                        </button>

                                        {/* Delete Button - Only show for reply author */}
                                        {user &&
                                          user.uid === reply.authorId && (
                                            <button
                                              onClick={() =>
                                                setDeletingComment(reply.id)
                                              }
                                              className="text-xs text-red-500 hover:text-red-600 transition-colors"
                                            >
                                              Delete
                                            </button>
                                          )}
                                      </div>
                                    )}

                                    {/* Delete Confirmation for Reply */}
                                    {deletingComment === reply.id && (
                                      <div className="mt-2 p-2 bg-red-50 rounded border border-red-200">
                                        <p className="text-xs text-gray-700 mb-2">
                                          Delete this reply?
                                        </p>
                                        <div className="flex gap-2">
                                          <button
                                            onClick={() =>
                                              handleDeleteComment(
                                                reply.id,
                                                true
                                              )
                                            }
                                            disabled={isDeleting}
                                            className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                                          >
                                            {isDeleting && (
                                              <div className="animate-spin rounded-full h-2 w-2 border-b-2 border-white"></div>
                                            )}
                                            {isDeleting
                                              ? 'Deleting...'
                                              : 'Delete'}
                                          </button>
                                          <button
                                            onClick={() =>
                                              setDeletingComment(null)
                                            }
                                            disabled={isDeleting}
                                            className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
                                          >
                                            Cancel
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                    </div>
                  );
                } else {
                  const signature = item.data as Signature;
                  return (
                    <div
                      key={`signature-${signature.id}`}
                      className="flex items-start space-x-3"
                    >
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-purple-600 font-medium text-sm">
                          {signature.name.charAt(0).toUpperCase()}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">
                            {signature.name}
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            <svg
                              className="w-3 h-3 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Signed
                          </span>
                          {signature.location && (
                            <span className="text-sm text-gray-500">
                              {[
                                signature.location.city,
                                signature.location.country,
                              ]
                                .filter(Boolean)
                                .join(', ')}
                            </span>
                          )}
                          <span
                            className="text-sm text-gray-500"
                            suppressHydrationWarning
                          >
                            {formatTimeAgo(signature.signedAt)}
                          </span>
                        </div>

                        {signature.comment && (
                          <p className="text-gray-700 italic">
                            "{signature.comment}"
                          </p>
                        )}
                      </div>
                    </div>
                  );
                }
              })}

            {/* Comments Only View */}
            {view === 'comments' &&
              comments.map((comment) => (
                <div key={comment.id} className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-medium text-sm">
                      {comment.isAnonymous
                        ? '?'
                        : comment.authorName.charAt(0).toUpperCase()}
                    </span>
                  </div>

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
                      <span
                        className="text-sm text-gray-500"
                        suppressHydrationWarning
                      >
                        {formatTimeAgo(comment.createdAt)}
                      </span>
                    </div>

                    {comment.deleted ? (
                      <p className="text-gray-400 italic mb-3">
                        [Comment deleted]
                      </p>
                    ) : (
                      <p className="text-gray-700 whitespace-pre-wrap mb-3">
                        {comment.content}
                      </p>
                    )}

                    <div className="flex items-center gap-4">
                      {!comment.deleted && (
                        <>
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
                                likedComments.has(comment.id)
                                  ? 'fill-current'
                                  : ''
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
                              <span className="font-medium">
                                {comment.likes}
                              </span>
                            )}
                          </button>

                          {/* Reply Button */}
                          <button
                            onClick={() => {
                              if (!user) {
                                banner.info('Please sign in to reply');
                                return;
                              }
                              setReplyingTo(comment.id);
                              setReplyText('');
                            }}
                            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                          >
                            Reply
                          </button>

                          {/* Delete Button - Only show for comment author */}
                          {user && user.uid === comment.authorId && (
                            <button
                              onClick={() => setDeletingComment(comment.id)}
                              className="text-sm text-red-500 hover:text-red-600 transition-colors"
                            >
                              Delete
                            </button>
                          )}
                        </>
                      )}

                      {/* Show Replies Button */}
                      {(comment.replyCount || 0) > 0 && (
                        <button
                          onClick={() => toggleReplies(comment.id)}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                        >
                          {expandedReplies.has(comment.id)
                            ? `Hide ${comment.replyCount} ${comment.replyCount === 1 ? 'reply' : 'replies'}`
                            : `Show ${comment.replyCount} ${comment.replyCount === 1 ? 'reply' : 'replies'}`}
                        </button>
                      )}
                    </div>

                    {/* Delete Confirmation */}
                    {deletingComment === comment.id && (
                      <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                        <p className="text-sm text-gray-700 mb-3">
                          Are you sure you want to delete this comment? Replies
                          will still be visible.
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              handleDeleteComment(comment.id, false)
                            }
                            className="px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setDeletingComment(null)}
                            className="px-3 py-1.5 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Delete Confirmation */}
                    {deletingComment === comment.id && (
                      <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                        <p className="text-sm text-gray-700 mb-3">
                          Are you sure you want to delete this comment? Replies
                          will still be visible.
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              handleDeleteComment(comment.id, false)
                            }
                            className="px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setDeletingComment(null)}
                            className="px-3 py-1.5 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Reply Form */}
                    {replyingTo === comment.id && (
                      <div className="mt-3 ml-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write your reply..."
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-none text-sm"
                          disabled={submitting}
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleSubmitReply(comment.id)}
                            disabled={submitting || !replyText.trim()}
                            className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {submitting ? 'Posting...' : 'Post Reply'}
                          </button>
                          <button
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyText('');
                            }}
                            className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Replies List */}
                    {expandedReplies.has(comment.id) &&
                      comment.replies &&
                      comment.replies.length > 0 && (
                        <div className="mt-4 ml-2 space-y-3 border-l-2 border-gray-200 pl-2">
                          {comment.replies.map((reply) => (
                            <div
                              key={reply.id}
                              className="flex items-start space-x-2"
                            >
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-blue-600 font-medium text-xs">
                                  {reply.authorName.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-sm text-gray-900">
                                    {reply.authorName}
                                  </span>
                                  <span
                                    className="text-xs text-gray-500"
                                    suppressHydrationWarning
                                  >
                                    {formatTimeAgo(reply.createdAt)}
                                  </span>
                                </div>
                                {reply.deleted ? (
                                  <p className="text-sm text-gray-400 italic">
                                    [Reply deleted]
                                  </p>
                                ) : (
                                  <p className="text-sm text-gray-700">
                                    {reply.content}
                                  </p>
                                )}
                                {!reply.deleted && (
                                  <div className="flex items-center gap-3 mt-1">
                                    <button
                                      onClick={() =>
                                        handleLikeComment(reply.id)
                                      }
                                      className={`flex items-center gap-1 text-xs transition-colors ${
                                        likedComments.has(reply.id)
                                          ? 'text-red-500 hover:text-red-600'
                                          : 'text-gray-500 hover:text-gray-700'
                                      }`}
                                      disabled={!user}
                                    >
                                      <svg
                                        className={`w-3 h-3 ${
                                          likedComments.has(reply.id)
                                            ? 'fill-current'
                                            : ''
                                        }`}
                                        fill={
                                          likedComments.has(reply.id)
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
                                      {reply.likes > 0 && (
                                        <span className="font-medium">
                                          {reply.likes}
                                        </span>
                                      )}
                                    </button>

                                    {/* Delete Button - Only show for reply author */}
                                    {user && user.uid === reply.authorId && (
                                      <button
                                        onClick={() =>
                                          setDeletingComment(reply.id)
                                        }
                                        className="text-xs text-red-500 hover:text-red-600 transition-colors"
                                      >
                                        Delete
                                      </button>
                                    )}
                                  </div>
                                )}

                                {/* Delete Confirmation for Reply */}
                                {deletingComment === reply.id && (
                                  <div className="mt-2 p-2 bg-red-50 rounded border border-red-200">
                                    <p className="text-xs text-gray-700 mb-2">
                                      Delete this reply?
                                    </p>
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() =>
                                          handleDeleteComment(reply.id, true)
                                        }
                                        className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                                      >
                                        Delete
                                      </button>
                                      <button
                                        onClick={() => setDeletingComment(null)}
                                        className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {/* Delete Confirmation for Reply */}
                                {deletingComment === reply.id && (
                                  <div className="mt-2 p-2 bg-red-50 rounded border border-red-200">
                                    <p className="text-xs text-gray-700 mb-2">
                                      Delete this reply?
                                    </p>
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() =>
                                          handleDeleteComment(reply.id, true)
                                        }
                                        className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                                      >
                                        Delete
                                      </button>
                                      <button
                                        onClick={() => setDeletingComment(null)}
                                        className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                </div>
              ))}

            {/* Signatures Only View */}
            {view === 'signatures' &&
              signatures.map((signature) => (
                <div
                  key={signature.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <span className="text-green-700 font-medium text-sm">
                            {signature.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {signature.name}
                          </p>
                          {signature.location && (
                            <p className="text-sm text-gray-500">
                              {[
                                signature.location.city,
                                signature.location.country,
                              ]
                                .filter(Boolean)
                                .join(', ')}
                            </p>
                          )}
                        </div>
                      </div>
                      {signature.comment && (
                        <p className="mt-2 text-sm text-gray-700 italic">
                          "{signature.comment}"
                        </p>
                      )}
                    </div>
                    <span
                      className="text-xs text-gray-400 whitespace-nowrap ml-4"
                      suppressHydrationWarning
                    >
                      {signature.signedAt.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Load More for Signatures */}
        {view === 'signatures' && hasMore && signatures.length > 0 && (
          <div className="flex justify-center pt-4">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loadingMore ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Loading...
                </span>
              ) : (
                'Load More'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
